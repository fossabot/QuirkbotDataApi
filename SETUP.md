## Requirements

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
