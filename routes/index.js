var express = require('express');
var router = express.Router();
const User = require('../models/user');
const { loggedInOnly, loggedOutOnly } = require('../services/Session');

/* GET home page. */
router.get('/', loggedInOnly, function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/login', loggedOutOnly, function(req, res, next) {
	res.render('login', { title: 'Express' });
});

router.post('/login', async (req, res) => {
	console.log(req.body);
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) return res.send('NO USER');

	// 4
	if (user.validatePassword(password)) {
		const sessionId = createSignedSessionId(email);
		res.cookie('sessionId', sessionId);
		res.redirect('/');
	} else {
		res.send('UNCOOL');
	}
});

module.exports = router;
