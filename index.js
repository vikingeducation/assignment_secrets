const app = require('express')();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

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
  res.render('landing');
});

app.get('/login', loggedOutOnly, (req, res) => {
  res.render('login');
});

app.get('/signup', loggedOutOnly, (req, res) => {
  res.render('signup');
});

app.get('/test', (req, res) => {
  Secret.findAll().then(secrets => {
    res.send(secrets);
  });
});

app.get('/home', loggedInOnly, (req, res) => {
  User.findOne({ where: { username: res.locals.username } }).then(user => {
    Secret.findAll({
      where: { userId: user.id }
    }).then(ownedSecrets => {
      //this gives us all secrets which have an array of
      res.render('home', { ownedSecrets });
    });
  });
});

app.get('/secrets', loggedInOnly, (req, res) => {
  res.render('allsecrets');
});

app.get('/logout', (req, res) => {
  res.cookie('sessionId', '', { expires: new Date() });
  req.user = null;
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
    res.redirect('home');
  });
});

app.post('/userlogin', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.find({ where: { username: username } })
    .then(user => {
      if (user.username == username) {
        if (bcrypt.compareSync(password, user.passHash)) {
          let sessionId = createSignedSessionId(user.username);
          res.cookie('sessionId', sessionId);
          // res.redirect('/home');
        } else {
          res.send('Password did not match');
        }
      } else {
        res.send('User not found');
      }
    })
    .then(() => {
      res.redirect('/home');
    });
});

app.post('/postSecret', (req, res) => {
  let username = req.cookies.sessionId.split(':')[0];
  let content = req.body.content;

  User.findOne({
    where: { username: username }
  }).then(user => {
    console.log(user);
    let userId = user.id;
    Secret.create({ content: content, userId: userId }).then(() => {
      res.redirect('/home');
    });
    //res.redirect('/home');
  });
  // .then(secret => {
  //   res.redirect('/home');
  // });
});

app.listen(3000);
