const SecretAccessHelper = {
  hasAccess: (user, secret) => {
    if (secret.user._id.equals(user._id)) return true;

    // check if user has a granted request
    return secret.requests.filter(request => {
      return request.requester._id.equals(user.id) && request.granted;
    }).length;
  },

  requested: (user, secret) => {
    return secret.requests.filter(request => {
      return request.requester._id.equals(user.id) && !request.granted && !request.rejected;
    }).length;
  }
};

module.exports = SecretAccessHelper;
