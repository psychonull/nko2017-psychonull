const Sequelize = require('sequelize');
const Hashids = require('hashids');
const config = require('../config');
const _ = require('lodash');

const hashids = new Hashids(config.hashidsSeed, 12);

module.exports =
  class Event extends Sequelize.Model {
    get code() {
      return hashids.encode(this.id);
    }

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
          allowNull: false,
        },
        maxAttendance: {
          type: Sequelize.INTEGER,
          defaultValue: 50,
        },
        status: {
          type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'PENDING',
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
        as: 'createdBy',
      });

      this.belongsToMany(models.User, {
        onDelete: 'CASCADE',
        through: models.Attendee,
        as: 'attendees',
      });
    }

    static findByCode(code, opts) {
      return Event.findOne(_.merge({
        where: { id: hashids.decode(code) },
      }, opts));
    }
  };
