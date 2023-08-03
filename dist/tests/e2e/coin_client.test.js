"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_client_1 = require("../../providers/aptos_client");
const test_helper_test_1 = require("../unit/test_helper.test");
const aptos_account_1 = require("../../account/aptos_account");
const coin_client_1 = require("../../plugins/coin_client");
test("transfer and checkBalance works", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const coinClient = new coin_client_1.CoinClient(client);
    const alice = new aptos_account_1.AptosAccount();
    const bob = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(alice.address(), 100000000);
    await faucetClient.fundAccount(bob.address(), 0);
    await client.waitForTransaction(await coinClient.transfer(alice, bob, 42), { checkSuccess: true });
    expect(await coinClient.checkBalance(bob)).toBe(BigInt(42));
    // Test that `createReceiverIfMissing` works.
    const jemima = new aptos_account_1.AptosAccount();
    await client.waitForTransaction(await coinClient.transfer(alice, jemima, 717, { createReceiverIfMissing: true }), {
        checkSuccess: true,
    });
    // Check that using a string address instead of an account works with `checkBalance`.
    expect(await coinClient.checkBalance(jemima.address().hex())).toBe(BigInt(717));
}, test_helper_test_1.longTestTimeout);
//# sourceMappingURL=coin_client.test.js.map