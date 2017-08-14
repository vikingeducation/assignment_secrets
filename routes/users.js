var express = require('express');
var router = express.Router();
const { User, Secret } = require('../models');
const { loggedInOnly, createSignedSessionId } = require('../services/Session');

/* GET users listing. */
router.get('/', loggedInOnly, async function(req, res, next) {
	let users = await User.find();

	res.render('users/index', { users: users });
});
router.get('/:id', loggedInOnly, async function(req, res, next) {
	let user = await User.findById(req.user._id);
	//console.log(user);
	res.render('users/show', { user: user });
});

module.exports = router;
