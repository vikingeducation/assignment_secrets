const app = require("express");

// take care of body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// take care of cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// connect to mongoDB server
const mongoose = require("mongoose");

//????
// mongoose.connect("mongodb://localhost/test");
// require("./mongo");

// Set up express-handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// import user model
const User = require("./models/User");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./services/Session");

app.use(loginMiddleware);
