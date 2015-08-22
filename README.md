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

1. Make sure you have `docker`, `docker-machine` and `docker-compose` installed and running properly
2. Create/Run your Docker VM.
	* Create a VM for docker: `docker-machine create -d virtualbox name-of-your-virtual-machine` **OR**
	* Restart your machine in case it's stopped `docker-machine start name-of-your-virtual-machine`
3. Clone the repo: `git clone https://murilopolese@bitbucket.org/murilopolese/quirkbot-api.git`
4. Browse the cloned repo folder
5. Build the image: `docker build -t quirkbot .
6. Run the image: `docker run -p 8080:1337 quirkbot` or `docker-compose up`

**If you need to rebuild the image**

1. Check the image name: `docker images`
2. Remove the image: `docker rmi -f name-of-your-image`
3. Remove compose process: `docker-compose rm`
4. Run compose up again: `docker-compose up`

### Extra nice configs:

#### Hosts

If you are running on MacOS, get your Docker virtual machine IP with `docker-machine ip name-of-your-virtual-machine` and add it to your `/etc/hosts` file. For example:

	192.168.99.100	docker

After this you will be able to access the quirkbot api app at `http://docker:8080` (after you run the image, of course).

#### ZShell

Your docker client knows the address of your running virtual machine through environment variables exposed manually or dinamically by executing `eval "$(docker-machine env name-of-your-virtual-machine)"`. The problem is that for each new session of your terminal running zshell you will need to execute it again. To solve that you can add the following lines to your `.zshrc`:

```
if docker-machine status name-of-your-virtual-machine | grep Running > /dev/null; then
	eval "$(docker-machine env name-of-your-virtual-machine)"
fi
```

## Available endpoints

* RESTful User
* RESTful Program

As described at `/config/routes.js`:

* `post /auth/token`: Post your email as username and your password so you can get a token to access the protected endpoints. The request should be something like this:

```
POST /oauth/token HTTP/1.1
Host: docker:8080
Content-Type: application/x-www-form-urlencoded; text/html; charset=UTF-8
Authorization: Basic YWJjMTphc2Q=
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=murilo%40asd.com&password=murilo
```

## Permissions (Policies)

Endpoint permissions described at `/config/policies.js`.

Policies located at `/api/policies`.

## Authentication

Authentication is performed with [Passport](http://passportjs.org/) and [passport-local](https://github.com/jaredhanson/passport-local).

Middleware configuration at `/config/http.js` and `/config/passport.js`.

## TODO:

* Password reset
* Smart create or update: Always post an update and if doesn't exist, create:
	1. check id
	2. if doesn't exist, ignore id and create a new one
	3. if exists, check if it's the client is the newest update else return the server's version
	(take Program.version as reference)
	(Always use current logged user as the author - Program before create)
* Client ID/Secret the right way
* Soft delete (?)
* Add all logic to services
* Add Cloud Compiler to Docker stack

## Done!

* Setup CORS properly (done)
* Docker (done)
* OAuth or HTTP authentication to crossdomain authentication (https://github.com/lucj/sails-oauth2-api)
* Implement `/api/policies/sessionAuth.js` with the OAuth methods.
* Refresh OAuth Token
* Implement `/api/policies/isYou.js` for preventing users to alter other users.
* Implement `/api/policies/isAuthor.js` for preventing users access to other users programs.
* Transactional emails
* Account confirmation
