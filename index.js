const app = require('express')();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//Required models:

const User = require('./models/User');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/newsignup', (req, res) => {
  let newUsername = req.body.username;
  let newPassword = req.body.password;

  User.findOrCreate({
    where: { username: newUsername },
    defaults: { username: newUsername, password: newPassword }
  }).spread(user => {
    console.log(user);
  });
});

app.listen(3000);
