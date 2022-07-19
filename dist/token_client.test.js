"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faucet_client_1 = require("./faucet_client");
const aptos_account_1 = require("./aptos_account");
const aptos_client_1 = require("./aptos_client");
const token_client_1 = require("./token_client");
const util_test_1 = require("./util.test");
test('full tutorial nft token flow', async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const tokenClient = new token_client_1.TokenClient(client);
    const alice = new aptos_account_1.AptosAccount();
    const bob = new aptos_account_1.AptosAccount();
    // Fund both Alice's and Bob's Account
    await faucetClient.fundAccount(alice.address(), 10000);
    await faucetClient.fundAccount(bob.address(), 5000);
    const collectionName = 'AliceCollection';
    const tokenName = 'Alice Token';
    // Create collection and token on Alice's account
    // eslint-disable-next-line quotes
    await tokenClient.createCollection(alice, collectionName, "Alice's simple collection", 'https://aptos.dev');
    await tokenClient.createToken(alice, collectionName, tokenName, 
    // eslint-disable-next-line quotes
    "Alice's simple token", 1, 'https://aptos.dev/img/nyan.jpeg', 0);
    // Transfer Token from Alice's Account to Bob's Account
    await tokenClient.getCollectionData(alice.address().hex(), collectionName);
    let aliceBalance = await tokenClient.getTokenBalance(alice.address().hex(), collectionName, tokenName);
    expect(aliceBalance.value).toBe('1');
    const tokenData = await tokenClient.getTokenData(alice.address().hex(), collectionName, tokenName);
    expect(tokenData.collection).toBe('AliceCollection');
    await tokenClient.offerToken(alice, bob.address().hex(), alice.address().hex(), collectionName, tokenName, 1);
    aliceBalance = await tokenClient.getTokenBalance(alice.address().hex(), collectionName, tokenName);
    expect(aliceBalance.value).toBe('0');
    await tokenClient.cancelTokenOffer(alice, bob.address().hex(), alice.address().hex(), collectionName, tokenName);
    aliceBalance = await tokenClient.getTokenBalance(alice.address().hex(), collectionName, tokenName);
    expect(aliceBalance.value).toBe('1');
    await tokenClient.offerToken(alice, bob.address().hex(), alice.address().hex(), collectionName, tokenName, 1);
    aliceBalance = await tokenClient.getTokenBalance(alice.address().hex(), collectionName, tokenName);
    expect(aliceBalance.value).toBe('0');
    await tokenClient.claimToken(bob, alice.address().hex(), alice.address().hex(), collectionName, tokenName);
    const bobBalance = await tokenClient.getTokenBalanceForAccount(bob.address().hex(), {
        creator: alice.address().hex(),
        collection: collectionName,
        name: tokenName,
    });
    expect(bobBalance.value).toBe('1');
}, 30 * 1000);
//# sourceMappingURL=token_client.test.js.map