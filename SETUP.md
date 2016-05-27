## Requirements

* Docker
* `docker-machine` (if you are using OSX)

## How to run with docker

1. Make sure you have `docker` and `docker-machine`
2. Create or start your Docker VM. (OSX only)
	* **Create**: `docker-machine create -d virtualbox name-of-your-vm`
	* **Start**: `docker-machine start name-of-your-vm`
3. Clone the repo: `git clone https://murilopolese@bitbucket.org/murilopolese/quirkbot-api.git`
4. Browse to the cloned repo folder
5. Build the image `docker build -t your-image-name .`
6. You can either start the container with `docker run` passing all the environment variables as parameters or build another docker container specifying the environment variables there.

**Examples:**

Run on terminal or as a shell script (useful for development purposes):
```
docker run \
-e MANDRILL_API_KEY="123" \
-e APP_CONFIRMATION_URL="http://code-stage.quirkbot.com/confirm/#/" \
-e APP_RESET_URL="http://code-stage.quirkbot.com/reset/#/" \
-e MONGO_URL="mongodb://123:123@123.mlab.com:123/database" \
-e LOGGLY_SUBDOMAIN="quirkbot" \
-e LOGGLY_TOKEN="123" \
-e LOGGLY_TAG="API-stage" \
-e LOGGLY_LEVEL="info" \
-e NEW_RELIC_KEY="123" \
-e NEW_RELIC_APP_NAME="api-stage" \
-e NEW_RELIC_LEVEL="trace" \
api-test
```

or build using this `Dockerfile` (you upload a file like that to Amazon Elastic Beanstalk):

```
FROM quirkbot/api:0.1.15

ENV MANDRILL_API_KEY 123
ENV APP_CONFIRMATION_URL http://code-stage.quirkbot.com/confirm/#/
ENV APP_RESET_URL http://code-stage.quirkbot.com/reset/#/
ENV MONGO_URL mongodb://123:123@123.mlab.com:123/database
ENV LOGGLY_SUBDOMAIN quirkbot
ENV LOGGLY_TOKEN 123
ENV LOGGLY_TAG API-Stage
ENV LOGGLY_LEVEL info
ENV NEW_RELIC_KEY 123
ENV NEW_RELIC_APP_NAME api-stage
ENV NEW_RELIC_LEVEL trace

EXPOSE 1337

CMD [ "npm", "start" ]
```

## Running locally:

1. Clone the repo: `git clone https://murilopolese@bitbucket.org/murilopolese/quirkbot-api.git`
2. Browse to the cloned repo folder
3. Create or fill the `.env` file with required environment variables.
4. Run `npm install`
5. Run `npm start`

## Environment variables

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

### Extra nice configs:

#### Hosts

##### OSX

Get your Docker virtual machine IP with `docker-machine ip name-of-your-vm` and add it to your `/etc/hosts` file. For example:

```
192.168.99.100	docker
```

After this you will be able to access the quirkbot api app at `http://docker:8080` (after you run the app, of course).

##### Linux

Check the ip your docker container is running with `docker inspect PROCESSIDHERE`. You can get the process id typing `docker ps`.

#### ZShell

Your docker client knows the address of your running virtual machine through environment variables exposed manually or dinamically by executing `eval "$(docker-machine env name-of-your-vm)"`. The problem is that for each new session of your terminal running zshell you will need to execute it again. To solve that you can add the following lines to your `.zshrc`:

```
if docker-machine status name-of-your-vm | grep Running > /dev/null; then
	eval "$(docker-machine env name-of-your-vm)"
fi
```
