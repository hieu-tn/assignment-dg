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
```

## Test

```bash
# e2e tests
$ cd code
$ npm run test:e2e
```

## Demo

[![Demo](https://github.com/hieu-tn/interview-danihelgroup/blob/master/docs/Swagger-UI.gif)](https://github.com/hieu-tn/interview-danihelgroup/blob/master/docs/Swagger-UI.webm)

## Done

- Data validation for auth and use cookie-based authentication
- Protect routes that require authentication with Guards
- Use cache technique to cache user details
- Create a product.created event listener and log product details
- Perform e2e test for "product" api
- DI for services
