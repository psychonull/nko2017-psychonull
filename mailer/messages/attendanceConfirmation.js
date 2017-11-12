
module.exports = (transport, options) => new Promise((resolve, reject) => {
  const { title, link } = options.data;
  transport.sendMail({
    from: options.from,
    to: options.to,
    subject: 'Confirm your attendance to the event',
    html: `
     <p>You are receiving this because you or someone subscribed to the event <b>${title}</b> with this email address.</p>
     <p><a href="${link}">Click here to confirm you are taking part in the event!</a></p>
     <small>If you have not created this event, please ignore this message or let us know.</small>
      `,
  }, (err, info) => {
    if (err) {
      return reject(err);
    }
    return resolve(info);
  });
});
