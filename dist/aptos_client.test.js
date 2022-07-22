"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_client_1 = require("./aptos_client");
const util_test_1 = require("./util.test");
const faucet_client_1 = require("./faucet_client");
const aptos_account_1 = require("./aptos_account");
const transaction_builder_1 = require("./transaction_builder");
const token_client_1 = require("./token_client");
test("gets genesis account", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const account = await client.getAccount("0x1");
    expect(account.authentication_key.length).toBe(66);
    expect(account.sequence_number).not.toBeNull();
});
test("gets transactions", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const transactions = await client.getTransactions();
    expect(transactions.length).toBeGreaterThan(0);
});
test("gets genesis resources", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const resources = await client.getAccountResources("0x1");
    const accountResource = resources.find((r) => r.type === "0x1::account::Account");
    expect(accountResource.data.self_address).toBe("0x1");
});
test("gets the Account resource", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const accountResource = await client.getAccountResource("0x1", "0x1::account::Account");
    expect(accountResource.data.self_address).toBe("0x1");
});
test("gets ledger info", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const ledgerInfo = await client.getLedgerInfo();
    expect(ledgerInfo.chain_id).toBeGreaterThan(1);
    expect(parseInt(ledgerInfo.ledger_version, 10)).toBeGreaterThan(0);
});
test("gets account modules", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const modules = await client.getAccountModules("0x1");
    const module = modules.find((r) => r.abi.name === "test_coin");
    expect(module.abi.address).toBe("0x1");
});
test("gets the TestCoin module", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const module = await client.getAccountModule("0x1", "test_coin");
    expect(module.abi.address).toBe("0x1");
});
test("test raiseForStatus", async () => {
    const testData = { hello: "wow" };
    const fakeResponse = {
        status: 200,
        statusText: "Status Text",
        data: "some string",
        request: {
            host: "host",
            path: "/path",
        },
    };
    // Shouldn't throw
    (0, aptos_client_1.raiseForStatus)(200, fakeResponse, testData);
    (0, aptos_client_1.raiseForStatus)(200, fakeResponse);
    // an error, oh no!
    fakeResponse.status = 500;
    expect(() => (0, aptos_client_1.raiseForStatus)(200, fakeResponse, testData)).toThrow('Status Text - "some string" @ host/path : {"hello":"wow"}');
    expect(() => (0, aptos_client_1.raiseForStatus)(200, fakeResponse)).toThrow('Status Text - "some string" @ host/path');
    // Just a wild test to make sure it doesn't break: request is `any`!
    delete fakeResponse.request;
    expect(() => (0, aptos_client_1.raiseForStatus)(200, fakeResponse, testData)).toThrow('Status Text - "some string" : {"hello":"wow"}');
    expect(() => (0, aptos_client_1.raiseForStatus)(200, fakeResponse)).toThrow('Status Text - "some string"');
});
test("submits bcs transaction", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL, null);
    const account1 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account1.address(), 5000);
    let resources = await client.getAccountResources(account1.address());
    let accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("5000");
    const account2 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account2.address(), 0);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("0");
    const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString("0x1::test_coin::TestCoin"));
    const scriptFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadScriptFunction(transaction_builder_1.TxnBuilderTypes.ScriptFunction.natural("0x1::coin", "transfer", [token], [transaction_builder_1.BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account2.address())), transaction_builder_1.BCS.bcsSerializeUint64(717)]));
    const [{ sequence_number: sequnceNumber }, chainId] = await Promise.all([
        client.getAccount(account1.address()),
        client.getChainId(),
    ]);
    const rawTxn = new transaction_builder_1.TxnBuilderTypes.RawTransaction(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account1.address()), BigInt(sequnceNumber), scriptFunctionPayload, 1000n, 1n, BigInt(Math.floor(Date.now() / 1000) + 10), new transaction_builder_1.TxnBuilderTypes.ChainId(chainId));
    const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(account1, rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("717");
}, 30 * 1000);
test("submits multisig transaction", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL, null);
    const account1 = new aptos_account_1.AptosAccount();
    const account2 = new aptos_account_1.AptosAccount();
    const account3 = new aptos_account_1.AptosAccount();
    const multiSigPublicKey = new transaction_builder_1.TxnBuilderTypes.MultiEd25519PublicKey([
        new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(account1.signingKey.publicKey),
        new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(account2.signingKey.publicKey),
        new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(account3.signingKey.publicKey),
    ], 2);
    const authKey = transaction_builder_1.TxnBuilderTypes.AuthenticationKey.fromMultiEd25519PublicKey(multiSigPublicKey);
    const mutisigAccountAddress = authKey.derivedAddress();
    await faucetClient.fundAccount(mutisigAccountAddress, 5000);
    let resources = await client.getAccountResources(mutisigAccountAddress);
    let accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("5000");
    const account4 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account4.address(), 0);
    resources = await client.getAccountResources(account4.address());
    accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("0");
    const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString("0x1::test_coin::TestCoin"));
    const scriptFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadScriptFunction(transaction_builder_1.TxnBuilderTypes.ScriptFunction.natural("0x1::coin", "transfer", [token], [transaction_builder_1.BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account4.address())), transaction_builder_1.BCS.bcsSerializeUint64(123)]));
    const [{ sequence_number: sequnceNumber }, chainId] = await Promise.all([
        client.getAccount(mutisigAccountAddress),
        client.getChainId(),
    ]);
    const rawTxn = new transaction_builder_1.TxnBuilderTypes.RawTransaction(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(mutisigAccountAddress), BigInt(sequnceNumber), scriptFunctionPayload, 1000n, 1n, BigInt(Math.floor(Date.now() / 1000) + 10), new transaction_builder_1.TxnBuilderTypes.ChainId(chainId));
    const txnBuilder = new transaction_builder_1.TransactionBuilderMultiEd25519((signingMessage) => {
        const sigHexStr1 = account1.signBuffer(signingMessage);
        const sigHexStr3 = account3.signBuffer(signingMessage);
        const bitmap = transaction_builder_1.TxnBuilderTypes.MultiEd25519Signature.createBitmap([0, 2]);
        const muliEd25519Sig = new transaction_builder_1.TxnBuilderTypes.MultiEd25519Signature([
            new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(sigHexStr1.toUint8Array()),
            new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(sigHexStr3.toUint8Array()),
        ], bitmap);
        return muliEd25519Sig;
    }, multiSigPublicKey);
    const bcsTxn = txnBuilder.sign(rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(account4.address());
    accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("123");
}, 30 * 1000);
test("submits json transaction simulation", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const account1 = new aptos_account_1.AptosAccount();
    const account2 = new aptos_account_1.AptosAccount();
    const txns1 = await faucetClient.fundAccount(account1.address(), 5000);
    const txns2 = await faucetClient.fundAccount(account2.address(), 1000);
    const tx1 = await client.getTransaction(txns1[1]);
    const tx2 = await client.getTransaction(txns2[1]);
    expect(tx1.type).toBe("user_transaction");
    expect(tx2.type).toBe("user_transaction");
    const checkTestCoin = async () => {
        const resources1 = await client.getAccountResources(account1.address());
        const resources2 = await client.getAccountResources(account2.address());
        const account1Resource = resources1.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
        const account2Resource = resources2.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
        expect(account1Resource.data.coin.value).toBe("5000");
        expect(account2Resource.data.coin.value).toBe("1000");
    };
    await checkTestCoin();
    const payload = {
        type: "script_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::test_coin::TestCoin"],
        arguments: [account2.address().hex(), "1000"],
    };
    const txnRequest = await client.generateTransaction(account1.address(), payload);
    const transactionRes = await client.simulateTransaction(account1, txnRequest);
    expect(parseInt(transactionRes.gas_used, 10) > 0);
    expect(transactionRes.success);
    const account2TestCoin = transactionRes.changes.filter((change) => {
        if (change.type !== "write_resource") {
            return false;
        }
        const write = change;
        return (write.address === account2.address().toShortString() &&
            write.data.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>" &&
            write.data.data.coin.value === "2000");
    });
    expect(account2TestCoin).toHaveLength(1);
    await checkTestCoin();
}, 30 * 1000);
test("submits bcs transaction simulation", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const account1 = new aptos_account_1.AptosAccount();
    const account2 = new aptos_account_1.AptosAccount();
    const txns1 = await faucetClient.fundAccount(account1.address(), 5000);
    const txns2 = await faucetClient.fundAccount(account2.address(), 1000);
    const tx1 = await client.getTransaction(txns1[1]);
    const tx2 = await client.getTransaction(txns2[1]);
    expect(tx1.type).toBe("user_transaction");
    expect(tx2.type).toBe("user_transaction");
    const checkTestCoin = async () => {
        const resources1 = await client.getAccountResources(account1.address());
        const resources2 = await client.getAccountResources(account2.address());
        const account1Resource = resources1.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
        const account2Resource = resources2.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
        expect(account1Resource.data.coin.value).toBe("5000");
        expect(account2Resource.data.coin.value).toBe("1000");
    };
    await checkTestCoin();
    const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString("0x1::test_coin::TestCoin"));
    const scriptFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadScriptFunction(transaction_builder_1.TxnBuilderTypes.ScriptFunction.natural("0x1::coin", "transfer", [token], [transaction_builder_1.BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account2.address())), transaction_builder_1.BCS.bcsSerializeUint64(1000)]));
    const [{ sequence_number: sequnceNumber }, chainId] = await Promise.all([
        client.getAccount(account1.address()),
        client.getChainId(),
    ]);
    const rawTxn = new transaction_builder_1.TxnBuilderTypes.RawTransaction(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account1.address()), BigInt(sequnceNumber), scriptFunctionPayload, 1000n, 1n, BigInt(Math.floor(Date.now() / 1000) + 10), new transaction_builder_1.TxnBuilderTypes.ChainId(chainId));
    const bcsTxn = aptos_client_1.AptosClient.generateBCSSimulation(account1, rawTxn);
    const transactionRes = await client.submitBCSSimulation(bcsTxn);
    expect(parseInt(transactionRes.gas_used, 10) > 0);
    expect(transactionRes.success);
    const account2TestCoin = transactionRes.changes.filter((change) => {
        if (change.type !== "write_resource") {
            return false;
        }
        const write = change;
        return (write.address === account2.address().toShortString() &&
            write.data.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>" &&
            write.data.data.coin.value === "2000");
    });
    expect(account2TestCoin).toHaveLength(1);
    await checkTestCoin();
}, 30 * 1000);
test("submits multiagent transaction", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const tokenClient = new token_client_1.TokenClient(client);
    const alice = new aptos_account_1.AptosAccount();
    const bob = new aptos_account_1.AptosAccount();
    const aliceAccountAddress = transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(alice.address());
    const bobAccountAddress = transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(bob.address());
    await faucetClient.fundAccount(alice.address(), 5000);
    let resources = await client.getAccountResources(alice.address());
    let accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("5000");
    await faucetClient.fundAccount(bob.address(), 6000);
    resources = await client.getAccountResources(bob.address());
    accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::test_coin::TestCoin>");
    expect(accountResource.data.coin.value).toBe("6000");
    const collectionName = "AliceCollection";
    const tokenName = "Alice Token";
    // Create collection and token on Alice's account
    // eslint-disable-next-line quotes
    await tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev");
    await tokenClient.createToken(alice, collectionName, tokenName, 
    // eslint-disable-next-line quotes
    "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg", 0);
    let aliceBalance = await tokenClient.getTokenBalance(alice.address().hex(), collectionName, tokenName);
    expect(aliceBalance.value).toBe("1");
    const scriptFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadScriptFunction(transaction_builder_1.TxnBuilderTypes.ScriptFunction.natural("0x1::token", "direct_transfer_script", [], [
        transaction_builder_1.BCS.bcsToBytes(aliceAccountAddress),
        transaction_builder_1.BCS.bcsSerializeStr(collectionName),
        transaction_builder_1.BCS.bcsSerializeStr(tokenName),
        transaction_builder_1.BCS.bcsSerializeUint64(1),
    ]));
    const [{ sequence_number: sequnceNumber }, chainId] = await Promise.all([
        client.getAccount(alice.address()),
        client.getChainId(),
    ]);
    const rawTxn = new transaction_builder_1.TxnBuilderTypes.RawTransaction(aliceAccountAddress, BigInt(sequnceNumber), scriptFunctionPayload, 1000n, 1n, BigInt(Math.floor(Date.now() / 1000) + 10), new transaction_builder_1.TxnBuilderTypes.ChainId(chainId));
    const multiAgentTxn = new transaction_builder_1.TxnBuilderTypes.MultiAgentRawTransaction(rawTxn, [bobAccountAddress]);
    const aliceSignature = new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(alice.signBuffer(transaction_builder_1.TransactionBuilder.getSigningMessage(multiAgentTxn)).toUint8Array());
    const aliceAuthenticator = new transaction_builder_1.TxnBuilderTypes.AccountAuthenticatorEd25519(new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(alice.signingKey.publicKey), aliceSignature);
    const bobSignature = new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(bob.signBuffer(transaction_builder_1.TransactionBuilder.getSigningMessage(multiAgentTxn)).toUint8Array());
    const bobAuthenticator = new transaction_builder_1.TxnBuilderTypes.AccountAuthenticatorEd25519(new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(bob.signingKey.publicKey), bobSignature);
    const multiAgentAuthenticator = new transaction_builder_1.TxnBuilderTypes.TransactionAuthenticatorMultiAgent(aliceAuthenticator, // sender authenticator
    [bobAccountAddress], // secondary signer addresses
    [bobAuthenticator]);
    const bcsTxn = transaction_builder_1.BCS.bcsToBytes(new transaction_builder_1.TxnBuilderTypes.SignedTransaction(rawTxn, multiAgentAuthenticator));
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    const transaction = await client.transactions.getTransaction(transactionRes.hash);
    expect(transaction.data?.success).toBe(true);
    aliceBalance = await tokenClient.getTokenBalance(alice.address().hex(), collectionName, tokenName);
    expect(aliceBalance.value).toBe("0");
    const bobTokenStore = await client.getAccountResource(bob.address(), "0x1::token::TokenStore");
    const handle = bobTokenStore.data.tokens?.handle;
    const getTokenTableItemRequest = {
        key_type: "0x1::token::TokenId",
        value_type: "0x1::token::Token",
        key: {
            creator: alice.address().hex(),
            collection: collectionName,
            name: tokenName,
        },
    };
    const bobTokenTableItem = await client.getTableItem(handle, getTokenTableItemRequest);
    expect(bobTokenTableItem?.data?.value).toBe("1");
}, 30 * 1000);
//# sourceMappingURL=aptos_client.test.js.map