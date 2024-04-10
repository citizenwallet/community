# Citizen Wallet Community

A community = A token

Here are a set of interfaces for you to run an ERC20 token without transaction fees.

This includes a web wallet, an admin dashboard, a token transaction indexer and a transaction bundler (transaction fee sponsorship).

## How to run locally?

This is meant to run on a Linux system with AMD64 or ARM64 architecture.
You can run it on your local machine for development purposes (just ignore that error).

```
git clone git@github.com:citizenwallet/community.git
cd community
npm install
cp .env.example .env
```

Then you need to run

```
npm run community
```

If you just need to run it locally for development purposes, feel free to exit the script (CTRL+C) whenever it is asking for your password. Then make sure you create a `.community/config/community.json` and a `.community/config/hash` file.

Otherwise, to continue and generate those files, enter the root password (needed to chmod the newly `.community` folder created) and proceed.

Then you can finally run

```
npm run dev
```

## Web Wallet /

- ERC4337
- Smart Contract Accounts
- No transaction fees
- QR Codes
- ERC721 (NFT) user profiles (@my-username)
- Optimistic transactions (pending transactions)

## Admin Dashboard /dashboard

- Token stats
- Faucets

## Transaction Indexer + Bundler /indexer

- ERC20 transfer event indexing
- Paginated transaction API endpoints
- Push notifications
- IPFS file pinning
- SQLite database
- User Operation Bundler (ERC4337)
- Optimistic Transactions (transaction submissions to the bundler are available as "pending" transactions until they are confirmed on chain)
