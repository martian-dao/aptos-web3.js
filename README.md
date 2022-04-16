# Introduction
web3.js library for Aptos

@martiandao/aptos-web3.js is an npm module which allows developers to communicate with the Aptos core code.

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

# Usage Example
```
const aptosWeb3 = require('@martiandao/aptos-web3.js');

async function main() {

    // create a connection with Aptos RPC node
    client = new aptosWeb3.RestClient(aptosWeb3.TESTNET_URL);

    // create new wallet (10 test tokens airdropped by default)
    console.log("\n=== Wallet Creation ===");
    const wallet = await aptosWeb3.createWallet();
    const address = wallet['address key'];
    const signingKey = wallet['code'];

    console.log('Address:', address);
    console.log('Secret recovery phrase:', signingKey);

    // airdrop test tokens
    console.log("\n=== Airdrop ===");
    await aptosWeb3.airdrop(wallet['code'],5000);
    console.log('Balance:', await aptosWeb3.getBalance(address));

    // transfer tokens
    console.log("\n=== Transfer ===");
    const receiver_address = "d27307a2ccf76b4694c2b8f2ddf032fd487dbc82cb32e8b264026a9aee14df8d";
    await aptosWeb3.transfer(signingKey, receiver_address, 420);
    console.log('Balance:', await aptosWeb3.getBalance(address));

    // get wallet transaction history
    console.log("\n=== Wallet history ===");
    const received_history = await aptosWeb3.getReceivedEvents(address);
    const sent_history = await aptosWeb3.getSentEvents(address);
    console.log('Received History:', received_history);
    console.log('Sent History:', sent_history);
}

main()

```

# Tests
Mocha tests allow to test whether each function is working as it supposed to.
```
npm test
```
