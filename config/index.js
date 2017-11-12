const _ = require('lodash');

const defaultConfig = {
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:pavone@localhost/nko_2017',
  baseUrl: 'http://localhost:3000',
  hashidsSeed: 'psychonull',
  sendgrid: false,
  mailer: {
    from: 'eventapp (nko17) <bot@no-reply.org>',
  },
};

const configs = {
  development: {
  },
  test: {
  },
  production: {
    baseUrl: 'https://evening-tundra-70408.herokuapp.com',
    sendgrid: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  },
};

module.exports = _.merge(defaultConfig, configs[process.env.NODE_ENV || 'development']);
