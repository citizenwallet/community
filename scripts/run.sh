#!/bin/bash

echo
echo "Run script 1.0.0"
echo

spinner() {
    local pid=$!
    local delay=0.1
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# check for curl, install if needed
if command -v curl >/dev/null 2>&1; then
    echo "✅ curl: installed"
else
    echo "⏳ curl: installing..."
    sudo apt update > /dev/null 2>&1 & spinner
    sudo apt install curl -y > /dev/null 2>&1 & spinner
    echo "✅ curl: installed"
fi

# check for node, install if needed
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js: installed"
else
    echo "⏳ Node.js: installing..."

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash > /dev/null 2>&1 & spinner

    export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    source ~/.bashrc

    nvm install 21 > /dev/null 2>&1

    echo "✅ Node.js: installed"
fi

# check for git, install if needed
if command -v git >/dev/null 2>&1; then
    echo "✅ git: installed"
else
    echo "⏳ git: installing..."
    sudo apt update > /dev/null 2>&1 & spinner
    sudo apt install git -y > /dev/null 2>&1 & spinner
    echo "✅ git: installed"
fi

# check for docker, install if needed
if command -v docker >/dev/null 2>&1; then
    echo "✅ docker: installed"
else
    echo "⏳ docker: installing..."
    # Add Docker's official GPG key:
    sudo apt-get update > /dev/null 2>&1 & spinner
    sudo apt-get install ca-certificates -y > /dev/null 2>&1 & spinner
    sudo install -m 0755 -d /etc/apt/keyrings > /dev/null 2>&1 & spinner
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc > /dev/null 2>&1 & spinner
    sudo chmod a+r /etc/apt/keyrings/docker.asc > /dev/null 2>&1

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update > /dev/null 2>&1 & spinner

    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y > /dev/null 2>&1 & spinner

    echo "✅ docker: installed"
fi

# Check if the docker group exists, and if it doesn't, create it
if ! getent group docker >/dev/null; then
    echo "Creating the docker group"
    sudo groupadd docker > /dev/null 2>&1
fi

# Check if the current user is a member of the docker group, and if they're not, add them to it
if ! groups ${USER} | grep &>/dev/null '\bdocker\b'; then
    echo "Adding the current user to the docker group"
    sudo usermod -aG docker ${USER} > /dev/null 2>&1

    echo
    echo
    echo "User permissions updated. Please exit, log in and run the script again 🔄."

    exit 0
fi

if [ ! -d "community" ]; then
    mkdir community
fi

if [ -f "community_version" ]; then
    CURRENT_VERSION=$(cat community_version)
else
    CURRENT_VERSION="0.0.0"
fi

curl -o community_version -L https://builds.internal.citizenwallet.xyz/community/version > /dev/null 2>&1

NEW_VERSION=$(cat community_version)

# check for community repo, clone if not exists
if [ "$CURRENT_VERSION" == "$NEW_VERSION" ]; then
    echo "✅ Community: installed"
else
    echo "⏳ Community: installing..."

    rm -rf community/.next > /dev/null 2>&1
    rm -rf community/assets > /dev/null 2>&1
    rm -rf community/public > /dev/null 2>&1
    rm -rf community/scripts > /dev/null 2>&1
    rm -rf community/src > /dev/null 2>&1
    rm -rf community/node_modules > /dev/null 2>&1

    curl -o community.tar.gz -L "https://builds.internal.citizenwallet.xyz/community/dashboard_${NEW_VERSION}.tar.gz" > /dev/null 2>&1 & spinner

    tar -xzf community.tar.gz -C community > /dev/null 2>&1

    echo "✅ Community: installed"
fi

script_path="$HOME/community/scripts/boot.sh"

chmod +x $script_path

# change directory to community
cd community

# trigger run script
echo "Installing dependencies, this can take a few seconds..."

npm i > /dev/null 2>&1 & spinner

# ensure that the proper os/arch of sqlite3 is installed
npm i sqlite3@5.1.6 > /dev/null 2>&1 & spinner

# run this script every time the system boots
if crontab -l | grep -q "@reboot rm -f $HOME/boot.log && bash -c 'curl -fsSL https://raw.githubusercontent.com/citizenwallet/community/main/scripts/run.sh | bash' > $HOME/boot_logs.log 2>&1"; then
    # there is an entry, do nothing
    echo "✅ Startup script: installed"
else
    # there is no entry, add it
    echo "⏳ Startup script: installing..."

    (crontab -l 2>/dev/null; echo "@reboot rm -f $HOME/boot.log && bash -c 'curl -fsSL https://raw.githubusercontent.com/citizenwallet/community/main/scripts/run.sh | bash' > $HOME/boot_logs.log 2>&1") | crontab -
   
    echo "✅ Startup script: installed"
fi

# trigger run script
echo "⏳ Launching community..."

npm run community