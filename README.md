# PERN fullstack CRUD blog
CRUD blog with PERN fullstack. PostgreSql database with data mapping using Mikro Orm. Express server with Graphql api with Apollo server. Frontend application built with react and redux. Designed for easy deployment to heroku.

Password hashing uses Argon2

For deployment, run
```
yarn build && yarn run
```

## TODO
- Better error handling. For instance, creating a Field Error type.
- This is meant to work as a personal blog, so the authentication layer doesn't matter that much. However, it is still worth implementing a more rigorous authentication method. For instance, hashing the user's password with Argon2 for instance. Whether this is viable in Heroku however is something to consider.