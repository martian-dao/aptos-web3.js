import {WalletClient} from "./wallet_client"
import { NODE_URL, FAUCET_URL } from "./util.test";
import fetch from "node-fetch"
import { TokenClient } from "./token_client";
import { AptosAccount, AptosClient } from ".";

const apis = new WalletClient(NODE_URL, FAUCET_URL)

test("should be able to create new wallet and airdrop", async () => {
    const bob = await apis.createWallet();
    expect(await apis.getBalance(bob["address key"])).toBe(10);
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
    console.log(await apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev"));
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
    console.log(alice);
    await apis.airdrop(alice['address key'], 10000);

    const bob = await apis.createWallet();
    console.log(bob);
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

test("should test fungible tokens (coins)", async () => {
    const aliceCode = 'unable hollow bike collect myself now release social person senior vanish price'
    const alice = await apis.getAccountFromMnemonic(aliceCode);
    const type_parameter = "0x47EA3C6275F6C0F351C7F2E99E4E5E925AD1AE9E836D442D309884A4A08F4FE6::MartianCoin::Martian";
    const coin_name = "$Martiansss";

    const bob = await apis.createWallet();

    // console.log("\n=== Addresses ===");
    // console.log(`Alice: ${alice.address()}. Key Seed: ${Buffer.from(alice.signingKey.secretKey).toString("hex").slice(0, 64)}`);
    // console.log(`Bob: ${bob["address key"]}. Key Seed: ${Buffer.from(bob.signingKey.secretKey).toString("hex").slice(0, 64)}`);

    await apis.airdrop(alice.address().toString(), 10_000_000);
    await apis.airdrop(bob["address key"], 10_000_000);

    console.log("\n=== Running New Coin functions ===");

    // await client.initiateCoin(alice, type_parameter, coin_name, 1);
    // await client.registerCoin(alice, type_parameter);
    await apis.registerCoin(bob.code, type_parameter);
    await apis.mintCoin(aliceCode, type_parameter, bob["address key"], 200);
    await apis.transferCoin(bob.code, type_parameter, alice.address().toString(), 69);

    console.log(`Balance: ${await apis.getCoinBalance(alice.address().toString(), type_parameter)}`, )
})