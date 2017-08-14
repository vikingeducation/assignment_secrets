const app = require("express")();
const flash = require("express-flash-messages")
app.use(flash());

// take care of body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// take care of cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// connect to mongoDB server
const mongoose = require("mongoose");

//????
mongoose.connect("mongodb://localhost/secrets_mongoose_development");
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

///////////////////////////////
///////////////////////////////

app.get("/", loggedInOnly, (req, res) => {
  // render home page (landing with secrets)
  console.log("line 41 was hit")
  res.render("home");
});

app.get("/logout", (req, res) => {
  res.cookie("sessionId", "", {expires: new Date()});
  res.redirect("/");
});

//register route
// app.get("/register", loggedOutOnly, (req, res) => {
//   res.render("register");
// });

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

const registerRoutes = require("./routes/register");
app.use("/register", registerRoutes);

const secretsRoutes = require("./routes/secrets");
app.use("/secrets", secretsRoutes);


// Start our app
app.listen(3000, ()=> {console.log("Now listening on port 3000");})
