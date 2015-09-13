# Quirkbot API

a dockerized [Sails](http://sailsjs.org) application

## Setup:

Check `SETUP.md`.

## Available endpoints

* RESTful User
* RESTful Program
* AuthController endpoints:
	- token
	- resendConfirmation
	- confirm
	- resetRequest
	- reset
* Other endpoints are described at `/config/routes.js`:

## Permissions (Policies)

`/config/policies.js`: Describe which policies to apply on each API endpoint.

`/api/policies`: Policies definition.

## Authentication

1. Request token posting to `/auth/token`. You will need to send `username` (nickname), `password` and `grant_type` as parameters. You will also need to send an `Authorization` header with the base64 encoded app `client_id:secret`. For example:
```
POST /oauth/token HTTP/1.1
Host: docker:8080
Content-Type: application/x-www-form-urlencoded; text/html; charset=UTF-8
Authorization: Basic YWJjMTphc2Q=
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=murilo%40asd.com&password=murilo
```
2. Add the received request token as a `Bearer` token in the header of your next requests. For exemple:
```
GET /program HTTP/1.1
Host: docker:8080
Authorization: Bearer f56d95b7e9130d50f49aa62cd3ddc854675f2c87
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded
```
3. In case your token expired, use the refresh token to get a new one:
```
POST /auth/token HTTP/1.1
Host: docker:8080
Content-Type: application/x-www-form-urlencoded; text/html; charset=UTF-8
Authorization: Basic YWJjMTphc2Q=
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=3ab35d191fe883fb7f40ad5f0822066ceaf01f77
```

## Reseting password

1. Request an email to reset the password:
```
POST /auth/resetRequest HTTP/1.1
Host: docker:8080
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

email=murilopolese%40gmail.com
```
2. This email should contain an url to an IDE screen with a token. On this screen the user fill the new password and submit with the received token to the api:
```
POST /auth/reset HTTP/1.1
Host: docker:8080
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

token=%242a%2410%24glx8hwKty7Bhy.BKymO5euZoLmNS4NQmZxuah.t7KjDqFMZLtj8bq&password=secret
```

## List of error codes:

- EMAIL_NOT_FOUND
- USER_NOT_FOUND
- USER_UPDATE
- RESET_PASSWORD_REQUEST
- RESET_PASSWORD
- RESET_REQUEST_NOT_FOUND
- ENCRYPT_PASSWORD
- PROGRAM_NOT_FOUND
- PROGRAM_UPDATE
- PROGRAM_CREATE
- NOT_AUTHENTICATED
- NOT_AUTHOR
- NOT_CONFIRMED
- NOT_YOURSELF
- AUTH_GRANT

## TODO:

[Issue tracker](https://bitbucket.org/murilopolese/quirkbot-api/issues?&sort=-priority)
