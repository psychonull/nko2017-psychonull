
module.exports = (transport, options) => new Promise((resolve, reject) => {
  const { title, body, link } = options.data;
  transport.sendMail({
    from: options.from,
    to: options.to,
    subject: `Confirm your event: ${title}`,
    html: `
     <h1>${title}</h1> 
     <div>${body}</div>
     <a href="${link}">Confirm event creation</a>
     <small>If you have not created this event, please ignore this message or let us know.</small>
      `,
  }, (err, info) => {
    if (err) {
      return reject(err);
    }
    return resolve(info);
  });
});
