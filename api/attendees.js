const crypto = require('crypto');
const express = require('express');
const Joi = require('joi');
const expressJoi = require('express-joi-validator');
const { post } = require('../src/schemas/attendee')(Joi);
const db = require('../models');
const config = require('../config');
const middlewares = require('./middlewares');
const mailer = require('../mailer');

const app = express.Router();

const createToken = () => new Promise((resolve, reject) => {
  const LENGTH = 20;
  crypto.randomBytes(LENGTH, (err, buf) => {
    if (err) {
      return reject(err);
    }
    return resolve(buf.toString('hex'));
  });
});

const sendNotif = (event, token, to) => {
  const link = `${config.baseUrl}/event/${event.code}/${token}`;
  mailer.send.attendanceConfirmation(to, link, event.title, event.body);
};

const canAddAttendee = (req, res, next) => {
  if (req.event.status === 'PENDING') {
    return next({ statusCode: 400, message: 'Cannot join an event that is pending confirmation from the owner' });
  }
  if (req.event.status === 'CANCELLED') {
    return next({ statusCode: 400, message: 'Cannot join an event that has been cancelled by the owner' });
  }
  if (req.event.when < new Date()) {
    return next({ statusCode: 400, message: 'Cannot subscribe to events from the past' });
  }
  if (req.event.attendees.length + 1 > req.event.maxAttendance) {
    return next({ statusCode: 400, message: 'maxAttendance: the event is full' });
  }
  return next();
};

app.post('/', expressJoi({ body: post }), canAddAttendee, async (req, res, next) => {
  try {
    const [user] = await db.User.findCreateFind({
      where: { email: req.body.email },
      defaults: {
        email: req.body.email,
        name: req.body.name,
      },
    });
    const existingAttendee = await db.Attendee.findOne({
      where: {
        UserId: user.id,
        EventId: req.event.id,
      },
    });
    if (!existingAttendee) {
      const token = await createToken();
      await req.event.addAttendee(user, { through: { token, name: req.body.name } });
      sendNotif(req.event, token, user.email);
    } else {
      sendNotif(req.event, existingAttendee.token, user.email);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.delete('/', middlewares.authorize(true), (req, res, next) => {
  db.Attendee.update({ status: 'DELETED' }, {
    where: {
      UserId: req.user.id,
      EventId: req.event.id,
    },
  })
    .then(() => res.status(204).end())
    .catch(next);
});

module.exports = app;
