FROM node:21 as builder

ARG REPO_PATH
ARG REPO_NAME
ARG BASE_PATH
ARG BASE_ASSET_PATH

# prepare our working directory
RUN mkdir -p /cw
WORKDIR /cw

# fetch the repository and ignore the cache
ADD ${REPO_PATH} skipcache

# clone the repository
RUN git clone --depth 1 ${REPO_PATH}

# move into the repository
WORKDIR /cw/${REPO_NAME}

# allows us to run the next server under a subpath, needs to be provided at compile time
RUN touch .env
RUN echo "NEXT_PUBLIC_BASE_PATH='${BASE_PATH}'" > .env
RUN echo "NEXT_PUBLIC_BASE_ASSET_PATH='${BASE_ASSET_PATH}'" > .env

# install all dependencies
RUN npm i

# disable telemetry
RUN npx next telemetry disable

# copy the community.json file
COPY community.json .

# build the dashboard
RUN npm run build

# Set up the runtime image
FROM node:21-alpine

ARG REPO_NAME

# create the working directory
RUN mkdir -p /cw

# move into the working directory
WORKDIR /cw

# copy the build from the builder
COPY --from=builder /cw/${REPO_NAME} .

# define the command to be run on launch
CMD ["npx", "next", "start", "-H", "0.0.0.0"]