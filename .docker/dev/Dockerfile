# Build the binary from a golang image
FROM golang:1.21.6-alpine3.19 AS builder

ARG ENTRYPOINT_PATH

ENV GOOS=linux \
    GOARCH=arm64

# create build folder
RUN mkdir -p /cw-build
# create binaries folder
RUN mkdir -p /cw

# move into build folder
WORKDIR /cw-build

# copy all go files into our container
COPY . .

# install all plugins
RUN go mod download

# build
RUN go build -o /cw/main ${ENTRYPOINT_PATH}

# clean up container
RUN rm -rf /cw-build

# Set up the runtime image
FROM arm64v8/ubuntu:24.04

RUN mkdir -p /cw

COPY --from=builder /cw/main /cw

# define the command to be run on launch
ENTRYPOINT ["/cw/main"]