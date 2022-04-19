# Martian aptos-web3.js Docs

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
10. offerNFT: offer an NFT to a receiver
11. claimNFT: claim an NFT offered by a sender
12. cancelNFTOffer: cancel an outgoing NFT offer

## Functions and their args, return values and description

| Name | Argument: [name: type] | Returns | Description |
| --- | --- | --- | --- |
| createWallet | None | "code": string  "address key": string | This method is used to create new wallet. It returns “code” which is a secret phrase and “address key” which is public address of the wallet |
| importWallet | code: string | "address key": string | This method is used to import wallet from mnemonic/secret phrase. It returns “address key” which is public address of the wallet |
| airdrop | code: string  amount: number | None | This method is used to add coins in the wallet.  |
| getBalance | address: string | balance: Integer | This method is used to get available balance of any address. It returns integer |
| transfer | code: string  recipient_address: string  amount: number | None | This method is used to transfer fund from one account to another. It returns Nothing |
| getSentEvents | address: string | [Click Here](https://fullnode.devnet.aptoslabs.com/accounts/e1acaa6eadbde51a0070327f095a1253deb1bbe919369b971621156fa18bd770/events/0x1::TestCoin::TransferEvents/sent_events)| This method is used to fetch sent events done by the wallet. Please hit the url given in the returns field to see what it return |
| getReceivedEvents | address: string |[Click Here](https://fullnode.devnet.aptoslabs.com/accounts/e1acaa6eadbde51a0070327f095a1253deb1bbe919369b971621156fa18bd770/events/0x1::TestCoin::TransferEvents/received_events) | This method is used to fetch received events to the wallet. Please hit the url given in the returns field to see what it return |
| createNFTCollection | code: string description: string name: string uri: string | hash: string | This method is used to create collection inside the wallet/account. It returns submission hash |
| createNFT | code: string collection_name: string description: string name: string supply: number uri: string | hash: string | This method is used to create nft inside collection. It returns submission hash |
| offerNFT | code: string receiver_address: string  creator_address: string collection_name: string token_name: string amount: number | hash: string | This method is used to offer nft to another address. |
| claimNFT | code: string sender_address: string creator_address: string collection_name: string token_name: string | hash: string | This method is used to claim nft offered |

# Usage Example Wallet

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
