const request = require('supertest'); // eslint-disable-line
const appInit = require('../index');

process.env.NODE_ENV = 'test';

module.exports = appInit
  .then(app => request.agent(app))
  .catch((err) => {
    console.log(err);
    return Promise.reject(err);
  });
