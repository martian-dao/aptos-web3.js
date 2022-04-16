const apis = require('../dist/index.js');
const assert = require('assert').strict;
const fetch = require("cross-fetch");

describe("integration test", function() {
    it("should be able to create new wallet and airdrop", async function() {
        const bob = await apis.createWallet();
        await apis.airdrop(bob['code'], 420);
        assert.strictEqual(await apis.getBalance(bob["address key"]), 430); // createWallet() airdrops 10 coins
    });

    it("should be able to import wallet", async function() {
        const bob = await apis.createWallet();
        await apis.airdrop(bob['code'], 420);
        const bob2 = await apis.importWallet(bob['code'])
        assert.strictEqual(await apis.getBalance(bob2["address key"]), 440); // createWallet() and importWallet airdrops 10 coins
    });

    it("should be able to transfer", async function() {
        const alice = await apis.createWallet();
        await apis.airdrop(alice['code'], 5000);
        const bob = await apis.createWallet();

        await apis.transfer(alice["code"], bob["address key"], 20);

        assert.strictEqual(await apis.getBalance(bob["address key"]), 30); // createWallet() airdrops 10 coins
    });

    it("should be able to create NFT collection", async function() {
        const alice = await apis.createWallet();
        await apis.airdrop(alice['code'], 5000);

        await apis.createNFTCollection(alice['code'], "Alice's simple collection", "AliceCollection", "https://aptos.dev");

        const url = `${apis.TESTNET_URL}/accounts/${alice['address key']}/resources`
        const response = await fetch(url, {method: "GET"});
        const body = await response.json();
        for (var resource of body) {
            if (resource['type'] == '0x1::Token::Collections') {
                return assert.strictEqual(resource['data']['collections']['data'][0]['key'], "AliceCollection");
            }
        }
        throw new Error('Collection not found in the account');
    });

    it("should be able to create NFT", async function() {
        const alice = await apis.createWallet();
        await apis.airdrop(alice['code'], 5000);

        await apis.createNFTCollection(alice['code'], "Alice's simple collection", "AliceCollection", "https://aptos.dev");

        await apis.createNFT(alice['code'], "AliceCollection", "Alice's simple token", "AliceToken", 1, "https://aptos.dev/img/nyan.jpeg");

        const url = `${apis.TESTNET_URL}/accounts/${alice['address key']}/resources`
        const response = await fetch(url, {method: "GET"});
        const body = await response.json();
        for (var resource of body) {
            if (resource['type'] == '0x1::Token::Gallery') {
                return assert.strictEqual(resource['data']['gallery']['data'][0]['value']['name'], "AliceToken");
            }
        }
        throw new Error('NFT not found in the account');
    });

    it("should be able to transfer NFT", async function() {
        const alice = await apis.createWallet();
        await apis.airdrop(alice['code'], 10000);

        const bob = await apis.createWallet();
        await apis.airdrop(bob['code'], 10000);

        await apis.createNFTCollection(alice['code'], "Alice's simple collection", "AliceCollection", "https://aptos.dev");
        await apis.createNFT(alice['code'], "AliceCollection", "Alice's simple token", "AliceToken", 1, "https://aptos.dev/img/nyan.jpeg");

        await apis.offerNFT(alice['code'], bob['address key'], alice['address key'], "AliceCollection", "AliceToken", 1);
        await apis.claimNFT(bob['code'], alice['address key'], alice['address key'], "AliceCollection", "AliceToken");

        const url = `${apis.TESTNET_URL}/accounts/${bob['address key']}/resources`
        const response = await fetch(url, {method: "GET"});
        const body = await response.json();
        for (var resource of body) {
            if (resource['type'] == '0x1::Token::Gallery') {
                return assert.strictEqual(resource['data']['gallery']['data'][0]['value']['name'], "AliceToken");
            }
        }
        throw new Error('NFT not found in the receiver account');
    });

    it("should be able to sign a generic transaction", async function() {
        const alice = await apis.createWallet();
        await apis.airdrop(alice['code'], 4200);
        const bob = await apis.createWallet();
        const recipient = bob['address key'];
        const amount = 10;
        await apis.signGenericTransaction(alice.code, "0x1::TestCoin::transfer", `0x${recipient}`, amount.toString())
        assert.strictEqual(await apis.getBalance(bob["address key"]), 20); //createwallet() adds 10 coins
    });

});