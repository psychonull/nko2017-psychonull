const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../config');

const db = {};

const sequelize = new Sequelize(config.databaseUrl, {
  logging: false,
});

// Load each model file
const models = Object.assign({}, ...fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .map((file) => {
    const model = require(path.join(__dirname, file)); // eslint-disable-line
    return {
      [model.name]: model.init(sequelize),
    };
  }));

// Load model associations
Object.keys(models).forEach((model) => {
  if (typeof models[model].associate === 'function') {
    models[model].associate(models);
  }
  db[model] = models[model];
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
