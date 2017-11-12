const crypto = require('crypto');
const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const expressJoi = require('express-joi-validator');
const { post } = require('../src/schemas/event')(Joi);
const db = require('../models');
const config = require('../config');
const Hashids = require('hashids');

const hashids = new Hashids(config.hashidsSeed, 12);

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

const sendNotif = (attendee) => {
  const eventId = hashids.encode(attendee.EventId);
  if (!config.sendEmails) {
    console.log(`CONFIRMATION URL ---> ${config.baseUrl}/event/${eventId}/${attendee.token}`);
  }
};

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
    sendNotif(req.attendee);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = app;
