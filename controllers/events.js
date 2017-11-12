const db = require('../models');

const eventById = async (req, res, next, eventId) => {
  const event = await db.Event.findByCode(eventId, {
    include: [
      { model: db.User, as: 'createdBy' },
      { model: db.User, as: 'attendees', through: db.Attendee },
    ],
  });
  if (!event) {
    return next({ statusCode: 404 });
  }
  req.event = event;
  return next();
};

const attendeeByToken = async (req, res, next, token) => {
  const attendee = await db.Attendee.findOne({ where: { token } });
  if (!attendee) {
    return next({ statusCode: 401 });
  }
  req.attendee = attendee;
  return next();
};

const confirm = async (req, res, next) => {
  if (req.event.createdById === req.attendee.UserId) {
    await db.Event.update({
      status: 'CONFIRMED',
    }, {
      where: {
        id: req.event.id,
        status: 'PENDING',
      },
    });
  }
  await db.Attendee.update({
    status: 'ACTIVE',
  }, {
    where: {
      token: req.attendee.token,
      EventId: req.event.id,
    },
  });
  next();
};

module.exports = {
  eventById,
  attendeeByToken,
  confirm,
};
