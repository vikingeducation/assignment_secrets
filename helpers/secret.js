const SecretsHelper = {};

SecretsHelper.userIsConfidant = (user, confidants) => {
  let isConfidant = false;
  confidants.forEach(confidant => {
    if (confidant.toString() === user) {
      isConfidant = true;
    }
  });
  return isConfidant;
};

SecretsHelper.userHasRequested = (user, requests) => {
  let hasRequested = false;
  requests.forEach(request => {
    if (request.requester._id.toString() === user.toString()) {
      hasRequested = true;
    }
  });
  return hasRequested;
};

module.exports = SecretsHelper;
