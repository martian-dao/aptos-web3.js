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
    console.log(yield apis.getBalance(bobAccount.address()));
    console.log(yield apis.transfer(bobAccount, aliceAccount.address(), 130));
    console.log(yield apis.getBalance(bobAccount.address()));
    console.log("alice address", aliceAccount.address(), "bob address", bobAccount.address());
    console.log(yield apis.accountTransactions(aliceAccount.address()));
}));
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
//     await apis.rotateAuthKey(alice.code, alice.accounts[2]);
//     alice = await apis.importWallet(alice.code);
//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.rotateAuthKey(alice.code, alice.accounts[2]);
//     alice = await apis.importWallet(alice.code);
//     aliceAccount = await apis.getAccountFromMetaData(alice.code, alice.accounts[2]);
//     await apis.transfer(aliceAccount, alice.accounts[3].address, 100);
//     console.log(await apis.getBalance(aliceAccount.address().toString()));
//     console.log(await apis.getBalance(alice.accounts[3].address));
// }, 50 * 1000,);
//# sourceMappingURL=wallet_client.test.js.map