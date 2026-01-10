#!/bin/bash
export TAG=${1:-latest}
export $(grep -v '^#' .env | xargs)
echo "${DOCKER_ACCESS_TOKEN}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
docker compose up --build -d
docker compose push 