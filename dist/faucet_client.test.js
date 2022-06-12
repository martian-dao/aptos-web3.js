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
const aptos_client_1 = require("./aptos_client");
const faucet_client_1 = require("./faucet_client");
const aptos_account_1 = require("./aptos_account");
const hex_string_1 = require("./hex_string");
const util_test_1 = require("./util.test");
test("full tutorial faucet flow", () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const account1 = new aptos_account_1.AptosAccount();
    const txns = yield faucetClient.fundAccount(account1.address(), 5000);
    const tx1 = yield client.getTransaction(txns[1]);
    expect(tx1.type).toBe("user_transaction");
    let resources = yield client.getAccountResources(account1.address());
    let accountResource = resources.find((r) => r.type === "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("5000");
    const account2 = new aptos_account_1.AptosAccount();
    yield faucetClient.fundAccount(account2.address(), 0);
    resources = yield client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("0");
    const payload = {
        type: "script_function_payload",
        function: "0x1::Coin::transfer",
        type_arguments: ["0x1::TestCoin::TestCoin"],
        arguments: [account2.address().hex(), "717"],
    };
    const txnRequest = yield client.generateTransaction(account1.address(), payload);
    const signedTxn = yield client.signTransaction(account1, txnRequest);
    const transactionRes = yield client.submitTransaction(account2, signedTxn);
    yield client.waitForTransaction(transactionRes.hash);
    resources = yield client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("717");
    const res = yield client.getAccountTransactions(account1.address(), { start: 0 });
    const tx = res.find((e) => e.type === "user_transaction");
    expect(new hex_string_1.HexString(tx.sender).toShortString()).toBe(account1.address().toShortString());
    const events = yield client.getEventsByEventHandle(tx.sender, "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>", "withdraw_events");
    expect(events[0].type).toBe("0x1::Coin::WithdrawEvent");
    const event_subset = yield client.getEventsByEventHandle(tx.sender, "0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>", "withdraw_events", { start: 0, limit: 1 });
    expect(event_subset[0].type).toBe("0x1::Coin::WithdrawEvent");
    const events2 = yield client.getEventsByEventKey(events[0].key);
    expect(events2[0].type).toBe("0x1::Coin::WithdrawEvent");
}), 30 * 1000);
//# sourceMappingURL=faucet_client.test.js.map