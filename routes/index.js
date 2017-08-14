var express = require('express');
var router = express.Router();

const { User } = require('../models');
const {
	loggedInOnly,
	loggedOutOnly,
	createSignedSessionId
} = require('../services/Session');

/* GET home page. */
router.get('/', loggedInOnly, function(req, res, next) {
	res.redirect('/users');
});

router.get('/login', loggedOutOnly, function(req, res, next) {
	res.render('login');
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) return res.send('NO USER');

	// 4
	if (user.validatePassword(password)) {
		const sessionId = createSignedSessionId(email);
		res.cookie('sessionId', sessionId);
		res.redirect('/users');
	} else {
		res.send('UNCOOL');
	}
});

module.exports = router;
