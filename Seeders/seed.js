const models = require("./../models");
const { User, Secret } = models;
const seeds = () => {
  console.log("Creating Users");

  for (let i = 1; i < 3; i++) {
    var user = new User({
      username: `user${i}`,
      email: `email${i}@gmail.com`,
      password: i,
      secrets: []
    });
    await user.save();
  }

  console.log("Creating Posts");


  for (let i = 1; i < 21; i++) {
    var secret = new Secret({
      owner: users[i % 3],
      encryption: i,
      body: `This is a post! ${i}`

    });
  await secret.save();
  }

  Mongorito.disconnect();
};
