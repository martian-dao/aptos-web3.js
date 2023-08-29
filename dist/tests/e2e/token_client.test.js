"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_account_1 = require("../../account/aptos_account");
const aptos_client_1 = require("../../providers/aptos_client");
const token_client_1 = require("../../plugins/token_client");
const test_helper_test_1 = require("../unit/test_helper.test");
const bcs_1 = require("../../bcs");
test("full tutorial nft token flow", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const tokenClient = new token_client_1.TokenClient(client);
    const alice = new aptos_account_1.AptosAccount();
    const bob = new aptos_account_1.AptosAccount();
    // Fund both Alice's and Bob's Account
    await faucetClient.fundAccount(alice.address(), 100000000);
    await faucetClient.fundAccount(bob.address(), 100000000);
    const collectionName = "AliceCollection";
    const tokenName = "Alice Token";
    // Create collection and token on Alice's account
    await client.waitForTransaction(await tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev"), { checkSuccess: true });
    await client.waitForTransaction(await tokenClient.createTokenWithMutabilityConfig(alice, collectionName, tokenName, "Alice's simple token", 2, "https://aptos.dev/img/nyan.jpeg", 1000, alice.address(), 1, 0, ["TOKEN_BURNABLE_BY_OWNER"], [(0, bcs_1.bcsSerializeBool)(true)], ["bool"], [false, false, false, false, true]), { checkSuccess: true });
    const tokenId = {
        token_data_id: {
            creator: alice.address().hex(),
            collection: collectionName,
            name: tokenName,
        },
        property_version: "0",
    };
    // Transfer Token from Alice's Account to Bob's Account
    await tokenClient.getCollectionData(alice.address().hex(), collectionName);
    let aliceBalance = await tokenClient.getTokenForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("2");
    const tokenData = await tokenClient.getTokenData(alice.address().hex(), collectionName, tokenName);
    expect(tokenData.name).toBe(tokenName);
    await client.waitForTransaction(await tokenClient.offerToken(alice, bob.address().hex(), alice.address().hex(), collectionName, tokenName, 1), { checkSuccess: true });
    aliceBalance = await tokenClient.getTokenForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("1");
    await client.waitForTransaction(await tokenClient.cancelTokenOffer(alice, bob.address().hex(), alice.address().hex(), collectionName, tokenName), { checkSuccess: true });
    aliceBalance = await tokenClient.getTokenForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("2");
    await client.waitForTransaction(await tokenClient.offerToken(alice, bob.address().hex(), alice.address().hex(), collectionName, tokenName, 1), { checkSuccess: true });
    aliceBalance = await tokenClient.getTokenForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("1");
    await client.waitForTransaction(await tokenClient.claimToken(bob, alice.address().hex(), alice.address().hex(), collectionName, tokenName), { checkSuccess: true });
    const bobBalance = await tokenClient.getTokenForAccount(bob.address().hex(), tokenId);
    expect(bobBalance.amount).toBe("1");
    // default token property is configured to be mutable and then alice can make bob burn token after token creation
    // test mutate Bob's token properties and allow owner to burn this token
    let a = await tokenClient.mutateTokenProperties(alice, bob.address(), alice.address(), collectionName, tokenName, 0, 1, ["test"], [(0, bcs_1.bcsSerializeBool)(true)], ["bool"]);
    await client.waitForTransactionWithResult(a);
    const newTokenId = {
        token_data_id: {
            creator: alice.address().hex(),
            collection: collectionName,
            name: tokenName,
        },
        property_version: "1",
    };
    const mutated_token = await tokenClient.getTokenForAccount(bob.address().hex(), newTokenId);
    // expect property map deserialization works
    expect(mutated_token.token_properties.data["test"].value).toBe("true");
    expect(mutated_token.token_properties.data["TOKEN_BURNABLE_BY_OWNER"].value).toBe("true");
    // burn the token by owner
    var txn_hash = await tokenClient.burnByOwner(bob, alice.address(), collectionName, tokenName, 1, 1);
    await client.waitForTransactionWithResult(txn_hash);
    const newbalance = await tokenClient.getTokenForAccount(bob.address().hex(), newTokenId);
    expect(newbalance.amount).toBe("0");
    //bob opt_in directly transfer and alice transfer token to bob directly
    txn_hash = await tokenClient.optInTokenTransfer(bob, true);
    await client.waitForTransactionWithResult(txn_hash);
    // alice still have one token with property version 0.
    txn_hash = await tokenClient.transferWithOptIn(alice, alice.address(), collectionName, tokenName, 0, bob.address(), 1);
    await client.waitForTransactionWithResult(txn_hash);
    const balance = await tokenClient.getTokenForAccount(bob.address().hex(), tokenId);
    expect(balance.amount).toBe("1");
}, test_helper_test_1.longTestTimeout);
//# sourceMappingURL=token_client.test.js.map