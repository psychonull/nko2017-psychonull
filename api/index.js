
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { version } = require('../package.json');
const eventsRouter = require('./events');

const app = express.Router();

function https(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers['x-forwarded-proto'];
    if (proto === 'https' || proto === undefined) {
      return next();
    }
    return res.redirect(301, `https://${req.get('Host')}${req.originalUrl}`);
  }
  return next();
}

function notfound(req, res) {
  res.status(404).json({
    message: 'Not found',
  });
}

function errors(err, req, res, next) { // eslint-disable-line
  if (err.isBoom) {
    // joi request validation errors...
    return res
      .status(err.output.statusCode)
      .json(err.output.payload);
  } else if (err.statusCode === 404) {
    return res.status(404).json({
      message: err.message || 'Entity not found',
    });
  }
  console.log('ERROR: ', err);
  return res.status(500).json({
    message: 'something went wrong',
  });
}

app
  .use(https)
  .use(bodyParser.json())
  .use(helmet());

app.get('/version', async (req, res) => {
  res.json({ version });
});

app.use('/events', eventsRouter);

app
  .use(notfound)
  .use(errors);

module.exports = app;
