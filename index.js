const express = require('express');
const app = express();

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require('express-flash-messages');
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
app.use((req, res, next) => {
  let method;
  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
  } else if (typeof req.body === 'object' && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }

  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }

  next();
});

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require('cookie-session');
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['asdf1234567890qwer']
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ----------------------------------------
// Static Public Files
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require('morgan');
app.use(morgan('tiny'));
app.use((req, res, next) => {
  ['query', 'params', 'body'].forEach((key) => {
    if (req[key]) {
      let capKey = key[0].toUpperCase() + key.substr(1);
      let value = JSON.stringify(req[key], null, 2);
      console.log(`${ capKey }: ${ value }`);
    }
  });
  next();
});

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require('mongoose');

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});


// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require('express-handlebars');
const h = require('./helpers').registered;

const hbs = expressHandlebars.create({
  helpers: h,
  partialsDir: 'views/',
  defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// ----------------------------------------
// Routes
// ----------------------------------------
const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');

app.use(h.loginMiddleware);
app.get("/", h.loggedInOnly, (req, res) => {
  res.render("home");
});
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT ||
             process.argv[2] ||
             4003;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ?
                          args = [port] :
                          args = [port, host];

args.push(() => {
  console.log(`Listening: http://${ host }:${ port }`);
});

app.listen.apply(app, args);

module.exports = app;