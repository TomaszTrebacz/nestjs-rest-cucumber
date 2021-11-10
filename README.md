# Backend graphql example app

This repository is for showing the design of MR backend REST project structure.


## Configuration

App config is defined by environment variables. Each variable should be written in UPPER_CASE.

Every allowed/required variable should be defined and described in `example.env` file.

Main file (which app uses to parse variables with dotenv library) is `.env`.

Each environment variable should be mapped and validated in related script under `./src/config` directory.

Thanks to well-defined example.env we can easily set up development environment
by one command which copies `example.env` into `.env`.
```
cp example.env .env
```

## Docker

We would like to deploy app with docker that's why we have `Dokerfile`.

It is defined as 2-step process which allows us to release docker image
with only required dependencies for running it in production.

That's why whenever we have to install any npm dependency we should use proper installation command
```
npm i package - package is required for production eg. some core lib used in services
npm i -D package - package is required only for development eg. library @types
```

Application probably will use some external services like database.

Each service that is available on dockerhub should be defined in docker-compose for easy project startup.

Thanks to that we can just start all required backend services by
```
docker-compose up
```
NOTE: docker-compose will load `.env` file thanks to that all variables will come from the same source.

Install required dependencies with
```
npm i
```

After that you can start backend in development mode
```
npm run dev
```


## Database

For database management we will use MikroORM.

MikroORM config is placed in `./src/mikro-orm.config.ts` as typescript file which allows us to use in it
env variables mapped in `config` directory.

Any database table/column/constraint name should be written in snake_case (as sql in case insensitive).

In short:
```
 - table names -> plural (users, user_comments)
 - column names -> singular (email, is_blocked, created_at)
```

To manage database during development we have script in package.json which uses MikroORM-cli under the hood
```
npm run db -- SCRIPT-NAME-WITH-OPTIONS
```

To list all available db commands
```
npm run db -- -h
```

To generate migration file based on entities changes (command will ask for file name bt prompt)
```
npm run db -- migration:create
```

To run pending migrations
```
npm run db -- migration:up
```


## Linting

To enforce the same code style for project we are using eslint with prettier.

Thanks to husky+list-staged libraries combo linting will be executed after every commit.
To run linter
```
npm run lint
```

To run linter with auto fix base errors
```
npm run lint:fix
```


## Naming convention

Directories and files should be named using kebab-case to avoid problems with case sensitivity across OS.


## Project structure
We will use Vertical Slice Architecture which means that we're organizing code across a feature rather than layers.
The focus is on features and capabilities rather than technical concerns.
Coupling is limited by the scope of the feature and the size of the vertical slice.

```
All project source files that you should care of should be placed under `./src` directory which are:
 - common - any data that is used across multiple modules
 - config - validation and mapping env variables
 - migrations - database migration files
 - modules - core application parts
 - scripts - scripts that can be called by cli
 - test-utils - util functions used only in tests across all project (will be purged during project build and won't be available in dist)
 - main.ts - server setup and startup
 - mikro-orm.config.ts - MikroORM config file
```

Each module should look like:
```
modules
├──app.module - merges and parses all application modules
├──app.controller - root endpoint for health check and version display
└──cats
   ├──__test__ - test utils related to module
   │  └──cats.utils.ts
   ├──entities - MikroORM entities
   │  └──cat.entity.ts
   ├──dtos - dtos that can be returned by endpoints
   │  └──cat.dto.ts
   ├──endpoints - each endpoint should be placed in separate file containing class with handler method which describes endpoint properties
   │  ├──create-cat.mutation.ts
   │  └──create-cat.mutation.e2e.test.ts - every endpoint should have dedicated test file which tests every response edge case
   ├──services - stores shared logic used across endpoints
   │  └──cats.service.ts
   ├──cats.constant.ts - stores constant data related to module like errors or validation decorators
   └──cats.module.ts - merges all module providers (entities, endpoints, services)
```


### Testing

Every endpoint should be tested with e2e tests that covers every of it's allowed responses.

To run e2e tests call:
```
npm run test:e2e
```
