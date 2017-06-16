# assignment_secrets
Build a web app that allows users to store and share their darkest secrets.


To do:

in /request (post) you create a new request
  -first find and if nothing, then baddabing badda boom ya can make it
  -otherwise just redirect
in /request (put) you confirm a request
  -first check that the user matches requestee
  -then delete request
  -add requester to follows of secret


todo:
first, wire up buttons to send requests
create them with a simple post route
then, we want to wire up "your secrets" to show current requests, with a button to accept or reject
finally, show 'followed secrets" in "your secrets"
done with project!