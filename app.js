const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");
const { loginMiddleware } = require("./services/session");

//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(loginMiddleware);

// handlebars view
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// routes
app.use("/", require("./routes/index"));

app.listen(3000, () => {
	console.log(`Listening at port 3000`);
});
