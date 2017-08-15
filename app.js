const express = require("express");
const app = express();

// .env
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// Templates
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application",
  helpers: require("./helpers")
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Static Files
app.use(express.static(`${__dirname}/public`));

// Post Data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Session
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["fds89vzcxkdsqrwerdsfuzcv;jfdsqr"]
  })
);

// Cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Flash
const flash = require("express-flash-messages");
app.use(flash());

// Log Request Info
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);
app.use(morganToolkit());

// Method Overriding
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

// Connect to Mongoose
const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) next();
  else require("./mongo")().then(() => next());
});

// Authentication Middleware
app.use(require("./services/Session").guardian);

// Routes
app.use("/auth", require("./routers/auth"));
app.use("/secrets", require("./routers/secrets"));
app.all("/", (req, res) => res.redirect("/secrets"));

// Set up port/host
const port = process.env.PORT || process.argv[2] || 3000;
const host = "0.0.0.0";
let args = process.env.NODE_ENV === "production" ? [port] : [port, host];

// helpful log when the server starts
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

// Use apply to pass the args to listen
app.listen.apply(app, args);
