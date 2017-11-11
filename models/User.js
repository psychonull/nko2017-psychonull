const Sequelize = require('sequelize');

module.exports =
  class User extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING
        },
        status: {
          type: Sequelize.ENUM('PENDING', 'ACTIVE', 'DELETED'),
          allowNull: false,
          defaultValue: 'PENDING'
        },
      }, { sequelize })
    };

    static associate(models) {
  
    }
  }
