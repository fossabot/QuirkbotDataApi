# Quirkbot API

a dockerized [Sails](http://sailsjs.org) application

## Requirements:

* Docker
* `docker-machine`
* `docker-compose`

## How to run with docker

1. Make sure you have `docker`, `docker-machine` and `docker-compose` installed and running properly
2. Create or start your Docker VM.
	* **Create**: `docker-machine create -d virtualbox name-of-your-vm`
	* **Start**: `docker-machine start name-of-your-vm`
3. Clone the repo: `git clone https://murilopolese@bitbucket.org/murilopolese/quirkbot-api.git`
4. Browse to the cloned repo folder
5. Run the app: `docker-compose up`

**If you need to rebuild the image**

If for any reason you needed to add/remove a npm or change something that isn't inside the `api` or `config` folder, you will need to rebuild the image.

1. Check the image name: `docker images`
2. Remove the image: `docker rmi -f name-of-your-image`
3. Remove compose process: `docker-compose rm`
4. Run compose up again: `docker-compose up`

### Extra nice configs:

#### Hosts

If you are running on MacOS, get your Docker virtual machine IP with `docker-machine ip name-of-your-vm` and add it to your `/etc/hosts` file. For example:

```
192.168.99.100	docker
```

After this you will be able to access the quirkbot api app at `http://docker:8080` (after you run the app, of course).

#### ZShell

Your docker client knows the address of your running virtual machine through environment variables exposed manually or dinamically by executing `eval "$(docker-machine env name-of-your-vm)"`. The problem is that for each new session of your terminal running zshell you will need to execute it again. To solve that you can add the following lines to your `.zshrc`:

```
if docker-machine status name-of-your-vm | grep Running > /dev/null; then
	eval "$(docker-machine env name-of-your-vm)"
fi
```

## Available endpoints

* RESTful User
* RESTful Program
* AuthController endpoints
* Other endpoints are described at `/config/routes.js`:

## Permissions (Policies)

Endpoint permissions described at `/config/policies.js`.

Policies located at `/api/policies`.

## Authentication

1. Request token posting to `/auth/token`. You will need to send `username` (which is actually the email), `password` and `grant_type` as parameters. You will also need to send an `Authorization` header with the base64 encoded app's `client_id:secret`. For example:
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

* Logging
* Validate body request on ProgramController update
* Generate token for confirmation
* Different confirmation email if you are a kid (email to parents)
* HTTPS
* Soft delete (?)
* Add all logic to services
* Policies return correct error codes
* Client ID/Secret the right way
* API endpoint tests

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
* Password reset
* Unique nicknames
* Smart create or update: Always post an update and if doesn't exist, create:
	1. check id
	2. if doesn't exist, ignore id and create a new one
	3. if exists, check if it's the client is the newest update else return the server's version
	(take Program.version as reference)
	(Always use current logged user as the author - Program before create)
* Remove programs from UserModel
* Prevent app crash when Mandrill fails
* Resend confirmation endpoint
* Always return standard json
	- Error code
	- Error message
	- Error data (original error)
