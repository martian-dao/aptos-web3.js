# Introduction
Web3.js for Aptos

@martiandao/aptos-web3.js is an npm module which allows developers to communicate with the Aptos ecosystem.

# Import
```
npm i @martiandao/aptos-web3.js
```

# Supported functions
1. createWallet: create a new wallet
2. importWallet: import an existing wallet
3. airdrop: airdrop test coins into an account
4. getBalance: get the balance of an account
5. transfer: transfer coins from one account to another
6. getSentEvents: get Sent events of an account
7. getReceivedEvents: get Received events of an account
8. createNFTCollection: create an NFT collection
9. createNFT: create an NFT
11. offerNFT: offer an NFT to a receiver
12. claimNFT: claim an NFT offered by a sender
13. cancelNFTOffer: cancel an outgoing NFT offer

# Tests
Mocha tests allow to test whether each function is working as it supposed to.
```
npm test
```
