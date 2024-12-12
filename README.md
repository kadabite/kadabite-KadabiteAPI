# kadabite-KadabiteAPI


A delivery application connecting buyers, sellers, and dispatchers.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Unittesting](#unittesting)
- [Code of Conduct](#code-of-conduct)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Deliver App is a delivery application that connects buyers, sellers, and dispatchers. It provides a platform for users to manage orders, products, payments, and more through a GraphQL API.

## Features

- User authentication and authorization
- Product management
- Order management
- Payment processing
- Rate limiting
- Logging
- GraphQL API with Apollo Server

## Technologies Used

- Node.js
- Express.js
- Apollo Server
- GraphQL
- MongoDB
- Mongoose
- dotenv
- bcrypt
- cors
- body-parser
- express-rate-limit
- graphql-shield
- graphql-rate-limit

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Git
- Nginx
- Docker

### Installation

1. Clone the repository:

```sh
   git clone https://github.com/kadabite/kadabite-KadabiteAPI.git
   cd KadabiteAPI
```

2. Install dependencies using pnpm:

```bash
    pnpm install
```



3. Building project
```bash
    pnpm run build
    pnpm run start
```

4. To Restart the app
```bash
    pm2 restart kadabites-api
```

5. To delete the running app from pm2
```bash
    pm2 delete kadabites-api
```

6. To stop the running app
```bash
    pm2 stop kadabites-api
```

7. The server will start on the port specified in the environment variables (default is 3000).

### Project Structure

```plaintext
.
|-- CODE_OF_CONDUCT.md
|-- Dockerfile
|-- LICENSE.md
|-- README.md
|-- compose.yaml
|-- config
|   `-- configuration.ts
|-- dist
|   |-- src
|   |   |-- app.module.d.ts
|   |   |-- app.module.js
|   |   |-- app.module.js.map
|   |   |-- auth
|   |   |   |-- auth.guard.d.ts
|   |   |   |-- auth.guard.js
|   |   |   |-- auth.guard.js.map
|   |   |   |-- auth.module.d.ts
|   |   |   |-- auth.module.js
|   |   |   |-- auth.module.js.map
|   |   |   |-- auth.resolver.d.ts
|   |   |   |-- auth.resolver.js
|   |   |   |-- auth.resolver.js.map
|   |   |   |-- auth.service.d.ts
|   |   |   |-- auth.service.js
|   |   |   |-- auth.service.js.map
|   |   |   |-- dto
|   |   |   |   |-- login.input.d.ts
|   |   |   |   |-- login.input.js
|   |   |   |   `-- login.input.js.map
|   |   |   |-- role.enum.d.ts
|   |   |   |-- role.enum.js
|   |   |   `-- role.enum.js.map
|   |   |-- category
|   |   |   |-- category.module.d.ts
|   |   |   |-- category.module.js
|   |   |   |-- category.module.js.map
|   |   |   |-- category.resolver.d.ts
|   |   |   |-- category.resolver.js
|   |   |   |-- category.resolver.js.map
|   |   |   |-- category.service.d.ts
|   |   |   |-- category.service.js
|   |   |   |-- category.service.js.map
|   |   |   |-- dto
|   |   |   |   |-- category.dto.d.ts
|   |   |   |   |-- category.dto.js
|   |   |   |   |-- category.dto.js.map
|   |   |   |   |-- create-categories.input.d.ts
|   |   |   |   |-- create-categories.input.js
|   |   |   |   |-- create-categories.input.js.map
|   |   |   |   |-- create-category.input.d.ts
|   |   |   |   |-- create-category.input.js
|   |   |   |   |-- create-category.input.js.map
|   |   |   |   |-- delete-category.input.d.ts
|   |   |   |   |-- delete-category.input.js
|   |   |   |   |-- delete-category.input.js.map
|   |   |   |   |-- update-category.input.d.ts
|   |   |   |   |-- update-category.input.js
|   |   |   |   `-- update-category.input.js.map
|   |   |   |-- entities
|   |   |   |   |-- category.entity.d.ts
|   |   |   |   |-- category.entity.js
|   |   |   |   `-- category.entity.js.map
|   |   |   `-- schemas
|   |   |       |-- category.schema.d.ts
|   |   |       |-- category.schema.js
|   |   |       `-- category.schema.js.map
|   |   |-- common
|   |   |   |-- config
|   |   |   |   |-- redis.config.d.ts
|   |   |   |   |-- redis.config.js
|   |   |   |   `-- redis.config.js.map
|   |   |   |-- custom-errors
|   |   |   |   |-- auth
|   |   |   |   |   |-- unauthorized.error.d.ts
|   |   |   |   |   |-- unauthorized.error.js
|   |   |   |   |   `-- unauthorized.error.js.map
|   |   |   |   |-- location
|   |   |   |   |   |-- country-not-found.error.d.ts
|   |   |   |   |   |-- country-not-found.error.js
|   |   |   |   |   |-- country-not-found.error.js.map
|   |   |   |   |   |-- deletion.error.d.ts
|   |   |   |   |   |-- deletion.error.js
|   |   |   |   |   |-- deletion.error.js.map
|   |   |   |   |   |-- lga-not-found.error.d.ts
|   |   |   |   |   |-- lga-not-found.error.js
|   |   |   |   |   |-- lga-not-found.error.js.map
|   |   |   |   |   |-- location-not-found.error.d.ts
|   |   |   |   |   |-- location-not-found.error.js
|   |   |   |   |   |-- location-not-found.error.js.map
|   |   |   |   |   |-- state-not-found.error.d.ts
|   |   |   |   |   |-- state-not-found.error.js
|   |   |   |   |   `-- state-not-found.error.js.map
|   |   |   |   |-- order
|   |   |   |   |   |-- order-not-found.error.d.ts
|   |   |   |   |   |-- order-not-found.error.js
|   |   |   |   |   `-- order-not-found.error.js.map
|   |   |   |   |-- payment
|   |   |   |   |   |-- payment-errors.error.d.ts
|   |   |   |   |   |-- payment-errors.error.js
|   |   |   |   |   |-- payment-errors.error.js.map
|   |   |   |   |   |-- payment-not-found.error.d.ts
|   |   |   |   |   |-- payment-not-found.error.js
|   |   |   |   |   `-- payment-not-found.error.js.map
|   |   |   |   `-- user
|   |   |   |       |-- category-not-found.error.d.ts
|   |   |   |       |-- category-not-found.error.js
|   |   |   |       |-- category-not-found.error.js.map
|   |   |   |       |-- invalid-credentials.error.d.ts
|   |   |   |       |-- invalid-credentials.error.js
|   |   |   |       |-- invalid-credentials.error.js.map
|   |   |   |       |-- product-already-exists.error.d.ts
|   |   |   |       |-- product-already-exists.error.js
|   |   |   |       |-- product-already-exists.error.js.map
|   |   |   |       |-- product-not-found.error.d.ts
|   |   |   |       |-- product-not-found.error.js
|   |   |   |       |-- product-not-found.error.js.map
|   |   |   |       |-- user-already-exists.error.d.ts
|   |   |   |       |-- user-already-exists.error.js
|   |   |   |       |-- user-already-exists.error.js.map
|   |   |   |       |-- user-not-found.error.d.ts
|   |   |   |       |-- user-not-found.error.js
|   |   |   |       `-- user-not-found.error.js.map
|   |   |   |-- middleware
|   |   |   |   |-- csrf.middleware.d.ts
|   |   |   |   |-- csrf.middleware.js
|   |   |   |   |-- csrf.middleware.js.map
|   |   |   |   |-- logger.middleware.d.ts
|   |   |   |   |-- logger.middleware.js
|   |   |   |   |-- logger.middleware.js.map
|   |   |   |   |-- referrer-origin.middleware.d.ts
|   |   |   |   |-- referrer-origin.middleware.js
|   |   |   |   `-- referrer-origin.middleware.js.map
|   |   |   `-- util
|   |   |       |-- locations.d.ts
|   |   |       |-- locations.js
|   |   |       `-- locations.js.map
|   |   |-- globals
|   |   |   |-- cache
|   |   |   |   |-- cache.module.d.ts
|   |   |   |   |-- cache.module.js
|   |   |   |   `-- cache.module.js.map
|   |   |   |-- globals.module.d.ts
|   |   |   |-- globals.module.js
|   |   |   |-- globals.module.js.map
|   |   |   `-- model
|   |   |       |-- model.module.d.ts
|   |   |       |-- model.module.js
|   |   |       `-- model.module.js.map
|   |   |-- graphql.d.ts
|   |   |-- graphql.js
|   |   |-- graphql.js.map
|   |   |-- location
|   |   |   |-- dto
|   |   |   |   |-- add-user-location.input.d.ts
|   |   |   |   |-- add-user-location.input.js
|   |   |   |   |-- add-user-location.input.js.map
|   |   |   |   |-- country.dto.d.ts
|   |   |   |   |-- country.dto.js
|   |   |   |   |-- country.dto.js.map
|   |   |   |   |-- create-location.input.d.ts
|   |   |   |   |-- create-location.input.js
|   |   |   |   |-- create-location.input.js.map
|   |   |   |   |-- delete-user-location.input.d.ts
|   |   |   |   |-- delete-user-location.input.js
|   |   |   |   |-- delete-user-location.input.js.map
|   |   |   |   |-- lga.dto.d.ts
|   |   |   |   |-- lga.dto.js
|   |   |   |   |-- lga.dto.js.map
|   |   |   |   |-- location.dto.d.ts
|   |   |   |   |-- location.dto.js
|   |   |   |   |-- location.dto.js.map
|   |   |   |   |-- state.dto.d.ts
|   |   |   |   |-- state.dto.js
|   |   |   |   |-- state.dto.js.map
|   |   |   |   |-- update-location.input.d.ts
|   |   |   |   |-- update-location.input.js
|   |   |   |   |-- update-location.input.js.map
|   |   |   |   |-- update-user-location.input.d.ts
|   |   |   |   |-- update-user-location.input.js
|   |   |   |   `-- update-user-location.input.js.map
|   |   |   |-- entities
|   |   |   |   |-- country.entity.d.ts
|   |   |   |   |-- country.entity.js
|   |   |   |   |-- country.entity.js.map
|   |   |   |   |-- lga.entity.d.ts
|   |   |   |   |-- lga.entity.js
|   |   |   |   |-- lga.entity.js.map
|   |   |   |   |-- location.entity.d.ts
|   |   |   |   |-- location.entity.js
|   |   |   |   |-- location.entity.js.map
|   |   |   |   |-- state.entity.d.ts
|   |   |   |   |-- state.entity.js
|   |   |   |   `-- state.entity.js.map
|   |   |   |-- location.module.d.ts
|   |   |   |-- location.module.js
|   |   |   |-- location.module.js.map
|   |   |   |-- location.resolver.d.ts
|   |   |   |-- location.resolver.js
|   |   |   |-- location.resolver.js.map
|   |   |   |-- location.service.d.ts
|   |   |   |-- location.service.js
|   |   |   |-- location.service.js.map
|   |   |   `-- schemas
|   |   |       |-- location.schema.d.ts
|   |   |       |-- location.schema.js
|   |   |       `-- location.schema.js.map
|   |   |-- main.d.ts
|   |   |-- main.js
|   |   |-- main.js.map
|   |   |-- order
|   |   |   |-- dto
|   |   |   |   |-- create-order.input.d.ts
|   |   |   |   |-- create-order.input.js
|   |   |   |   |-- create-order.input.js.map
|   |   |   |   |-- delete-order-item.input.d.ts
|   |   |   |   |-- delete-order-item.input.js
|   |   |   |   |-- delete-order-item.input.js.map
|   |   |   |   |-- delete-order-items-now.input.d.ts
|   |   |   |   |-- delete-order-items-now.input.js
|   |   |   |   |-- delete-order-items-now.input.js.map
|   |   |   |   |-- delete-order.input.d.ts
|   |   |   |   |-- delete-order.input.js
|   |   |   |   |-- delete-order.input.js.map
|   |   |   |   |-- order-item.dto.d.ts
|   |   |   |   |-- order-item.dto.js
|   |   |   |   |-- order-item.dto.js.map
|   |   |   |   |-- order-item2.input.d.ts
|   |   |   |   |-- order-item2.input.js
|   |   |   |   |-- order-item2.input.js.map
|   |   |   |   |-- order-items.input.d.ts
|   |   |   |   |-- order-items.input.js
|   |   |   |   |-- order-items.input.js.map
|   |   |   |   |-- order.dto.d.ts
|   |   |   |   |-- order.dto.js
|   |   |   |   |-- order.dto.js.map
|   |   |   |   |-- update-order-items.input.d.ts
|   |   |   |   |-- update-order-items.input.js
|   |   |   |   |-- update-order-items.input.js.map
|   |   |   |   |-- update-order.input.d.ts
|   |   |   |   |-- update-order.input.js
|   |   |   |   `-- update-order.input.js.map
|   |   |   |-- entities
|   |   |   |   |-- order-item.entity.d.ts
|   |   |   |   |-- order-item.entity.js
|   |   |   |   |-- order-item.entity.js.map
|   |   |   |   |-- order.entity.d.ts
|   |   |   |   |-- order.entity.js
|   |   |   |   `-- order.entity.js.map
|   |   |   |-- interfaces
|   |   |   |   |-- order-item.interface.d.ts
|   |   |   |   |-- order-item.interface.js
|   |   |   |   `-- order-item.interface.js.map
|   |   |   |-- order.module.d.ts
|   |   |   |-- order.module.js
|   |   |   |-- order.module.js.map
|   |   |   |-- order.resolver.d.ts
|   |   |   |-- order.resolver.js
|   |   |   |-- order.resolver.js.map
|   |   |   |-- order.service.d.ts
|   |   |   |-- order.service.js
|   |   |   |-- order.service.js.map
|   |   |   `-- schemas
|   |   |       |-- order.schema.d.ts
|   |   |       |-- order.schema.js
|   |   |       `-- order.schema.js.map
|   |   |-- payment
|   |   |   |-- dto
|   |   |   |   |-- create-payment.input.d.ts
|   |   |   |   |-- create-payment.input.js
|   |   |   |   |-- create-payment.input.js.map
|   |   |   |   |-- payment.dto.d.ts
|   |   |   |   |-- payment.dto.js
|   |   |   |   |-- payment.dto.js.map
|   |   |   |   |-- payments.dto.d.ts
|   |   |   |   |-- payments.dto.js
|   |   |   |   |-- payments.dto.js.map
|   |   |   |   |-- update-payment.input.d.ts
|   |   |   |   |-- update-payment.input.js
|   |   |   |   `-- update-payment.input.js.map
|   |   |   |-- entities
|   |   |   |   |-- payment.entity.d.ts
|   |   |   |   |-- payment.entity.js
|   |   |   |   `-- payment.entity.js.map
|   |   |   |-- payment.module.d.ts
|   |   |   |-- payment.module.js
|   |   |   |-- payment.module.js.map
|   |   |   |-- payment.resolver.d.ts
|   |   |   |-- payment.resolver.js
|   |   |   |-- payment.resolver.js.map
|   |   |   |-- payment.service.d.ts
|   |   |   |-- payment.service.js
|   |   |   |-- payment.service.js.map
|   |   |   `-- schemas
|   |   |       |-- payment.schema.d.ts
|   |   |       |-- payment.schema.js
|   |   |       `-- payment.schema.js.map
|   |   |-- product
|   |   |   |-- dto
|   |   |   |   |-- create-product.input.d.ts
|   |   |   |   |-- create-product.input.js
|   |   |   |   |-- create-product.input.js.map
|   |   |   |   |-- delete-product.input.d.ts
|   |   |   |   |-- delete-product.input.js
|   |   |   |   |-- delete-product.input.js.map
|   |   |   |   |-- product.dto.d.ts
|   |   |   |   |-- product.dto.js
|   |   |   |   |-- product.dto.js.map
|   |   |   |   |-- update-product.input.d.ts
|   |   |   |   |-- update-product.input.js
|   |   |   |   `-- update-product.input.js.map
|   |   |   |-- entities
|   |   |   |   |-- product.entity.d.ts
|   |   |   |   |-- product.entity.js
|   |   |   |   `-- product.entity.js.map
|   |   |   |-- interfaces
|   |   |   |   |-- product.interface.d.ts
|   |   |   |   |-- product.interface.js
|   |   |   |   `-- product.interface.js.map
|   |   |   |-- product.module.d.ts
|   |   |   |-- product.module.js
|   |   |   |-- product.module.js.map
|   |   |   |-- product.resolver.d.ts
|   |   |   |-- product.resolver.js
|   |   |   |-- product.resolver.js.map
|   |   |   |-- product.service.d.ts
|   |   |   |-- product.service.js
|   |   |   |-- product.service.js.map
|   |   |   `-- schemas
|   |   |       |-- product.schema.d.ts
|   |   |       |-- product.schema.js
|   |   |       `-- product.schema.js.map
|   |   `-- user
|   |       |-- dto  [36 entries exceeds filelimit, not opening dir]
|   |       |-- entities
|   |       |   |-- user.entity.d.ts
|   |       |   |-- user.entity.js
|   |       |   `-- user.entity.js.map
|   |       |-- schemas
|   |       |   |-- newsletter.schema.d.ts
|   |       |   |-- newsletter.schema.js
|   |       |   |-- newsletter.schema.js.map
|   |       |   |-- user.schema.d.ts
|   |       |   |-- user.schema.js
|   |       |   |-- user.schema.js.map
|   |       |   |-- waitlist.schema.d.ts
|   |       |   |-- waitlist.schema.js
|   |       |   `-- waitlist.schema.js.map
|   |       |-- user.module.d.ts
|   |       |-- user.module.js
|   |       |-- user.module.js.map
|   |       |-- user.resolver.d.ts
|   |       |-- user.resolver.js
|   |       |-- user.resolver.js.map
|   |       |-- user.service.d.ts
|   |       |-- user.service.js
|   |       `-- user.service.js.map
|   `-- tsconfig.build.tsbuildinfo
|-- email_service
|   |-- Dockerfile
|   |-- email.log
|   |-- email_client.py
|   |-- requirements.txt
|   `-- worker.py
|-- generate-typings.ts
|-- lib
|   |-- apolloClient.ts
|   |-- corsMiddleware.ts
|   |-- cspMiddleware.ts
|   |-- graphql-types.ts
|   |-- hstsMiddleware.ts
|   |-- permissionsPolicyMiddleware.ts
|   |-- rateLimiterMiddleware.ts
|   |-- referrerPolicyMiddleware.ts
|   |-- xContentTypeOptionsMiddleware.ts
|   `-- xFrameOptionsMiddleware.ts
|-- nest-cli.json
|-- node_modules  [36 entries exceeds filelimit, not opening dir]
|-- package.json
|-- pnpm-lock.yaml
|-- redis-data
|   `-- dump.rdb
|-- src
|   |-- app.module.ts
|   |-- auth
|   |   |-- auth.graphql
|   |   |-- auth.guard.ts
|   |   |-- auth.module.ts
|   |   |-- auth.resolver.ts
|   |   |-- auth.service.ts
|   |   |-- dto
|   |   |   `-- login.input.ts
|   |   `-- role.enum.ts
|   |-- category
|   |   |-- category.graphql
|   |   |-- category.module.ts
|   |   |-- category.resolver.ts
|   |   |-- category.service.ts
|   |   |-- dto
|   |   |   |-- category.dto.ts
|   |   |   |-- create-categories.input.ts
|   |   |   |-- create-category.input.ts
|   |   |   |-- delete-category.input.ts
|   |   |   `-- update-category.input.ts
|   |   |-- entities
|   |   |   `-- category.entity.ts
|   |   `-- schemas
|   |       `-- category.schema.ts
|   |-- common
|   |   |-- config
|   |   |   `-- redis.config.ts
|   |   |-- custom-errors
|   |   |   |-- auth
|   |   |   |   `-- unauthorized.error.ts
|   |   |   |-- location
|   |   |   |   |-- country-not-found.error.ts
|   |   |   |   |-- deletion.error.ts
|   |   |   |   |-- lga-not-found.error.ts
|   |   |   |   |-- location-not-found.error.ts
|   |   |   |   `-- state-not-found.error.ts
|   |   |   |-- order
|   |   |   |   `-- order-not-found.error.ts
|   |   |   |-- payment
|   |   |   |   |-- payment-errors.error.ts
|   |   |   |   `-- payment-not-found.error.ts
|   |   |   `-- user
|   |   |       |-- category-not-found.error.ts
|   |   |       |-- invalid-credentials.error.ts
|   |   |       |-- product-already-exists.error.ts
|   |   |       |-- product-not-found.error.ts
|   |   |       |-- user-already-exists.error.ts
|   |   |       `-- user-not-found.error.ts
|   |   |-- middleware
|   |   |   |-- csrf.middleware.ts
|   |   |   |-- logger.middleware.ts
|   |   |   `-- referrer-origin.middleware.ts
|   |   `-- util
|   |       `-- locations.ts
|   |-- globals
|   |   |-- cache
|   |   |   `-- cache.module.ts
|   |   |-- globals.module.ts
|   |   `-- model
|   |       `-- model.module.ts
|   |-- graphql.ts
|   |-- location
|   |   |-- dto
|   |   |   |-- add-user-location.input.ts
|   |   |   |-- country.dto.ts
|   |   |   |-- create-location.input.ts
|   |   |   |-- delete-user-location.input.ts
|   |   |   |-- lga.dto.ts
|   |   |   |-- location.dto.ts
|   |   |   |-- state.dto.ts
|   |   |   |-- update-location.input.ts
|   |   |   `-- update-user-location.input.ts
|   |   |-- entities
|   |   |   |-- country.entity.ts
|   |   |   |-- lga.entity.ts
|   |   |   |-- location.entity.ts
|   |   |   `-- state.entity.ts
|   |   |-- location.graphql
|   |   |-- location.module.ts
|   |   |-- location.resolver.ts
|   |   |-- location.service.ts
|   |   `-- schemas
|   |       `-- location.schema.ts
|   |-- main.ts
|   |-- order
|   |   |-- dto
|   |   |   |-- create-order.input.ts
|   |   |   |-- delete-order-item.input.ts
|   |   |   |-- delete-order-items-now.input.ts
|   |   |   |-- delete-order.input.ts
|   |   |   |-- order-item.dto.ts
|   |   |   |-- order-item2.input.ts
|   |   |   |-- order-items.input.ts
|   |   |   |-- order.dto.ts
|   |   |   |-- update-order-items.input.ts
|   |   |   `-- update-order.input.ts
|   |   |-- entities
|   |   |   |-- order-item.entity.ts
|   |   |   `-- order.entity.ts
|   |   |-- interfaces
|   |   |   `-- order-item.interface.ts
|   |   |-- order.graphql
|   |   |-- order.module.ts
|   |   |-- order.resolver.ts
|   |   |-- order.service.ts
|   |   `-- schemas
|   |       `-- order.schema.ts
|   |-- payment
|   |   |-- dto
|   |   |   |-- create-payment.input.ts
|   |   |   |-- payment.dto.ts
|   |   |   |-- payments.dto.ts
|   |   |   `-- update-payment.input.ts
|   |   |-- entities
|   |   |   `-- payment.entity.ts
|   |   |-- payment.graphql
|   |   |-- payment.module.ts
|   |   |-- payment.resolver.ts
|   |   |-- payment.service.ts
|   |   `-- schemas
|   |       `-- payment.schema.ts
|   |-- product
|   |   |-- dto
|   |   |   |-- create-product.input.ts
|   |   |   |-- delete-product.input.ts
|   |   |   |-- product.dto.ts
|   |   |   `-- update-product.input.ts
|   |   |-- entities
|   |   |   `-- product.entity.ts
|   |   |-- interfaces
|   |   |   `-- product.interface.ts
|   |   |-- product.graphql
|   |   |-- product.module.ts
|   |   |-- product.resolver.ts
|   |   |-- product.service.ts
|   |   `-- schemas
|   |       `-- product.schema.ts
|   `-- user
|       |-- dto
|       |   |-- create-user.input.ts
|       |   |-- find-foods.input.ts
|       |   |-- forgot-password.input.ts
|       |   |-- message.dto.ts
|       |   |-- newsletter.dto.ts
|       |   |-- register-user.input.ts
|       |   |-- restaurant.dto.ts
|       |   |-- update-password.input.ts
|       |   |-- update-user.input.ts
|       |   |-- user.dto.ts
|       |   |-- users.dto.ts
|       |   `-- waitlist.dto.ts
|       |-- entities
|       |   `-- user.entity.ts
|       |-- schemas
|       |   |-- newsletter.schema.ts
|       |   |-- user.schema.ts
|       |   `-- waitlist.schema.ts
|       |-- user.graphql
|       |-- user.module.ts
|       |-- user.resolver.ts
|       `-- user.service.ts
|-- tsconfig.build.json
`-- tsconfig.json
```

## API Endpoints

### GraphQL Endpoints

- `/graphql`: Main GraphQL endpoint for querying and mutating data.


## Unittesting

```bash
    npm test
```

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the expected behavior in our community.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
