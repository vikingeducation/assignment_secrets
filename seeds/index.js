const mongoose = require("mongoose");
const { Secret, User } = require("../models");
const bcrypt = require("bcrypt");

const seeds = () => {

  let users = []
  for(let i = 0; i < 10, i++) {
    let newUser = new User({
      username: `user${i}`
      passwordHash: `password${i}`
    })

    users.push(newUser);
  }

  for(let i = 0; i <20; i++) {
    let newSecret = new Secret({
      body: `I have ${i} cats!`
      author: users[i % 10]
      users: [users[(i + 1) % 10], users[(i + 2) % 10], users[(i + 3) % 10]]
    })
  }
}
