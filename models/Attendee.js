const Sequelize = require('sequelize');

module.exports =
  class Attendee extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        token: {
          type: Sequelize.STRING,
          allowNull: false,
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
