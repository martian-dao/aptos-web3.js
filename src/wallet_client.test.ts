import {WalletClient} from "./wallet_client"
import { NODE_URL } from "./util.test";
import fetch from "node-fetch"

const apis = new WalletClient(NODE_URL)

test("should be able to create new wallet and airdrop", async () => {
    const bob = await apis.createWallet();
    await apis.airdrop(bob['code'], 420);
    expect(await apis.getBalance(bob["address key"])).toBe(430);
})

test("should be able to import wallet", async () => {
    const bob = await apis.createWallet();
    await apis.airdrop(bob['code'], 420);
    const bob2 = await apis.importWallet(bob['code'])
    expect(await apis.getBalance(bob["address key"])).toBe(440);
});

test("should be able to transfer", async () => {
    const alice = await apis.createWallet();
    await apis.airdrop(alice['code'], 5000);
    const bob = await apis.createWallet();
    await apis.transfer(alice["code"], bob["address key"], 20);
    expect(await apis.getBalance(bob["address key"])).toBe(30); 
});

test("should be able to create NFT collection", async () => {
    const alice = await apis.createWallet();
    await apis.airdrop(alice['code'], 5000);

    await apis.createNFTCollection(alice['code'], "Alice's simple collection", "AliceCollection", "https://aptos.dev");

    const url = `${NODE_URL}/accounts/${alice['address key']}/resources`
    const response = await fetch(url, { method: "GET" });
    const body: any = await response.json();
    for (var resource of body) {
        if (resource['type'] == '0x1::Token::Collections') {
            return expect(resource['data']['collections']['data'][0]['key']).toBe("AliceCollection");
        }
    }
    throw new Error('Collection not found in the account');
});

test("should be able to create NFT", async () => {
    const alice = await apis.createWallet();
    await apis.airdrop(alice['code'], 5000);

    await apis.createNFTCollection(alice['code'], "Alice's simple collection", "AliceCollection", "https://aptos.dev");

    await apis.createNFT(alice['code'], "AliceCollection", "Alice's simple token", "AliceToken", 1, "https://aptos.dev/img/nyan.jpeg");

    const url = `${NODE_URL}/accounts/${alice['address key']}/resources`
    const response = await fetch(url, { method: "GET" });
    const body: any = await response.json();
    for (var resource of body) {
        if (resource['type'] == '0x1::Token::Gallery') {
            return expect(resource['data']['gallery']['data'][0]['value']['name']).toBe("AliceToken");
        }
    }
    throw new Error('NFT not found in the account');
});

test("should be able to transfer NFT", async () => {
    const alice = await apis.createWallet();
    await apis.airdrop(alice['code'], 10000);

    const bob = await apis.createWallet();
    await apis.airdrop(bob['code'], 10000);

    await apis.createNFTCollection(alice['code'], "Alice's simple collection", "AliceCollection", "https://aptos.dev");
    await apis.createNFT(alice['code'], "AliceCollection", "Alice's simple token", "AliceToken", 1, "https://aptos.dev/img/nyan.jpeg");

    await apis.offerNFT(alice['code'], bob['address key'], alice['address key'], "AliceCollection", "AliceToken", 1);
    await apis.claimNFT(bob['code'], alice['address key'], alice['address key'], "AliceCollection", "AliceToken");

    const url = `${NODE_URL}/accounts/${bob['address key']}/resources`
    const response = await fetch(url, { method: "GET" });
    const body: any = await response.json();
    for (var resource of body) {
        if (resource['type'] == '0x1::Token::Gallery') {
            return expect(resource['data']['gallery']['data'][0]['value']['name']).toBe("AliceToken");
        }
    }
    throw new Error('NFT not found in the receiver account');
});

test("should be able to sign a generic transaction", async () => {
    const alice = await apis.createWallet();
    await apis.airdrop(alice['code'], 4200);
    const bob = await apis.createWallet();
    const recipient = bob['address key'];
    const amount = 10;
    await apis.signGenericTransaction(alice.code, "0x1::TestCoin::transfer", `0x${recipient}`, amount.toString())
    expect(await apis.getBalance(bob["address key"])).toBe(20); 
});
