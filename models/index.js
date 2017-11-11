const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../config');

const basename = path.basename;
const db = {};

let sequelize = new Sequelize(config.databaseUrl, {
  logging: false,
});

// Load each model file
const models = Object.assign({}, ...fs.readdirSync(__dirname)
  .filter(file =>
    (file.indexOf(".") !== 0) && (file !== "index.js")
  )
  .map(function (file) {
    const model = require(path.join(__dirname, file));
    return {
      [model.name]: model.init(sequelize),
    };
  })
);

// Load model associations
for (const model of Object.keys(models)) {
  typeof models[model].associate === 'function' && models[model].associate(models);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
