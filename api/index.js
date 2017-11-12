
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { version } = require('../package.json');
const middlewares = require('./middlewares');
const eventsRouter = require('./events');

const app = express.Router();

app
  .use(middlewares.https)
  .use(bodyParser.json())
  .use(helmet());

app.get('/version', async (req, res) => {
  res.json({ version });
});

app.use('/events', eventsRouter);

app
  .use(middlewares.notfound)
  .use(middlewares.errors);

module.exports = app;
