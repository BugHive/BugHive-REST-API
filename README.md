# BugHive-REST-API

A simple REST API backend for BugHive chrome extension.

API Endpoints


| Methods     | Urls             |Description            |
| ----------- | -----------      | -----------        |
| POST         | api/login    |Login a user           |

| Methods     | Urls             |Description            |
| ----------- | -----------      | -----------        |
| GET         | api/docs    |Get api docs in Swagger UI          |

| Methods     | Urls             |Description            |
| ----------- | -----------      | -----------        |
| GET         | api/users    |Returns a list of all the registered users           |
| GET         | api/users/id |Get a specific user         |
| POST        | api/users    |Create a new user         |
| PUT        | api/users/id    |Update the user by id|
| DELETE        | api/users/id    |Remove the user by id|

| Methods     | Urls             |Description            |
| ----------- | -----------      | -----------        |
| GET         | api/tags    |Returns a list of all the tags of the logged in user           |
| GET         | api/tags/id |Get a tag by id of the logged in user         |
| POST        | api/tags    |Create a new tag for the logged in user         |
| PUT        | api/tags/id    |Update the tag by id of the logged in user   |
| DELETE        | api/tags    |Remove all the tags of the logged in user   |
| DELETE        | api/tags/id    |Remove the tag by id of the logged in user|

| Methods     | Urls             |Description            |
| ----------- | -----------      | -----------        |
| GET         | api/bugs    |Returns a list of all the bugs of the logged in user           |
| GET         | api/bugs/id |Get a bug by id of the logged in user         |
| POST        | api/bugs    |Create a new bug for the logged in user         |
| PUT        | api/bugs/id    |Update the bug by id of the logged in user   |
| DELETE        | api/bugs    |Remove all the bugs of the logged in user   |
| DELETE        | api/bugs/id    |Remove the bug by id of the logged in user|




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

Run tests.

```bash
npm test
```

## Author

👤 **Aziz Al-Kurd**

- Github: [@azzsal](https://github.com/azzsal)

## Show your support

Give a ⭐️ if you like this project
