const app = require('express')();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//Required models:

const models = require('./models');
const User = models.User;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/logout', (req, res) => {
  res.cookie('sessionId', '');
  app.locals.username = '';
  res.redirect('/');
});

const { createSignedSessionId } = require('./services/Session');

app.post('/newsignup', (req, res) => {
  let newUsername = req.body.username;
  let newPassword = req.body.password;

  User.findOrCreate({
    where: { username: newUsername },
    defaults: { username: newUsername, password: newPassword }
  }).spread(user => {
    let sessionId = createSignedSessionId(user.username);
    res.cookie('sessionId', sessionId);
    app.locals.username = user.username;
    res.redirect('home');
  });
});

app.listen(3000);
