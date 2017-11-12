const _ = require('lodash');

const defaultConfig = {
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:pavone@localhost/nko_2017',
  baseUrl: 'http://localhost:3000',
  hashidsSeed: 'psychonull',
  mailgun: false,
  mailer: {
    from: 'eventapp (nko17) <sender@sandbox00fc75e8e0614d9abdc656e7824ddcbb.mailgun.org>',
  },
};

const configs = {
  development: {
  },
  test: {
  },
  production: {
    baseUrl: 'https://evening-tundra-70408.herokuapp.com',
    mailgun: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  },
};

module.exports = _.merge(defaultConfig, configs[process.env.NODE_ENV || 'development']);
