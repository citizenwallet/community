# Citizen Wallet Community

A community = A token

Here are a set of interfaces for you to run an ERC20 token without transaction fees.

This includes a web wallet, an admin dashboard, a token transaction indexer and a transaction bundler (transaction fee sponsorship).

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
