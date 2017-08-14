const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// handlebars view
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "handlebars");

//middleware sessions ?

// routes
app.use("/", require("./routes/index"));

app.listen(3000, () => {
  console.log(`Listening at port 3000`);
});
