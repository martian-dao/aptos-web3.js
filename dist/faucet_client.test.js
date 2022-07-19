"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_client_1 = require("./aptos_client");
const faucet_client_1 = require("./faucet_client");
const aptos_account_1 = require("./aptos_account");
const hex_string_1 = require("./hex_string");
const util_test_1 = require("./util.test");
test('full tutorial faucet flow', async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const account1 = new aptos_account_1.AptosAccount();
    const txns = await faucetClient.fundAccount(account1.address(), 5000);
    const tx1 = await client.getTransaction(txns[1]);
    expect(tx1.type).toBe('user_transaction');
    let resources = await client.getAccountResources(account1.address());
    let accountResource = resources.find((r) => r.type === '0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>');
    expect(accountResource.data.coin.value).toBe('5000');
    const account2 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account2.address(), 0);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === '0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>');
    expect(accountResource.data.coin.value).toBe('0');
    const payload = {
        type: 'script_function_payload',
        function: '0x1::Coin::transfer',
        type_arguments: ['0x1::TestCoin::TestCoin'],
        arguments: [account2.address().hex(), '717'],
    };
    const txnRequest = await client.generateTransaction(account1.address(), payload);
    const signedTxn = await client.signTransaction(account1, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === '0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>');
    expect(accountResource.data.coin.value).toBe('717');
    const res = await client.getAccountTransactions(account1.address(), { start: 0 });
    const tx = res.find((e) => e.type === 'user_transaction');
    expect(new hex_string_1.HexString(tx.sender).toShortString()).toBe(account1.address().toShortString());
    const events = await client.getEventsByEventHandle(tx.sender, '0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>', 'withdraw_events');
    expect(events[0].type).toBe('0x1::Coin::WithdrawEvent');
    const eventSubset = await client.getEventsByEventHandle(tx.sender, '0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>', 'withdraw_events', { start: 0, limit: 1 });
    expect(eventSubset[0].type).toBe('0x1::Coin::WithdrawEvent');
    const events2 = await client.getEventsByEventKey(events[0].key);
    expect(events2[0].type).toBe('0x1::Coin::WithdrawEvent');
}, 30 * 1000);
//# sourceMappingURL=faucet_client.test.js.map