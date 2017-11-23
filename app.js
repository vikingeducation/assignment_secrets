// Create our app
const express = require("express");
const app = express();

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Method Override
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");

app.use(
	methodOverride(
		getPostSupport.callback,
		getPostSupport.options // { methods: ['POST', 'GET'] }
	)
);

// Logging
var morgan = require("morgan");
var morganToolkit = require("morgan-toolkit")(morgan);

app.use(morganToolkit());

// Connect to our mongo server
const mongoose = require("mongoose");
app.use((req, res, next) => {
	if (mongoose.connection.readyState) {
		next();
	} else {
		require("./mongo")().then(() => next());
	}
});

// Set up express-handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Mount our custom loginMiddleware
const { loginMiddleware } = require("./services/session");
app.use(loginMiddleware);

// routes
var loginRouter = require("./routers/login")(app);
app.use("/", loginRouter);

// Start
app.listen(2000);

// END

// Start our app
app.listen(3000, () => console.log("listening"));
