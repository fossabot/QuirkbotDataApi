#!/bin/bash

docker rmi -f quirkbotapi_web
docker-compose rm -f
docker-compose up