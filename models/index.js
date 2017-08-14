var { Database, Model } = require("mongorito");
var db = new Database("localhost/secrets");
yield db.connect();
var User = require("./user");
var Secret = require("./secret");

db.register(User);
db.register(Secret);
module.exports = { db,User,Secret };
