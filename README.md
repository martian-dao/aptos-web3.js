# Martian aptos-web3.js Docs

# Introduction

web3.js library for Aptos

@martiandao/aptos-web3-bip44.js is an npm module which allows developers to communicate with the Aptos core code. This module is built on top of [Typescript SDK of Aptos](https://github.com/aptos-labs/aptos-core/tree/main/ecosystem/typescript/sdk).

# Import

```
npm i @martiandao/aptos-web3-bip44.js.js
```
Checkout the [documents page](https://github.com/martian-dao/aptos-web3.js/blob/main/docs/classes/WalletClient.md) for the function definitions.

# Usage Example Wallet

```
const aptosWeb3 = require('@martiandao/aptos-web3-bip44.js');
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const walletClient = new aptosWeb3.WalletClient(NODE_URL, FAUCET_URL);
async function main() {

    // create new wallet
    console.log("\n=== Wallet Creation ===");
    const wallet = await apis.createWallet();
    const walletAccount = await WalletClient.getAccountFromMetaData(
        alice.code,
        alice.accounts[0]
    );
    const address = walletAccount.address().toString();

    console.log('Address:', address);

    // airdrop test tokens
    console.log("\n=== Airdrop ===");
    await walletClient.airdrop(address, 5000);
    console.log('Balance:', await walletClient.getBalance(address));

    // transfer tokens
    console.log("\n=== Transfer ===");
    const receiver_address = "0x123"; //replace this with a receiver's address
    await walletClient.transfer(walletAccount, receiver_address, 1000);
    console.log('Balance:', await walletClient.getBalance(address));
    console.log('Balance:', await walletClient.getBalance(receiver_address));
}

main()

```

# To Build
```
npm install
npm run build
```

# Tests

Jest tests allow to test whether each function is working as it supposed to.

```
npm run test
```
