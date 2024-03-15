# syntax=docker/dockerfile:1
FROM fischerscode/flutter:stable

ARG REPO_PATH
ARG REPO_NAME

ENV REPO_NAME=${REPO_NAME}

# switch to the working directory
WORKDIR /home/flutter/cw/web
WORKDIR /home/flutter/cw

# fetch the repository
ADD ${REPO_PATH} /home/flutter/cw/${REPO_NAME}

# move into the repository
WORKDIR /home/flutter/cw/${REPO_NAME}

# fix permission issues with the repo folder
USER root
RUN chown -R flutter:flutter .
USER flutter

# create the app environment files
COPY .env.app .env
COPY .env.app .web.env

# install all dependencies
RUN flutter --disable-analytics
RUN flutter pub get

# build the app
RUN flutter build web --source-maps --web-renderer canvaskit

# copy all the static files to the web directory
CMD sh -c "cp -R /home/flutter/cw/${REPO_NAME}/build/web/* /home/flutter/cw/web/"