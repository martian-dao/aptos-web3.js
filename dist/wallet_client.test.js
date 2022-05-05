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
test("should be able to create new wallet and airdrop", () => __awaiter(void 0, void 0, void 0, function* () {
    const bob = yield apis.createWallet();
    expect(yield apis.getBalance(bob["address key"])).toBe(10);
}));
test("should be able to import wallet", () => __awaiter(void 0, void 0, void 0, function* () {
    const bob = yield apis.createWallet();
    yield apis.airdrop(bob['address key'], 420);
    const bob2 = yield apis.importWallet(bob['code']);
    console.log(bob2);
    expect(yield apis.getBalance(bob2["address key"])).toBe(440);
}));
test("should be able to transfer", () => __awaiter(void 0, void 0, void 0, function* () {
    const alice = yield apis.createWallet();
    yield apis.airdrop(alice['address key'], 5000);
    const bob = yield apis.createWallet();
    yield apis.transfer(alice["code"], bob["address key"], 20);
    expect(yield apis.getBalance(bob["address key"])).toBe(30);
}));
test("should be able to create NFT collection", () => __awaiter(void 0, void 0, void 0, function* () {
    const alice = yield apis.createWallet();
    yield apis.airdrop(alice['address key'], 5000);
    const collectionName = "AliceCollection";
    console.log(yield apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev"));
    const collection = yield apis.getCollection(alice["address key"], collectionName);
    expect(collection.name).toBe(collectionName);
}));
test("should be able to create NFT", () => __awaiter(void 0, void 0, void 0, function* () {
    const alice = yield apis.createWallet();
    // console.log(alice);
    yield apis.airdrop(alice['address key'], 5000);
    const collectionName = "AliceCollection";
    const tokenName = "AliceToken";
    yield apis.createNFTCollection(alice['code'], collectionName, "Alice's simple collection", "https://aptos.dev");
    yield apis.createNFT(alice['code'], collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg");
    const tokens = yield apis.getTokens(alice["address key"]);
    expect(tokens[0].name).toBe(tokenName);
}));
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
    yield apis.offerNFT(alice['code'], bob['address key'], alice['address key'], collectionName, tokenName, 1);
    yield apis.claimNFT(bob['code'], alice['address key'], alice['address key'], collectionName, tokenName);
    const tokens = yield apis.getTokens(bob["address key"]);
    expect(tokens[0].name).toBe(tokenName);
}), 30 * 1000);
test("should be able to sign a generic transaction", () => __awaiter(void 0, void 0, void 0, function* () {
    const alice = yield apis.createWallet();
    yield apis.airdrop(alice['address key'], 4200);
    const bob = yield apis.createWallet();
    const recipient = bob['address key'];
    const amount = 10;
    yield apis.signGenericTransaction(alice.code, "0x1::TestCoin::transfer", `0x${recipient}`, amount.toString());
    expect(yield apis.getBalance(bob["address key"])).toBe(20);
}));
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