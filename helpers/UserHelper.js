module.exports = {
  usersPath: () => "/users",
  userPath: id => `/users/${id}`,
  newUserPath: () => "/users", // post
  editUserPath: id => `/users/${id}`, // put/patch
  destroyUserPath: id => `/users/${id}?_method=delete`
};
