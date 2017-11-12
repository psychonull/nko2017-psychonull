const Sequelize = require('sequelize');

module.exports =
  class Event extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        body: {
          type: Sequelize.TEXT,
        },
        when: {
          type: Sequelize.DATE,
        },
        maxAttendance: {
          type: Sequelize.INTEGER,
          defaultValue: 50,
        },
      }, {
        sequelize,
        paranoid: true,
      });
    }

    static associate(models) {
      this.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: {
          allowNull: false,
        },
        as: 'CreatedBy',
      });

      this.belongsToMany(models.User, {
        onDelete: 'CASCADE',
        through: models.Attendee,
      });
    }
  };
