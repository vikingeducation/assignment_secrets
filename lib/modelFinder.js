const models = require('../models');
const { User, Secret } = models;

const ModelFinder = {
  populateUser: userId => {
    return User.findById(userId)
      .populate({
        path: 'secrets',
        populate: {
          path: 'user requests',
          populate: {
            path: 'requester'
          }
        }
      })
      .populate({
        path: 'requests',
        populate: {
          path: 'user secret'
        }
      });
  },

  populateSecrets: query => {
    return Secret.find(query)
      .populate({
        path: 'requests',
        populate: {
          path: 'requester'
        }
      })
      .populate({ path: 'user' });
  }
};

module.exports = ModelFinder;
