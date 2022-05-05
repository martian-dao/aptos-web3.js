import {WalletClient} from "./wallet_client"
import { NODE_URL, FAUCET_URL } from "./util.test";
import fetch from "node-fetch"
import { TokenClient } from "./token_client";
import { AptosClient } from ".";

const apis = new WalletClient(NODE_URL, FAUCET_URL)

test("should be able to create new wallet and airdrop", async () => {
    console.log(await apis.getEventStream('de15e8c956964543802ff051c14fe3ccfea70f477e5ebb706f5fee294380bc2d', `0x8e0af08cc9151fd24f6ee1d8125bcdf53607a277b9641f610a0b1dbcd2941e8f::Marketplace::Marketplace`, "list_events"));
    // const bob = await apis.createWallet();
    // expect(await apis.getBalance(bob["address key"])).toBe(10);
});

test("should be able to import wallet", async () => {
    const bob = await apis.createWallet();
    await apis.airdrop(bob['address key'], 420);
    const bob2 = await apis.importWallet(bob['code'])
    console.log(bob2);
    expect(await apis.getBalance(bob2["address key"])).toBe(440);
});

test("should be able to transfer", async () => {
    const alice = await apis.createWallet();
    await apis.airdrop(alice['address key'], 5000);
    const bob = await apis.createWallet();
    await apis.transfer(alice["code"], bob["address key"], 20);
    expect(await apis.getBalance(bob["address key"])).toBe(30); 
});

test("should be able to create NFT collection", async () => {
    const alice = await apis.createWallet();
    await apis.airdrop(alice['address key'], 5000);
    const collectionName = "AliceCollection";
    await apis.createNFTCollection(alice['code'], "Alice's simple collection", collectionName, "https://aptos.dev");
    const collection = await apis.getCollection(alice["address key"], collectionName);
    expect(collection.name).toBe(collectionName);
});

test("should be able to create NFT", async () => {
    const alice = await apis.createWallet();
    // console.log(alice);
    await apis.airdrop(alice['address key'], 5000);
    const collectionName = "AliceCollection";
    const tokenName =  "AliceToken";
    await apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev");
    await apis.createNFT(alice['code'], collectionName,  tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg");

    const tokens = await apis.getTokens(alice["address key"]);
    expect(tokens[0].name).toBe(tokenName);
});

test("should be able to transfer NFT", async () => {
    const alice = await apis.createWallet();
    // console.log(alice);
    await apis.airdrop(alice['address key'], 10000);

    const bob = await apis.createWallet();
    // console.log(bob);
    await apis.airdrop(bob['address key'], 10000);

    const collectionName = "AliceCollection";
    const tokenName =  "AliceToken";

    await apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev");
    await apis.createNFT(alice['code'], collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg");

    await apis.offerNFT(alice['code'], bob['address key'], alice['address key'], collectionName, tokenName, 1);
    await apis.claimNFT(bob['code'], alice['address key'], alice['address key'], collectionName, tokenName);

    const tokens = await apis.getTokens(bob["address key"]);
    expect(tokens[0].name).toBe(tokenName);
},
30 * 1000);

test("should be able to sign a generic transaction", async () => {
    const alice = await apis.createWallet();
    await apis.airdrop(alice['address key'], 4200);
    const bob = await apis.createWallet();
    const recipient = bob['address key'];
    const amount = 10;
    await apis.signGenericTransaction(alice.code, "0x1::TestCoin::transfer", `0x${recipient}`, amount.toString())
    expect(await apis.getBalance(bob["address key"])).toBe(20); 
});

// test("should be able to rotate an auth key", async function() {
//     const alice = await apis.createWallet();
//     await apis.airdrop(alice['address key'], 2000);

//     const bob = await apis.createWallet();

//     const newKeys = await apis.getUninitializedAccount()

//     await apis.rotateAuthKey(alice['code'], newKeys.auth_key.toString());
//     await apis.transfer(newKeys.code, bob["address key"], 100, alice["address key"]);

//     const cam = await apis.createWallet();
//     await apis.airdrop(cam['address key'], 8000);

//     await apis.transfer(cam.code, alice["address key"], 5000);
    
//     expect(await apis.getBalance(alice["address key"])).toBeGreaterThan(5000);
//     expect(await apis.getBalance(bob["address key"])).toBe(110); //createwallet() adds 10 coins
// });