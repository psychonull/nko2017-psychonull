
const express = require('express');
const Joi = require('joi');
const expressJoi = require('express-joi-validator');

const app = express.Router();

const postSchema = {
  body: {
    title: Joi.string().required(),
    body: Joi.string(),
    email: Joi.string().email().required(),
    when: Joi.date().iso().required(),
    maxAttendees: Joi.number().min(0),
  },
};

app.post('/', expressJoi(postSchema), async (req, res) => {
  res.status(204).end();
});

module.exports = app;
