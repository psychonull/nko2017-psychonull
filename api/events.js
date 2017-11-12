const crypto = require('crypto');
const express = require('express');
const Joi = require('joi');
const expressJoi = require('express-joi-validator');
const { post } = require('../src/schemas/event')(Joi);
const _ = require('lodash');
const db = require('../models');
const config = require('../config');
const middlewares = require('./middlewares');
const attendeesRouter = require('./attendees');
const eventsController = require('../controllers/events');
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

const createAttendee = (event, user) => createToken()
  .then(token => db.Attendee.create({
    EventId: event.id,
    UserId: user.id,
    token,
    name: user.name,
  }));

const sendNotif = (event, token, to) => {
  const link = `${config.baseUrl}/events/${event.code}/${token}`;
  mailer.send.eventConfirmation(to, link, event.title, event.body);
};

app.param('eventId', eventsController.eventById);

app.post('/', expressJoi({ body: post }), async (req, res, next) => {
  try {
    const [user] = await db.User.findCreateFind({
      where: { email: req.body.email },
      defaults: {
        email: req.body.email,
        name: req.body.name,
      },
    });
    const event = await db.Event.create({
      ..._.pick(req.body, ['title', 'body', 'when', 'maxAttendees']),
      createdById: user.id,
    });
    req.event = event;
    req.attendee = await createAttendee(req.event, user);
    sendNotif(req.event, req.attendee.token, user.email);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get('/:eventId', middlewares.authorize(false), (req, res) => {
  const hiddenUserProps = ['id', 'email', 'createdAt', 'updatedAt', 'deletedAt'];
  const baseObj = _.omit(req.event.toJSON(), ['id', 'createdById', 'deletedAt']);
  let responseBody = Object.assign(baseObj, {
    attendees: req.event.toJSON().attendees.map(att => ({
      ..._.omit(att.Attendee, ['token']),
      email: att.email,
    })),
  });
  if (req.user) {
    if (responseBody.createdBy.id === req.user.id) {
      responseBody.createdBy.me = true;
    }
    responseBody.attendees = responseBody.attendees.map((att) => {
      if (att.UserId === req.user.id) {
        return {
          ...att,
          me: true,
        };
      }
      return att;
    });
  }
  responseBody = Object.assign(responseBody, {
    createdBy: _.omit(responseBody.createdBy, hiddenUserProps),
    attendees: responseBody.attendees.map(a => _.omit(a, hiddenUserProps)),
  });
  return res.json(responseBody);
});

app.use('/:eventId/attendees', attendeesRouter);

module.exports = app;
