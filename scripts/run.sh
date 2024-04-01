#!/bin/bash

echo
echo "Run script 1.0.0"
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

    export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

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
    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install ca-certificates -y
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update

    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

    echo "docker installed"
fi

# Check if the docker group exists, and if it doesn't, create it
if ! getent group docker >/dev/null; then
    echo "Creating the docker group"
    sudo groupadd docker
fi

# Check if the current user is a member of the docker group, and if they're not, add them to it
if ! groups ${USER} | grep &>/dev/null '\bdocker\b'; then
    echo "Adding the current user to the docker group"
    sudo usermod -aG docker ${USER}

    echo "User permissions updated. Please run the script again."
    newgrp docker
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

echo
echo "Run script complete: ✅"
echo "Community is ready to run"
echo

# trigger run script
npm run community