const app = require('express')();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(
  cookieSession({
    name: 'session',
    keys: ['asdf1234qwer']
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

const flash = require('express-flash-messages');
app.use(flash());

const morgan = require('morgan');
app.use(morgan('tiny'));

const mongoose = require('mongoose');
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});

const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers').registered;

const hbs = expressHandlebars.create({
  partialsDir: 'views/',
  defaultLayout: 'application',
  helpers: helpers
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(helpers.loginMiddleware);

// Routes
const sessions = require('./controllers/sessions');
const secrets = require('./controllers/secrets');
const requests = require('./controllers/requests');

app.use('/', sessions);
app.use('/', secrets);
app.use('/requests', requests);

const port = process.env.PORT || process.argv[2] || 3000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

module.exports = app;
