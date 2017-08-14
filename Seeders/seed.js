const { User, Secret } = require('../models');
const connect = require('../mongo');

connect().then(seed);

const seed = async () => {
	console.log('Creating Users');

	console.log('Creating Secrets');
	const secrets = [];
	for (let i = 1; i < 5; i++) {
		var secret = new Secret({
			owner: i % 3,
			encryption: i,
			body: `This is a post! ${i}`
		});
		secrets.push(secret);
		console.log('saving secret');
		await secret.save();
	}

	for (let i = 1; i < 3; i++) {
		var user = new User({
			username: `user${i}`,
			email: `email${i}@gmail.com`,
			password: `password${i}`,
			secrets: secrets
		});
		console.log('saving user');
		await user.save();
	}

	db.disconnect();
};
