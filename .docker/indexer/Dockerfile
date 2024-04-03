# syntax=docker/dockerfile:1
# Set up the runtime image
FROM ubuntu:jammy

ARG BUILD_OUTPUT_URL
ARG BUILD_VERSION_FILE_NAME
ARG GOARCH
ARG GOOS

WORKDIR /cw

# install curl
RUN apt-get update && apt-get install -y curl 

# download the version file
RUN curl -H 'Cache-Control: no-cache' -o ${BUILD_VERSION_FILE_NAME} -L ${BUILD_OUTPUT_URL}/indexer/${BUILD_VERSION_FILE_NAME}?cache_buster=$(date +%s)

# read the version from the file into a variable & download the binary
RUN BUILD_VERSION=$(cat ${BUILD_VERSION_FILE_NAME}) && \
    curl -o main -L ${BUILD_OUTPUT_URL}/indexer/indexer_${GOOS}_${GOARCH}_${BUILD_VERSION}

RUN chmod +x /cw/main

# define the command to be run on launch
CMD ["/cw/main", "-port", "3001", "-dbpath", "/cw/data", "-fbpath", "/cw/config/firebase.json", "-ws"]