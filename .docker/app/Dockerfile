FROM ghcr.io/cirruslabs/flutter:stable

ARG REPO_PATH
ARG REPO_NAME

ENV REPO_NAME=${REPO_NAME}

# prepare our working directory
RUN mkdir -p /home/flutter/cw
RUN mkdir -p /home/flutter/cw/web

# switch to the working directory
WORKDIR /home/flutter/cw

# fetch the repository and ignore the cache
ADD ${REPO_PATH} skipcache

# clone the repository
RUN git clone --depth 1 ${REPO_PATH}

# move into the repository
WORKDIR /home/flutter/cw/${REPO_NAME}

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