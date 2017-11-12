
const express = require('express');
const Joi = require('joi');
const expressJoi = require('express-joi-validator');
const { post } = require('../schemas/event')(Joi);

const app = express.Router();

app.post('/', expressJoi({ body: post }), async (req, res) => {
  res.status(204).end();
});

module.exports = app;
