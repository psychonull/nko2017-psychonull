const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const config = require('../config');

const auth = config.sendgrid;

const attendanceConfirmation = require('./messages/attendanceConfirmation');
const eventConfirmation = require('./messages/eventConfirmation');

const transport = auth ?
  nodemailer.createTransport(sgTransport({ auth })) :
  nodemailer.createTransport({ jsonTransport: true });

const sendWrapper = (p) => {
  if (!auth) {
    return p.then((info) => {
      console.log(info.message);
      return info;
    });
  }
  return p
    .then(info => info)
    .catch((err) => {
      console.log('[MAILER ERROR]: ', err);
      return Promise.reject(err);
    });
};

module.exports = {
  send: {
    eventConfirmation(to, link, title, body) {
      return sendWrapper(eventConfirmation(transport, {
        from: config.mailer.from,
        to,
        data: { link, title, body },
      }));
    },
    attendanceConfirmation(to, link, title, body) {
      return sendWrapper(attendanceConfirmation(transport, {
        from: config.mailer.from,
        to,
        data: { link, title, body },
      }));
    },
  },
};
