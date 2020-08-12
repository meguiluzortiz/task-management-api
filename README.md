# nestjs-task-management-api

Task management API.

This project was boostrapped with [Nest CLI](https://github.com/nestjs/nest-cli) using [Typescript Starter](https://github.com/nestjs/typescript-starter).

## Live demo

[Task management API](https://whispering-reef-14176.herokuapp.com/)

## How to Run

### Environment variables

The application use to environment variables for running. Please refer to .env-example file.

```(sh)
NODE_ENV          #Node environment (development, production)
PORT              #Application port (3000)
DATABASE_URL      #Database connection String
```

### Application

#### Local

```(sh)
yarn start             #Start the app
yarn start:dev         #Start the app in dev mode
```

#### Docker

```(sh)
yarn docker:clean      #Clean containers, volumes and local images
yarn docker:dev        #Start the app environment in dev mode
yarn docker:database   #Start the database
```

### Tests

```(sh)
yarn test        #Run the tests
yarn test:cov    #Run the tests and show coverage
```

## Tech stack

- NestJS / Typescript
- Jest
- Swagger
- Sonarqube / Sonarsource
- Docker / Docker-Compose
- Heroku

## References

- [Udemy](https://www.udemy.com/course/nestjs-zero-to-hero/)
