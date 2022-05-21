"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_client_1 = require("./wallet_client");
const util_test_1 = require("./util.test");
const apis = new wallet_client_1.WalletClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
test("should be able to create a new wallet and rotate auth keys", () => __awaiter(void 0, void 0, void 0, function* () {
    var alice = yield apis.createWallet();
    console.log(alice);
    var aliceAccount = yield apis.getAccountFromMetaData(alice.code, alice.accounts[0]);
    yield apis.airdrop(aliceAccount.address().toString(), 20000);
    yield apis.rotateAuthKey(alice.code, alice.accounts[0]);
    alice = yield apis.importWallet(alice.code);
    console.log(alice);
    yield apis.createNewAccount(alice.code);
    alice = yield apis.importWallet(alice.code);
    yield apis.createNewAccount(alice.code);
    alice = yield apis.importWallet(alice.code);
    yield apis.createNewAccount(alice.code);
    alice = yield apis.importWallet(alice.code);
    aliceAccount = yield apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
    yield apis.airdrop(aliceAccount.address().toString(), 20000);
    yield apis.rotateAuthKey(alice.code, alice.accounts[2]);
    alice = yield apis.importWallet(alice.code);
    aliceAccount = yield apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
    yield apis.rotateAuthKey(alice.code, alice.accounts[2]);
    alice = yield apis.importWallet(alice.code);
    console.log(alice);
    aliceAccount = yield apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
    yield apis.transfer(aliceAccount, alice.accounts[3].address, 100);
    console.log(yield apis.getBalance(aliceAccount.address().toString()));
    console.log(yield apis.getBalance(alice.accounts[3].address));
}));
// test("should test fungible tokens (coins)", async () => {
// const alice = await apis.importWallet('unable hollow bike collect myself now release social person senior vanish price');
// const aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);
// const type_parameter = "0x47EA3C6275F6C0F351C7F2E99E4E5E925AD1AE9E836D442D309884A4A08F4FE6::MartianCoin::Martian";
// const coin_name = "$Martiansss";
// const bob = await apis.createWallet();
// const bobAccount = await apis.getAccountFromMetaData(bob.code, bob.accounts[0]);
// // console.log("\n=== Addresses ===");
// // console.log(`Alice: ${alice.address()}. Key Seed: ${Buffer.from(alice.signingKey.secretKey).toString("hex").slice(0, 64)}`);
// // console.log(`Bob: ${bob["address key"]}. Key Seed: ${Buffer.from(bob.signingKey.secretKey).toString("hex").slice(0, 64)}`);
// await apis.airdrop(aliceAccount.address().toString(), 10_000_000);
// await apis.airdrop(bob.accounts[0].address, 10_000_000);
// console.log("\n=== Running New Coin functions ===");
// // await client.initiateCoin(alice, type_parameter, coin_name, 1);
// // await client.registerCoin(alice, type_parameter);
// await apis.registerCoin(bobAccount, type_parameter);
// await apis.mintCoin(aliceAccount, type_parameter, bobAccount.address().toString(), 200);
// await apis.transferCoin(bobAccount, type_parameter, aliceAccount.address().toString(), 69);
// console.log(`Balance: ${await apis.getCoinBalance(aliceAccount.address().toString(), type_parameter)}`, )
// })
// test("should be able to create NFT collection", async () => {
//     const alice = await apis.createWallet();
//     await apis.airdrop(alice['address key'], 5000);
//     const collectionName = "AliceCollection";
//     console.log(await apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev"));
//     const collection = await apis.getCollection(alice["address key"], collectionName);
//     expect(collection.name).toBe(collectionName);
// });
// test("should be able to import wallet", async () => {
//     const bob = await apis.createWallet();
//     await apis.airdrop(bob['address key'], 420);
//     const bob2 = await apis.importWallet(bob['code'])
//     console.log(bob2);
//     expect(await apis.getBalance(bob2["address key"])).toBe(440);
// });
// test("should be able to transfer", async () => {
//     const alice = await apis.createWallet();
//     await apis.airdrop(alice['address key'], 5000);
//     const bob = await apis.createWallet();
//     await apis.transfer(alice["code"], bob["address key"], 20);
//     expect(await apis.getBalance(bob["address key"])).toBe(30); 
// });
// test("should be able to create NFT collection", async () => {
//     const alice = await apis.createWallet();
//     await apis.airdrop(alice['address key'], 5000);
//     const collectionName = "AliceCollection";
//     await apis.createNFTCollection(alice['code'], "Alice's simple collection", collectionName, "https://aptos.dev");
//     const collection = await apis.getCollection(alice["address key"], collectionName);
//     expect(collection.name).toBe(collectionName);
// });
// test("should be able to create NFT", async () => {
//     const alice = await apis.createWallet();
//     // console.log(alice);
//     await apis.airdrop(alice['address key'], 5000);
//     const collectionName = "AliceCollection";
//     const tokenName =  "AliceToken";
//     await apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev");
//     await apis.createNFT(alice['code'], collectionName,  tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg");
//     const tokens = await apis.getTokens(alice["address key"]);
//     expect(tokens[0].name).toBe(tokenName);
// });
// test("should be able to transfer NFT", async () => {
//     const alice = await apis.createWallet();
//     // console.log(alice);
//     await apis.airdrop(alice['address key'], 10000);
//     const bob = await apis.createWallet();
//     // console.log(bob);
//     await apis.airdrop(bob['address key'], 10000);
//     const collectionName = "AliceCollection";
//     const tokenName =  "AliceToken";
//     await apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev");
//     await apis.createNFT(alice['code'], collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg");
//     await apis.offerNFT(alice['code'], bob['address key'], alice['address key'], collectionName, tokenName, 1);
//     await apis.claimNFT(bob['code'], alice['address key'], alice['address key'], collectionName, tokenName);
//     const tokens = await apis.getTokens(bob["address key"]);
//     expect(tokens[0].name).toBe(tokenName);
// },
// 30 * 1000);
// test("should be able to sign a generic transaction", async () => {
//     const alice = await apis.createWallet();
//     await apis.airdrop(alice['address key'], 4200);
//     const bob = await apis.createWallet();
//     const recipient = bob['address key'];
//     const amount = 10;
//     await apis.signGenericTransaction(alice.code, "0x1::TestCoin::transfer", `0x${recipient}`, amount.toString())
//     expect(await apis.getBalance(bob["address key"])).toBe(20); 
// });
// // test("should be able to rotate an auth key", async function() {
// //     const alice = await apis.createWallet();
// //     await apis.airdrop(alice['address key'], 2000);
// //     const bob = await apis.createWallet();
// //     const newKeys = await apis.getUninitializedAccount()
// //     await apis.rotateAuthKey(alice['code'], newKeys.auth_key.toString());
// //     await apis.transfer(newKeys.code, bob["address key"], 100, alice["address key"]);
// //     const cam = await apis.createWallet();
// //     await apis.airdrop(cam['address key'], 8000);
// //     await apis.transfer(cam.code, alice["address key"], 5000);
// //     expect(await apis.getBalance(alice["address key"])).toBeGreaterThan(5000);
// //     expect(await apis.getBalance(bob["address key"])).toBe(110); //createwallet() adds 10 coins
// // });
//# sourceMappingURL=wallet_client.test.js.map