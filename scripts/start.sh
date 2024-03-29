#!/bin/bash

echo
echo "Start script 1.0.0"
echo

# check for curl, install if needed
if command -v curl >/dev/null 2>&1; then
    echo "Checking for curl: ✅"
else
    echo "Checking for curl: Needs to be installed"
    sudo apt update
    sudo apt install curl -y
    echo "curl installed"
fi

# check for node, install if needed
if command -v node >/dev/null 2>&1; then
    echo "Checking for Node.js: ✅"
else
    echo "Checking for Node.js: Needs to be installed"

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    source ~/.bashrc

    nvm install 21

    echo "Node installed"
fi

# check for git, install if needed
if command -v git >/dev/null 2>&1; then
    echo "Checking for git: ✅"
else
    echo "Checking for git: Needs to be installed"
    sudo apt update
    sudo apt install git -y
    echo "git installed"
fi

# check for docker, install if needed
if command -v docker >/dev/null 2>&1; then
    echo "Checking for docker: ✅"
else
    echo "Checking for docker: Needs to be
    installed"
    sudo apt update
    sudo apt install docker -y

    sudo groupadd docker

    sudo usermod -aG docker ${USER}

    su -s ${USER}

    echo "docker installed"
fi

# check for community repo, clone if not exists
if [ -d "community" ]; then
    echo "Community: ✅"
else
    echo "Community: Needs to be downloaded"

    git clone https://github.com/citizenwallet/community.git

    echo "Community: ✅"
fi

# change directory to community
cd community

# make sure code is up to date
echo "Community: updating"

git pull origin main

echo "Community: updated"

# install dependencies
echo "Community: installing dependencies"

npm i --no-audit

echo "Community: dependencies installed"

echo
echo

# run start script
npx ts-node scripts/start.ts