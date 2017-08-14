var express = require('express');
var router = express.Router();

const { loggedInOnly, createSignedSessionId } = require('../services/Session');

/* GET users listing. */
router.get('/', loggedInOnly, function(req, res, next) {
	res.render('users/index');
});

module.exports = router;
