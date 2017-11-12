const express = require('express');
const helmet = require('helmet');
// const expressEnforcesSSL = require('express-enforces-ssl');
const db = require('./models');
const api = require('./api');

const PORT = process.env.PORT || 3001;

const app = express();

// Initialize an express app with some security defaults
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
  res.status(404).send('Not Found');
}

function errors(err, req, res) {
  console.log(err);
  res.status(500).send('something went wrong');
}

app
  .use(https)
  .use(helmet());

app.use('/api', api);

// Application-specific routes
// Add your own routes here!
app.get('/example-path', async (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Serve static assets built by create-react-app
app.use(express.static('build'));

// If no explicit matches were found, serve index.html
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

app
  .use(notfound)
  .use(errors);

module.exports = db.sequelize.sync()
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
      });
    }
    return app;
  })
  .catch(err => console.log(err));
