const SecretsHelper = {};

SecretsHelper.userIsFollowingSecret = (allFollowers, user, secretOwner) => {
  return allFollowers.indexOf(user) >= 0 || user.toString() === secretOwner._id.toString();
};

SecretsHelper.checkIfAlreadyRequested = (userRequests, secretRequests) => {
  let isAlreadyRequested = false;
  userRequests.forEach(el1 => {
    secretRequests.forEach(el2 => {
      if (el1.toString() === el2.toString()) {
        isAlreadyRequested = true;
      }
    });
  });
  
  return isAlreadyRequested;
};

module.exports = SecretsHelper;