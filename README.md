# Citizen Wallet Community Server

A community = A token

Here are a set of interfaces for you to run an ERC20 token without transaction fees.

This includes a web wallet, an admin dashboard, a token transaction indexer and a transaction bundler (transaction fee sponsorship).

## Community Server & Wallet

### Web Wallet /

- ERC4337
- Smart Contract Accounts
- No transaction fees
- QR Codes
- ERC721 (NFT) user profiles (@my-username)
- Optimistic transactions (pending transactions)

### Admin Dashboard /dashboard

- Token stats
- Faucets

### Transaction Indexer + Bundler /indexer

- ERC20 transfer event indexing
- Paginated transaction API endpoints
- Push notifications
- IPFS file pinning
- SQLite database
- User Operation Bundler (ERC4337)
- Optimistic Transactions (transaction submissions to the bundler are available as "pending" transactions until they are confirmed on chain)

## Hosted Community Server

Get in touch with us in order to set up a community.

This can be:

- on your own domain: yourdomain.com
- as a subdomain: your-community.citizenwallet.xyz

We will provide:

- A server
- Push notification support
- Inclusion of your community in the native app (App Store and Play Store)
- Support

We charge a small fee of $x / month. That's it. Cancel at any time.

## Run your own Community Server

### Recommended Machine

- Linux arm64 with Ubuntu
  - On AWS “t4g.small” (but any other provider is also fine)
- 2 cores
- 2 GB RAM
- 8 GB Storage (mainly taken up by indexing ERC20 transfer events)
- A [Piñata](https://www.pinata.cloud/) account for pinning to IPFS
  - _Please submit a PR if you would like to add support for other providers._

### Preparing a server (terminal)

- Spin up a server.
- Log in via SSH
- Run `bash -c "$(curl -fsSL https://raw.githubusercontent.com/citizenwallet/community/main/scripts/run.sh)"`
- After installing and preparing the machine it displays this message: “User permissions updated. Please exit, log in and run the script again 🔄.”
  - _Please submit a PR if you feel like you can improve this._
- Exit (exit) and log in again via SSH.
- The script can be run again: `bash -c "$(curl -fsSL https://raw.githubusercontent.com/citizenwallet/community/main/scripts/run.sh)"`
- Enter your Piñata API key and secret
- You will be prompted for the domain you want to use
- You should see the entry you need to add in your DNS in order to verify your domain
- Confirm that this is added
- It is possible to configure the email to associate with the certificate (default is hello@citizenwallet.xyz)
- An SSL certificate is generated using LetsEncrypt for the given domain name
- You are then prompted to enter the firebase.json file to enable push notifications in the native app
  - _It is not possible for us to share this in a self-hosted way right now_
- The server is now ready to be configured
  - A URL (in text and QR code form) is displayed
  - This URL will take you to the configuration screen where you can configure your community and publish the contracts needed to run it

### Configuring your Community (web browser)

- Since the community is not yet configured, you are redirected to the configuration page
- Select a chain
- Fill out the form with the name, logo, url, color of your community
- Scan the QR code with a wallet app (Metamask in this case) and transfer the amount needed to publish
- Once the amount is received, confirm and then wait for the process to complete
  - The contracts are published on chain (token entrypoint, paymaster, profile, account factory)
  - The balance is refunded upon completion
  - The community configuration json is then published on IPFS
- The community server is now ready on your domain (indexing of ERC20, push, web wallet, gas fee sponsorship)
  - Web wallet: https://yourdomain.com
  - Dashboard: https://yourdomain.com/dashboard/admin
  - Indexer/Bundler: https://yourdomain.com/indexer (api)

### Start

- Create an account by opening the web wallet: https://yourdomain.com
- Copy your account's external address: "0x..."
  - We use a link format to enable easy deep linking, what you want is the actual address of your account
- Mint or send some tokens to this address
- You can now start sending tokens
- Gas fees will be sponsored by your server
  - Your server will only sponsor interactions with your token contract and profile contract.

### Add your community to the app

If you would like your community to be added to the Citizen Wallet native app's community list, submit a PR with your community.json here:

https://github.com/citizenwallet/app

Your community.json can be found at:

`https://yourdomain.com/config/community.json`

## Development (dashboard only)

```
git clone git@github.com:citizenwallet/community.git
cd community
npm i
```

### Without a community.json

This will display the `/config` page

```
npm start
```

### With a community.json

```
cp example.community.json .community/config/community.json
echo "x" >> .community/config/hash

npm start
```

## Development (full local community server)

We don't recommend running the full setup locally at this time but rather running the app and indexer separately:

- App: https://github.com/citizenwallet/app
- Indexer: https://github.com/citizenwallet/indexer

TODO: Add docker setup for full local development.

## Contributing

### Development

Feel free to submit PRs in the relevant repositories if you would like to make improvements or fix bugs.

- App: https://github.com/citizenwallet/app
- Indexer: https://github.com/citizenwallet/indexer
- SDK: https://github.com/citizenwallet/sdk
- Smart Contracts: https://github.com/citizenwallet/smartcontracts
- Community: This repository

### Financially

...
