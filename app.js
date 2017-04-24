// Create our app
const app = require("express")();

// Require and mount the cookie and body parser middlewares
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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
// Routes
// ----------------------------------------
const indexRouter = require("./routers/index");
app.use("/", indexRouter);

// Start our app
app.listen(3000);

module.exports = app;
