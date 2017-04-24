// Create our app
const express = require("express");
const app = express();

// Require and mount the cookie and body parser middlewares
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
var morgan = require("morgan");
app.use(morgan("tiny"));
app.use((req, res, next) => {
  ["query", "params", "body"].forEach(key => {
    if (req[key]) {
      var capKey = key[0].toUpperCase() + key.substr(1);
      var value = JSON.stringify(req[key], null, 2);
      console.log(`${capKey}: ${value}`);
    }
  });
  next();
});

// ----------------------------------------
// Mongoose
// ----------------------------------------
var mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")(req).then(() => next());
  }
});

// Set up express-handlebars
const exphbs = require("express-handlebars");
var moment = require("moment");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      formatDate: function(date) {
        return moment(date).format("MMM Do YY");
      },
      isIn: function(item, array) {
        return array.filter(el => {
          return el.toString() === item.toString();
        }).length;
      },
      bootstrapAlertClassFor: function(key) {
        return {
          error: "danger",
          alert: "danger",
          notice: "info"
        }[key] || key;
      }
    }
  })
);
app.set("view engine", "handlebars");

const User = require("./models/User");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./services/Session");

// Mount our custom loginMiddleware
app.use(loginMiddleware);

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
var cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["asdf1234567890qwer"]
  })
);

// ----------------------------------------
// Flash Messages
// ----------------------------------------
var flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Routes
// ----------------------------------------
const sessionsRouter = require("./routers/sessions");
app.use("/", sessionsRouter);
const secretsRouter = require("./routers/secrets");
app.use("/", secretsRouter);

// Start our app
app.listen(3000);

module.exports = app;
