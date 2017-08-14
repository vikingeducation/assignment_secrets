require('dotenv').config();
const SECRET = process.env['secret'];
const md5 = require('md5');

const { User } = require('../models');

const loginMiddleware = async (req, res, next) => {
	const sessionId = req.cookies.sessionId;
	if (!sessionId) return next();

	const [email, signature] = sessionId.split(':');

	const user = await User.findOne({ email });
	if (signature === generateSignature(email)) {
		req.user = user;
		res.locals.currentUser = user;
		next();
	} else {
		res.send("You've tampered with your session!");
	}
};

const createSignedSessionId = email => `${email}:${generateSignature(email)}`;
const generateSignature = email => md5(email + SECRET);

const loggedInOnly = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.redirect('login');
	}
};

const loggedOutOnly = (req, res, next) => {
	if (!req.user) {
		next();
	} else {
		res.redirect('/');
	}
};

module.exports = {
	createSignedSessionId,
	loginMiddleware,
	loggedInOnly,
	loggedOutOnly
};
