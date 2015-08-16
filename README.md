# Quirkbot API

a [Sails](http://sailsjs.org) application

## Requirements:

* Nodejs
* Npm

## How to run locally

1. Clone the repo: `git clone https://murilopolese@bitbucket.org/murilopolese/quirkbot-api.git`
2. Browse the cloned repo folder
3. Enter the source folder `cd src
4. Run `npm start`
5. Run `npm start`

## How to run with docker

1. Make sure you have Docker, docker-machine and docker-compose installed and running properly
2. Create a VM for docker: `docker-machine create -d virtualbox name-of-your-virtual-machine`
3. Clone the repo: `git clone https://murilopolese@bitbucket.org/murilopolese/quirkbot-api.git`
4. Browse the cloned repo folder
5. Build the image: `docker build -t quirkbot .
6. Run the image: `docker run -p 8080:1337 quirkbot` or `docker-compose up`

### Extra nice configs:

#### Hosts

If you are running on MacOS, get your Docker virtual machine IP with `docker-machine ip name-of-your-virtual-machine` and add it to your `/etc/hosts` file. For example:

	192.168.99.100	docker

After this you will be able to access the quirkbot api app at `http://docker:8080` (after you run the image, of course).

#### ZShell

Your docker client knows the address of your running virtual machine through environment variables exposed manually or dinamically by executing `eval "$(docker-machine env name-of-your-virtual-machine)"`. The problem is that for each new session of your terminal running zshell you will need to execute it again. To solve that you can add the following lines to your `.zshrc`:

	if docker-machine status name-of-your-virtual-machine | grep Running > /dev/null; then
		eval "$(docker-machine env name-of-your-virtual-machine)"
	fi

## Available endpoints

* RESTful User
* RESTful Program

As described at `/config/routes.js`:

* `post /login`: Execute method `login` from `/api/controllers/AuthController`
* `/logout`: Execute method `logout` from `/api/controllers/AuthController`

## Permissions (Policies)

Endpoint permissions described at `/config/policies.js`.

Policies located at `/api/policies`.

## Authentication

Authentication is performed with [Passport](http://passportjs.org/) and [passport-local](https://github.com/jaredhanson/passport-local).

Middleware configuration at `/config/http.js` and `/config/passport.js`.

## TODO:

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
* Soft delete (?)
* Add all logic to services

## Done!

* Setup CORS properly (done)
* Docker (done)
