# syntax=docker/dockerfile:1
# Set up the runtime image
FROM ubuntu:jammy

ARG BUILD_OUTPUT_URL
ARG BUILD_VERSION_FILE_NAME

WORKDIR /cw/app 
WORKDIR /cw/web 

WORKDIR /cw

# install curl
RUN apt-get update && apt-get install -y curl 

# download the version file
RUN curl -H 'Cache-Control: no-cache' -o ${BUILD_VERSION_FILE_NAME} -L ${BUILD_OUTPUT_URL}/web/${BUILD_VERSION_FILE_NAME}?cache_buster=$(date +%s)

# read the version from the file into a variable & download the binary
RUN BUILD_VERSION=$(cat ${BUILD_VERSION_FILE_NAME}) && \
    curl -o app.tar.gz -L ${BUILD_OUTPUT_URL}/web/cw_web_${BUILD_VERSION}.tar.gz && \
    tar -xvf app.tar.gz -C /cw/app

# copy all the static files to the web directory
CMD sh -c "rm -rf /cw/web/* && cp -R /cw/app/* /cw/web/"