```js
/*
using  SQL Sequelize

Relationship: One user can have many secrets

Users Table
username
email
password (a hash)


Secret Tables
secret: string
*/
//Commands
//create db

createdb secret_development
sequelize model:create --name User --attributes "username:string email:string password:string"
sequelize model:create --name Secret --attributes "secret:string"
