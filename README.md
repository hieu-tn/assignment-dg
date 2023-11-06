## Candidate

- Name: Hieu Tran
- Position applied: Fullstack Developer

## Description

A retail store API that exposes endpoints to retrieve products and operate all basic CRUD operations.

## Installation

- Docker

## Running the app
```bash
# development
$ docker-compose up --build

# the app is listening on port 3000, the url is localhost:3000
# right now, only swagger link is publicly accessible at http://localhost:3000/api

# database watcher on local
# it needs to turn database server up (via docker-compose) before you can connect to watcher url
$ cd code
$ npx prisma studio   # http://localhost:5555
```

## Test

```bash
# turn up test database server
$ docker-compose up testdb

# e2e tests
$ cd code
$ npm run test:e2e
```

## Demo

![Demo](https://github.com/hieu-tn/interview-danihelgroup/blob/master/docs/Swagger-UI.gif)

## Done

- Data validation for auth and use cookie-based authentication
- Protect routes that require authentication with Guards
- Use cache technique to cache user details
- Create a product.created event listener and log product details
- Perform e2e test for "product" api
- DI for services
