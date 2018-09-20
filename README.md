# Quirkbot API
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FQuirkbot%2FQuirkbotDataApi.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FQuirkbot%2FQuirkbotDataApi?ref=badge_shield)


A dockerized [Sails](http://sailsjs.org) backend for Quirkbot's CODE; programming environment.

## Setup:

### Running locally:

1. Clone the repo: `git clone https://murilopolese@bitbucket.org/murilopolese/quirkbot-api.git`
2. Browse to the cloned repo folder
3. Create or fill the `.env` file with required environment variables.
4. Run `npm install`
5. Run `npm start`

### Environment variables

**Required**
MANDRILL_API_KEY
APP_CONFIRMATION_URL
APP_RESET_URL
MONGO_URL

**Optional**
LOGGLY_SUBDOMAIN
LOGGLY_TOKEN
LOGGLY_TAG
LOGGLY_LEVEL
NEW_RELIC_KEY
NEW_RELIC_APP_NAME
NEW_RELIC_LEVEL
LOG_LEVEL
API_DISK_DB_PATH (if using NODE_ENV="lite")


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

nickname=murilopolese
```
2. This email should contain an url to an IDE screen with a token. On this screen the user fill the new password and submit with the received token to the api:
```
POST /auth/reset HTTP/1.1
Host: docker:8080
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

token=%242a%2410%24glx8hwKty7Bhy.BKymO5euZoLmNS4NQmZxuah.t7KjDqFMZLtj8bq&password=secret
```

## Confirm user

**TODO**

## Resend confirmation

1. Request an email to confirm the user:
```
POST /auth/resendConfirmation HTTP/1.1
Host: docker:8080
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

nickname=murilopolese
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


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FQuirkbot%2FQuirkbotDataApi.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FQuirkbot%2FQuirkbotDataApi?ref=badge_large)