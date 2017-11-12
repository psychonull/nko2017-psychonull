const _ = require('lodash');

const defaultConfig = {
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:pavone@localhost/nko_2017',
  baseUrl: 'http://localhost:3000',
  hashidsSeed: 'psychonull',
  sendEmails: false,
};

const configs = {
  development: {
  },
  test: {
  },
  production: {
    baseUrl: 'https://evening-tundra-70408.herokuapp.com',
    sendEmails: true,
  },
};

module.exports = _.merge(defaultConfig, configs[process.env.NODE_ENV || 'development']);
