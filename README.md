# Quirkbot API

a [Sails](http://sailsjs.org) application

## Requirements:

* Nodejs
* Npm

## How to run

1. Clone the repo: `git clone https://murilopolese@bitbucket.org/murilopolese/quirkbot-api.git`
2. Browse the cloned repo folder
3. Run `npm install`
4. Run `npm start`

## Available endpoints

* RESTful User
* RESTful Program

As described at `/config/routes.js`:

* `get /login`: views/login
* `post /login`: AuthController.login
* `/logout`: AuthController.logout

## Permissions (Policies)

Endpoint permissions described at `/config/policies.js`.

Policies located at `/api/policies`.

## Authentication

Authentication is performed with [Passport](http://passportjs.org/) and [passport-local](https://github.com/jaredhanson/passport-local).

Middleware configuration at `/config/http.js` and `/config/passport.js`.
