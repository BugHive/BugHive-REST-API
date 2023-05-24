# BugHive-REST-API

A simple REST API backend for BugHive chrome extension.

API Endpoints

| Methods     | Urls             |Description            |
| ----------- | -----------      | -----------        |
| GET         | api/bugs    |Get all bugs           |
| GET         | api/bugs/id |Get a specific bug         |
| POST        | api/bugs    |Create a new bug         |
| PUT        | api/bugs/id    |Update an existing bug|
| DELETE        | api/bugs/id    |Delete an existing bug|

## Quick Start

Clone the repo.

```bash
git clone https://github.com/BugHive/BugHive-REST-API
cd BugHive-REST-API
```
Create the .env file.

```bash
MONGODB_URI = mongodb://localhost:27017
TEST_MONGODB_URI = mongodb://localhost:27017
PORT = 3001

SECRET=secret
JWT_PEROID=7d
```
Install the dependencies.

```bash
npm install
```
To start the express server in development mode, run the following.

```bash
npm run dev
```

## Run tests

```sh
npm test
```

## Author

👤 **Aziz Al-Kurd**

- Github: [@azzsal](https://github.com/azzsal)

## Show your support

Give a ⭐️ if you like this project
