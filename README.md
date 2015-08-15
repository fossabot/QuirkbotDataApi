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

* `get /signup`: Load view at `/views/signup.ejs`
* `get /login`: Load view at `/views/login.ejs`
* `post /login`: Execute method `login` from `/api/controllers/AuthController`
* `/logout`: Execute method `logout` from `/api/controllers/AuthController`

## Permissions (Policies)

Endpoint permissions described at `/config/policies.js`.

Policies located at `/api/policies`.

## Authentication

Authentication is performed with [Passport](http://passportjs.org/) and [passport-local](https://github.com/jaredhanson/passport-local).

Middleware configuration at `/config/http.js` and `/config/passport.js`.

## TODO:

* Docker
* Add all logic to services
* OAuth or HTTP authentication to crossdomain authentication
* Implement `/api/policies/isYou.js` for preventing users access to other users.
* Implement `/api/policies/isAuthor.js` for preventing users access to other users programs.
* Transactional emails
* Account confirmation
* Smart create or update: Always post an update and if doesn't exist, create:
	1. check id
	2. if doesn't exist, ignore id and create a new one
	3. if exists, check if it's the client is the newest update else return the server's version
	(take Program.version as reference)
	(Always use current logged user as the author - Program before create)
* Setup CORS properly (done)
* Soft delete (?)
