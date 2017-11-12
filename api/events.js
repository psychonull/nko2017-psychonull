const express = require('express');
const Joi = require('joi');
const expressJoi = require('express-joi-validator');
const _ = require('lodash');
const db = require('../models');

const app = express.Router();

const postSchema = {
  body: {
    title: Joi.string().required(),
    body: Joi.string(),
    name: Joi.string(),
    email: Joi.string().email().required(),
    when: Joi.date().iso().required(),
    maxAttendees: Joi.number().min(0),
  },
};

app.post('/', expressJoi(postSchema), async (req, res, next) => {
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
