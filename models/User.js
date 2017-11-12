const Sequelize = require('sequelize');

module.exports =
  class User extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.ENUM('PENDING', 'ACTIVE', 'DELETED'),
          allowNull: false,
          defaultValue: 'PENDING',
        },
      }, {
        sequelize,
        paranoid: true,
      });
    }

    static associate(models) { // eslint-disable-line

    }
  };

