"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("../../account");
const plugins_1 = require("../../plugins");
const providers_1 = require("../../providers");
const test_helper_test_1 = require("../unit/test_helper.test");
const provider = new providers_1.Provider(test_helper_test_1.PROVIDER_LOCAL_NETWORK_CONFIG);
const faucetClient = (0, test_helper_test_1.getFaucetClient)();
const aptosToken = new plugins_1.AptosToken(provider);
const alice = new account_1.AptosAccount();
const bob = new account_1.AptosAccount();
const collectionName = "AliceCollection";
const tokenName = "Alice Token";
let tokenAddress = "";
describe("token objects", () => {
    beforeAll(async () => {
        // Fund Alice's Account
        await faucetClient.fundAccount(alice.address(), 100000000);
    }, test_helper_test_1.longTestTimeout);
    test("create collection", async () => {
        await provider.waitForTransaction(await aptosToken.createCollection(alice, "Alice's simple collection", collectionName, "https://aptos.dev", 5, {
            royaltyNumerator: 10,
            royaltyDenominator: 10,
        }), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("mint", async () => {
        const txn = await provider.waitForTransactionWithResult(await aptosToken.mint(alice, collectionName, "Alice's simple token", tokenName, "https://aptos.dev/img/nyan.jpeg", ["key"], ["bool"], ["true"]), { checkSuccess: true });
        tokenAddress = txn.events[0].data.token;
    }, test_helper_test_1.longTestTimeout);
    test("mint soul bound", async () => {
        await provider.waitForTransaction(await aptosToken.mintSoulBound(alice, collectionName, "Alice's simple soul bound token", "Alice's soul bound token", "https://aptos.dev/img/nyan.jpeg", bob, ["key"], ["bool"], ["true"]), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("freeze transfer", async () => {
        await provider.waitForTransaction(await aptosToken.freezeTokenTransafer(alice, tokenAddress), {
            checkSuccess: true,
        });
    }, test_helper_test_1.longTestTimeout);
    test("unfreeze token transfer", async () => {
        await provider.waitForTransaction(await aptosToken.unfreezeTokenTransafer(alice, tokenAddress), {
            checkSuccess: true,
        });
    }, test_helper_test_1.longTestTimeout);
    test("set token description", async () => {
        await provider.waitForTransaction(await aptosToken.setTokenDescription(alice, tokenAddress, "my updated token description"), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("set token name", async () => {
        await provider.waitForTransaction(await aptosToken.setTokenName(alice, tokenAddress, "my updated token name"), {
            checkSuccess: true,
        });
    }, test_helper_test_1.longTestTimeout);
    test("set token uri", async () => {
        await provider.waitForTransaction(await aptosToken.setTokenName(alice, tokenAddress, "https://aptos.dev/img/hero.jpg"), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("add token property", async () => {
        await provider.waitForTransaction(await aptosToken.addTokenProperty(alice, tokenAddress, "newKey", "BOOLEAN", "true"), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("add typed property", async () => {
        await provider.waitForTransaction(await aptosToken.addTypedProperty(alice, tokenAddress, "newTypedKey", "VECTOR", "[hello,world]"), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("update typed property", async () => {
        await provider.waitForTransaction(await aptosToken.updateTypedProperty(alice, tokenAddress, "newTypedKey", "U8", "2"), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("update token property", async () => {
        await provider.waitForTransaction(await aptosToken.updateTokenProperty(alice, tokenAddress, "newKey", "U8", "5"), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
    test("remove token property", async () => {
        await provider.waitForTransaction(await aptosToken.removeTokenProperty(alice, tokenAddress, "newKey"), {
            checkSuccess: true,
        });
    }, test_helper_test_1.longTestTimeout);
    test("transfer token ownership", async () => {
        await provider.waitForTransaction(await aptosToken.transferTokenOwnership(alice, tokenAddress, bob.address()), {
            checkSuccess: true,
        });
    }, test_helper_test_1.longTestTimeout);
    test("burn token", async () => {
        await provider.waitForTransaction(await aptosToken.burnToken(alice, tokenAddress), { checkSuccess: true });
    }, test_helper_test_1.longTestTimeout);
});
//# sourceMappingURL=aptos_token.test.js.map