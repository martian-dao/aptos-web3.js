"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("../../providers");
const plugins_1 = require("../../plugins");
const account_1 = require("../../account");
const utils_1 = require("../../utils");
const test_helper_test_1 = require("../unit/test_helper.test");
const aptosCoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
test("faucet url empty", () => {
    expect(() => {
        const faucetClient = new plugins_1.FaucetClient("http://localhost:8080", "");
        faucetClient.getAccount("0x1");
    }).toThrow("Faucet URL cannot be empty.");
});
test("full tutorial faucet flow", async () => {
    const client = new providers_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const account1 = new account_1.AptosAccount();
    const txns = await faucetClient.fundAccount(account1.address(), 10000000);
    const tx0 = await client.getTransactionByHash(txns[0]);
    expect(tx0.type).toBe("user_transaction");
    let resources = await client.getAccountResources(account1.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("10000000");
    const account2 = new account_1.AptosAccount();
    const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        type_arguments: [],
        arguments: [account2.address().hex(), 717],
    };
    const txnRequest = await client.generateTransaction(account1.address(), payload, { max_gas_amount: "2000" });
    const signedTxn = await client.signTransaction(account1, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    const txn = await client.waitForTransactionWithResult(transactionRes.hash);
    expect(txn?.success).toBe(true);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("717");
    const res = await client.getAccountTransactions(account1.address(), { start: BigInt(0) });
    const tx = res.find((e) => e.type === "user_transaction");
    expect(new utils_1.HexString(tx.sender).toShortString()).toBe(account1.address().toShortString());
    const events = await client.getEventsByEventHandle(tx.sender, aptosCoin, "withdraw_events");
    expect(events[0].type).toBe("0x1::coin::WithdrawEvent");
    const eventSubset = await client.getEventsByEventHandle(tx.sender, aptosCoin, "withdraw_events", {
        start: BigInt(0),
        limit: 1,
    });
    expect(eventSubset[0].type).toBe("0x1::coin::WithdrawEvent");
    const events2 = await client.getEventsByCreationNumber(events[0].guid.account_address, events[0].guid.creation_number);
    expect(events2[0].type).toBe("0x1::coin::WithdrawEvent");
}, test_helper_test_1.longTestTimeout);
//# sourceMappingURL=faucet_client.test.js.map