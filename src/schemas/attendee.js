module.exports = Joi => ({
  post: {
    name: Joi.string(),
    email: Joi.string().email().required(),
  },
});
