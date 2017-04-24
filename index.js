const app = require('express')();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//Required models:

const models = require('./models');
const User = models.User;
const Secret = models.Secret;

const {
  createSignedSessionId,
  loggedInOnly,
  loggedOutOnly,
  loginMiddleware
} = require('./services/Session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loginMiddleware);

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', loggedOutOnly, (req, res) => {
  console.log(res);
  res.render('landing');
});

app.get('/login', loggedOutOnly, (req, res) => {
  res.render('login');
});

app.get('/signup', loggedOutOnly, (req, res) => {
  res.render('signup');
});

app.get('/home', loggedInOnly, (req, res) => {
  res.render('home');
});

app.get('/secrets', loggedInOnly, (req, res) => {
  res.render('allsecrets');
});

app.get('/logout', (req, res) => {
  res.cookie('sessionId', '', { expires: new Date() });
  res.locals.username = '';
  res.redirect('/');
});

app.post('/newsignup', (req, res) => {
  let newUsername = req.body.username;
  let newPassword = req.body.password;

  User.findOrCreate({
    where: { username: newUsername },
    defaults: { username: newUsername, password: newPassword }
  }).spread(user => {
    let sessionId = createSignedSessionId(user.username);
    res.cookie('sessionId', sessionId);
    res.locals.username = user.username; //do this in the middleware
    res.redirect('home');
  });
});

app.post('/userlogin', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.find({ where: { like: { username: username } } })
    .spread(user => {
      if (user.username == username) {
        console.log('Found user: ', user);
      } else {
        console.log("Didn't find user: ", username);
      }
    })
    .then(() => {
      res.redirect('/home');
    });
});

app.post('/postSecret', loggedInOnly, (req, res) => {
  let username = req.cookies.sessionId.split(':')[0];
  let content = req.body.content;

  User.find({
    where: { username: username }
  })
    .then(user => {
      let userId = user.id;
      Secret.create({ content: content, userId: userId });
    })
    .then(secret => {
      res.redirect('/home');
    });
});

app.listen(3000);
