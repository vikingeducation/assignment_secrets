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
authorId: integer


Join-sort-of-Table  [Secrets with their authorized users] Many to many
RequestPermissions Table
>userId        ]creates a composite key basically
>secretId      ]creates a composite key basically
  ///state         'pending' || 'accepted' || 'denied' //preferably we don't have denied ones in the table at all
>pending boolean
>accessible   boolean default: false

//make sure to insert into the jointable an entry with author=userId and set accessible=true



*/
//Commands
//create db

createdb secret_development
sequelize model:create --name User --attributes "username:string email:string password:string"
sequelize model:create --name Secret --attributes "secret:string"
// sequelize model:create --name
sequelize migration:create --name ModifySecret
sequelize model:create --name RequestPermission --attributes "userId:integer secretId:integer pending:boolean accessible:boolean"
