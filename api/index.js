
const express = require('express');
const helmet = require('helmet');
const version = require('../package.json').version;

const app = express.Router();
app
  .use(https)
  .use(helmet());

app.get('/version', async (req, res, next) => {
  res.json({ version });
});

app
  .use(notfound)
  .use(errors);

function https(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers['x-forwarded-proto'];
    if (proto === 'https' || proto === undefined) {
      return next();
    }
    return res.redirect(301, `https://${req.get('Host')}${req.originalUrl}`);
  } else {
    return next();
  }
}

function notfound(req, res, next) {
  res.status(404).json({
    message: 'Not found',
  });
}

function errors(err, req, res, next) {
  console.log(err);
  res.status(500).json({
    message: 'something went wrong'
  });
}

module.exports = app;
