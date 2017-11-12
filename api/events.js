const express = require('express');
const Joi = require('joi');
const expressJoi = require('express-joi-validator');
const { post } = require('../src/schemas/event')(Joi);
const _ = require('lodash');
const db = require('../models');

const app = express.Router();

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
      CreatedById: user.id,
    });
    req.event = event;
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = app;
