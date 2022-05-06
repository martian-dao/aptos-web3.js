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
test("should test fungible tokens (coins)", () => __awaiter(void 0, void 0, void 0, function* () {
    const aliceCode = 'unable hollow bike collect myself now release social person senior vanish price';
    const alice = yield apis.getAccountFromMnemonic(aliceCode);
    const type_parameter = "0x47EA3C6275F6C0F351C7F2E99E4E5E925AD1AE9E836D442D309884A4A08F4FE6::MartianCoin::Martian";
    const coin_name = "$Martiansss";
    const bob = yield apis.createWallet();
    // console.log("\n=== Addresses ===");
    // console.log(`Alice: ${alice.address()}. Key Seed: ${Buffer.from(alice.signingKey.secretKey).toString("hex").slice(0, 64)}`);
    // console.log(`Bob: ${bob["address key"]}. Key Seed: ${Buffer.from(bob.signingKey.secretKey).toString("hex").slice(0, 64)}`);
    yield apis.airdrop(alice.address().toString(), 10000000);
    yield apis.airdrop(bob["address key"], 10000000);
    console.log("\n=== Running New Coin functions ===");
    // await client.initiateCoin(alice, type_parameter, coin_name, 1);
    // await client.registerCoin(alice, type_parameter);
    yield apis.registerCoin(bob.code, type_parameter);
    yield apis.mintCoin(aliceCode, type_parameter, bob["address key"], 200);
    yield apis.transferCoin(bob.code, type_parameter, alice.address().toString(), 69);
    console.log(`Balance: ${yield apis.getCoinBalance(alice.address().toString(), type_parameter)}`);
}));
//# sourceMappingURL=wallet_client.test.js.map