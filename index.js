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
  res.render("home");
});

// Login routes
// 2
app.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

//register route
app.get("/register", loggedOutOnly, (req, res) => {
  res.render("register");
});

app.post("/login", (req, res) => {
  // 3
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (!user) return res.send("NO USER");

    // 4
    if (user.validatePassword(password)) {
      const sessionId = createSignedSessionId(username);
      res.cookie("sessionId", sessionId);
//      res.redirect("/");
//      req.flash("success", `Login Successful for user ${user.username}`);
      res.send(`Login Successful for user ${user.username}`)
    } else {
      res.send("UNCOOL");
    }
  });
});

// Start our app
app.listen(3000, ()=> {console.log("Now listening on port 3000");})
