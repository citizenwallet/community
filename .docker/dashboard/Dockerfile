# syntax=docker/dockerfile:1
FROM node:21 as builder

ARG REPO_PATH
ARG REPO_NAME
ARG BASE_PATH
ARG BASE_ASSET_PATH

# prepare our working directory
WORKDIR /cw

# fetch the repository
ADD ${REPO_PATH} /cw/${REPO_NAME}

# move into the repository
WORKDIR /cw/${REPO_NAME}

# allows us to run the next server under a subpath, needs to be provided at compile time
COPY .env.dashboard .env

# install all dependencies
RUN npm i --no-audit

# disable telemetry
RUN npx next telemetry disable

# build the dashboard
RUN npm run build

# Set up the runtime image
FROM node:21

ARG REPO_NAME

# move into the working directory
WORKDIR /cw

# copy the build from the builder
COPY --from=builder /cw/${REPO_NAME} .

RUN apt-get update && apt-get install -y curl

USER root

# Install Docker CLI, not the whole Docker
RUN curl -fsSL https://get.docker.com -o get-docker.sh
RUN sh ./get-docker.sh

# Add node to the docker group
RUN usermod -aG docker node

# Switch to the node user
USER node

# define the command to be run on launch
CMD ["npx", "next", "start", "-H", "0.0.0.0"]