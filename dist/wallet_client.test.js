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
// test("should be able to create new wallet and airdrop", async () => {
//     const bob = await apis.createWallet();
//     expect(await apis.getBalance(bob["address key"])).toBe(10);
// });
// test("should be able to import wallet", async () => {
//     const bob = await apis.createWallet();
//     await apis.airdrop(bob['address key'], 420);
//     const bob2 = await apis.importWallet(bob['code'])
//     expect(await apis.getBalance(bob["address key"])).toBe(440);
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
//     await apis.createNFTCollection(alice['code'], "Alice's simple collection", "AliceCollection", "https://aptos.dev");
//     // const url = `${NODE_URL}/accounts/${alice['address key']}/resources`
//     // const response = await fetch(url, { method: "GET" });
//     // const body: any = await response.json();
//     // for (var resource of body) {
//     //     if (resource['type'] == '0x1::Token::Collections') {
//     //         return expect(resource['data']['collections']['data'][0]['key']).toBe("AliceCollection");
//     //     }
//     // }
//     // throw new Error('Collection not found in the account');
// });
// test("should be able to create NFT", async () => {
//     const client = new AptosClient(NODE_URL);
//     const tokenClient = new TokenClient(client);
//     const alice = await apis.createWallet();
//     console.log(alice);
//     await apis.airdrop(alice['address key'], 5000);
//     const collectionName = "AliceCollection";
//     const tokenName =  "AliceToken";
//     await apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev");
//     await apis.createNFT(alice['code'], collectionName,  tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg");
//     // token = await tokenClient.getToken()
//     // const url = `${NODE_URL}/accounts/${alice['address key']}/resources`
//     // const response = await fetch(url, { method: "GET" });
//     // const body: any = await response.json();
//     // console.log(body);
//     // for (var resource of body) {
//     //     if (resource['type'] == '0x1::Token::Gallery') {
//     //         console.log(resource['data']['gallery']);
//     //         return expect(resource['data']['gallery']['data'][0]['value']['name']).toBe("AliceToken");
//     //     }
//     // }
//     // throw new Error('NFT not found in the account');
// });
test("should be able to transfer NFT", () => __awaiter(void 0, void 0, void 0, function* () {
    const alice = yield apis.createWallet();
    console.log(alice);
    yield apis.airdrop(alice['address key'], 10000);
    const bob = yield apis.createWallet();
    console.log(bob);
    yield apis.airdrop(bob['address key'], 10000);
    const collectionName = "AliceCollection";
    const tokenName = "AliceToken";
    yield apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev");
    yield apis.createNFT(alice['code'], collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg");
    // console.log(await apis.offerNFT(alice['code'], bob['address key'], alice['address key'], collectionName, tokenName, 1));
    // console.log(await apis.claimNFT(bob['code'], alice['address key'], alice['address key'], collectionName, tokenName));
    // console.log(await apis.getTokens(bob["address key"]));
    //     // const url = `${NODE_URL}/accounts/${bob['address key']}/resources`
    //     // const response = await fetch(url, { method: "GET" });
    //     // const body: any = await response.json();
    //     // for (var resource of body) {
    //     //     if (resource['type'] == '0x1::Token::Gallery') {
    //     //         return expect(resource['data']['gallery']['data'][0]['value']['name']).toBe("AliceToken");
    //     //     }
    //     // }
    //     throw new Error('NFT not found in the receiver account');
}), 30 * 1000);
// test("should be able to sign a generic transaction", async () => {
//     const alice = await apis.createWallet();
//     await apis.airdrop(alice['address key'], 4200);
//     const bob = await apis.createWallet();
//     const recipient = bob['address key'];
//     const amount = 10;
//     await apis.signGenericTransaction(alice.code, "0x1::TestCoin::transfer", `0x${recipient}`, amount.toString())
//     expect(await apis.getBalance(bob["address key"])).toBe(20); 
// });
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
//# sourceMappingURL=wallet_client.test.js.map