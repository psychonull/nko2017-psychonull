const db = require('../models');

function https(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers['x-forwarded-proto'];
    if (proto === 'https' || proto === undefined) {
      return next();
    }
    return res.redirect(301, `https://${req.get('Host')}${req.originalUrl}`);
  }
  return next();
}

function notfound(req, res) {
  res.status(404).json({
    message: 'Not found',
  });
}

function errors(err, req, res, next) { // eslint-disable-line
  if (err.isBoom) {
    // joi request validation errors...
    return res
      .status(err.output.statusCode)
      .json(err.output.payload);
  } else if (err.statusCode === 404) {
    return res.status(404).json({
      message: err.message || 'Entity not found',
    });
  }
  console.log('ERROR: ', err);
  return res.status(500).json({
    message: 'something went wrong',
  });
}

function authorize(isRequired) {
  return async (req, res, next) => {
    const auth = req.get('authorization');
    if (!auth) {
      if (isRequired) {
        return next({ statusCode: 403 });
      }
      return next();
    }
    const attendee = await db.Attendee.findOne({
      where: { token: auth },
    });
    if (!attendee) {
      return next({ statusCode: 401 });
    }
    req.user = await db.User.findById(attendee.UserId);
    return next();
  };
}

module.exports = {
  https,
  notfound,
  errors,
  authorize,
};
