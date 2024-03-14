# syntax=docker/dockerfile:1
# Build the binary from a golang image
FROM golang:1.22 AS builder

ARG REPO_PATH
ARG REPO_NAME
ARG GOOS
ARG GOARCH

ENV CGO_ENABLED=1
ENV GOOS=${GOOS}
ENV GOARCH=${GOARCH}

# create build folder
RUN mkdir -p /cw-build
# create binaries folder
RUN mkdir -p /cw

# move into build folder
WORKDIR /cw-build

# fetch the repository and ignore the cache
ADD ${REPO_PATH} skipcache

# clone the repository
RUN git clone --depth 1 ${REPO_PATH}

# move into the repository
WORKDIR /cw-build/${REPO_NAME}

# install all plugins
RUN go mod download

# build
RUN go build -o /cw/main cmd/node/main.go

# clean up container
RUN rm -rf /cw-build

# Set up the runtime image
FROM golang:1.22

RUN mkdir -p /cw

COPY --from=builder /cw/main /cw/main

RUN chmod +x /cw/main

WORKDIR /cw

# define the command to be run on launch
CMD ["./main", "-evm", "celo", "-port", "3001", "dbpath", "/cw/data"]