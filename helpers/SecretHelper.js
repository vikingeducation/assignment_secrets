module.exports = {
  secretsPath: () => "/secrets",
  allSecretsPath: () => "/secrets/all",
  secretPath: id => `/secrets/${id}`,
  newSecretPath: () => "/secrets", // post
  editSecretPath: id => `/secrets/${id}`, // put/patch
  destroySecretPath: id => `/secrets/${id}?_method=delete`
};
