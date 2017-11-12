module.exports = Joi => ({
  post: {
    title: Joi.string().required(),
    body: Joi.string(),
    email: Joi.string().email().required(),
    when: Joi.date().iso().required(),
    maxAttendees: Joi.number().min(0),
  },
});
