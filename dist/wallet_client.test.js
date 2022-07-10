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
test("should be able to transfer", () => __awaiter(void 0, void 0, void 0, function* () {
    const alice = yield apis.createWallet();
    var aliceAccount = yield apis.getAccountFromMetaData(alice.code, alice.accounts[0]);
    yield apis.airdrop(aliceAccount.address().toString(), 20000);
    const bob = yield apis.createWallet();
    var bobAccount = yield apis.getAccountFromMetaData(bob.code, bob.accounts[0]);
    yield apis.transfer(aliceAccount, bobAccount.address(), 15000);
    expect(yield apis.getBalance(bobAccount.address())).toBe(15000);
    // const collection_name = "AliceCollection";
    // const token_name = "Alice Token";
    // // Create collection and token on Alice's account
    // await apis.createCollection(aliceAccount, collection_name, "Alice's simple collection", "https://aptos.dev");
    // console.log(await apis.createToken(
    //     aliceAccount,
    //     collection_name,
    //     token_name,
    //   "Alice's simple token",
    //   1,
    //   "https://aptos.dev/img/nyan.jpeg",
    // ));
    // console.log("TOKENS", await apis.getTokens(aliceAccount.address().toString()))
    console.log("hello", yield apis.getTokens("0x107e49a8eb0484eb87621dc25d1d54194d606f914377e432e8c9e3847111e84b"));
    console.log(yield apis.getSentEvents(bobAccount.address()));
    console.log(yield apis.getBalance(bobAccount.address()));
    // console.log(await apis.transfer(bobAccount, aliceAccount.address(), 130));
    console.log(yield apis.signGenericTransaction(bobAccount, "0x1::Coin::transfer", [aliceAccount.address().toString(), "130"], ["0x1::TestCoin::TestCoin"]));
    console.log(yield apis.getBalance(bobAccount.address()));
    // console.log("alice address", aliceAccount.address(), "bob address", bobAccount.address())
    // console.log(await apis.accountTransactions(aliceAccount.address()))
}), 300000);
// test("should be able to create a new wallet and rotate auth keys", async () => {
//     var alice = await apis.createWallet();
//     console.log(alice);
//     var aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[0]);
//     await apis.airdrop(aliceAccount.address().toString(), 20000);
//     await apis.rotateAuthKey(alice.code, alice.accounts[0]);
//     alice = await apis.importWallet(alice.code);
//     console.log(alice);
//     await apis.createNewAccount(alice.code);
//     alice = await apis.importWallet(alice.code);
//     await apis.createNewAccount(alice.code);
//     alice = await apis.importWallet(alice.code);
//     await apis.createNewAccount(alice.code);
//     alice = await apis.importWallet(alice.code);
//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.airdrop(aliceAccount.address().toString(), 20000);
//     console.log(await apis.rotateAuthKey(alice.code, alice.accounts[2]));
//     alice = await apis.importWallet(alice.code);
//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.rotateAuthKey(alice.code, alice.accounts[2]);
//     alice = await apis.importWallet(alice.code);
//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.transfer(aliceAccount, alice.accounts[3].address, 100);
//     console.log(await apis.getBalance(aliceAccount.address().toString()));
//     console.log(await apis.getBalance(alice.accounts[3].address));
// },300000);
//# sourceMappingURL=wallet_client.test.js.map