#!/bin/bash

DOMAIN=$1

cd $HOME/community
docker compose run --rm certbot-renew certonly --non-interactive --webroot -w /var/www/certbot -d $DOMAIN

docker compose restart server