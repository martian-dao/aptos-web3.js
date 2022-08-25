"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_client_1 = require("./aptos_client");
const util_test_1 = require("./util.test");
const faucet_client_1 = require("./faucet_client");
const aptos_account_1 = require("./aptos_account");
const transaction_builder_1 = require("./transaction_builder");
const token_client_1 = require("./token_client");
const account = "0x1::account::Account";
const aptosCoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
const coinTransferFunction = "0x1::coin::transfer";
test("node url empty", () => {
    expect(() => {
        const client = new aptos_client_1.AptosClient("");
        client.getAccount("0x1");
    }).toThrow("Node URL cannot be empty.");
});
test("gets genesis account", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const genesisAccount = await client.getAccount("0x1");
    expect(genesisAccount.authentication_key.length).toBe(66);
    expect(genesisAccount.sequence_number).not.toBeNull();
});
test("gets transactions", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const transactions = await client.getTransactions();
    expect(transactions.length).toBeGreaterThan(0);
});
test("gets genesis resources", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const resources = await client.getAccountResources("0x1");
    const accountResource = resources.find((r) => r.type === account);
    expect(accountResource).toBeDefined();
});
test("gets the Account resource", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const accountResource = await client.getAccountResource("0x1", account);
    expect(accountResource).toBeDefined();
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
    const module = modules.find((r) => r.abi.name === "aptos_coin");
    expect(module.abi.address).toBe("0x1");
});
test("gets the AptosCoin module", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const module = await client.getAccountModule("0x1", "aptos_coin");
    expect(module.abi.address).toBe("0x1");
});
test("submits bcs transaction", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const account1 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account1.address(), 50000);
    let resources = await client.getAccountResources(account1.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("50000");
    const account2 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account2.address(), 0);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("0");
    const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"));
    const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::coin", "transfer", [token], [transaction_builder_1.BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account2.address())), transaction_builder_1.BCS.bcsSerializeUint64(717)]));
    const rawTxn = await client.generateRawTransaction(account1.address(), entryFunctionPayload);
    const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(account1, rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("717");
}, 30 * 1000);
test("submits transaction with remote ABI", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const account1 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account1.address(), 50000);
    let resources = await client.getAccountResources(account1.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("50000");
    const account2 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account2.address(), 0);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("0");
    const builder = new transaction_builder_1.TransactionBuilderRemoteABI(client, { sender: account1.address() });
    const rawTxn = await builder.build("0x1::coin::transfer", ["0x1::aptos_coin::AptosCoin"], [account2.address(), 400]);
    const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(account1, rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("400");
}, 30 * 1000);
test("submits multisig transaction", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
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
    await faucetClient.fundAccount(mutisigAccountAddress, 5000000);
    let resources = await client.getAccountResources(mutisigAccountAddress);
    let accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("5000000");
    const account4 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account4.address(), 0);
    resources = await client.getAccountResources(account4.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("0");
    const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"));
    const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::coin", "transfer", [token], [transaction_builder_1.BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account4.address())), transaction_builder_1.BCS.bcsSerializeUint64(123)]));
    const rawTxn = await client.generateRawTransaction(mutisigAccountAddress, entryFunctionPayload);
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
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("123");
}, 30 * 1000);
test("submits json transaction simulation", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const account1 = new aptos_account_1.AptosAccount();
    const account2 = new aptos_account_1.AptosAccount();
    const txns1 = await faucetClient.fundAccount(account1.address(), 1000000);
    const txns2 = await faucetClient.fundAccount(account2.address(), 1000000);
    const tx1 = await client.getTransactionByHash(txns1[1]);
    const tx2 = await client.getTransactionByHash(txns2[1]);
    expect(tx1.type).toBe("user_transaction");
    expect(tx2.type).toBe("user_transaction");
    const checkAptosCoin = async () => {
        const resources1 = await client.getAccountResources(account1.address());
        const resources2 = await client.getAccountResources(account2.address());
        const account1Resource = resources1.find((r) => r.type === aptosCoin);
        const account2Resource = resources2.find((r) => r.type === aptosCoin);
        expect(account1Resource.data.coin.value).toBe("1000000");
        expect(account2Resource.data.coin.value).toBe("1000000");
    };
    await checkAptosCoin();
    const payload = {
        type: "entry_function_payload",
        function: coinTransferFunction,
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [account2.address().hex(), "100000"],
    };
    const txnRequest = await client.generateTransaction(account1.address(), payload);
    const transactionRes = (await client.simulateTransaction(account1, txnRequest))[0];
    expect(parseInt(transactionRes.gas_used, 10) > 0);
    expect(transactionRes.success);
    const account2AptosCoin = transactionRes.changes.filter((change) => {
        if (change.type !== "write_resource") {
            return false;
        }
        const write = change;
        return (write.address === account2.address().hex() &&
            write.data.type === aptosCoin &&
            write.data.data.coin.value === "1100000");
    });
    expect(account2AptosCoin).toHaveLength(1);
    await checkAptosCoin();
}, 30 * 1000);
test("submits bcs transaction simulation", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const account1 = new aptos_account_1.AptosAccount();
    const account2 = new aptos_account_1.AptosAccount();
    const txns1 = await faucetClient.fundAccount(account1.address(), 50000);
    const txns2 = await faucetClient.fundAccount(account2.address(), 10000);
    const tx1 = await client.getTransactionByHash(txns1[1]);
    const tx2 = await client.getTransactionByHash(txns2[1]);
    expect(tx1.type).toBe("user_transaction");
    expect(tx2.type).toBe("user_transaction");
    const checkAptosCoin = async () => {
        const resources1 = await client.getAccountResources(account1.address());
        const resources2 = await client.getAccountResources(account2.address());
        const account1Resource = resources1.find((r) => r.type === aptosCoin);
        const account2Resource = resources2.find((r) => r.type === aptosCoin);
        expect(account1Resource.data.coin.value).toBe("50000");
        expect(account2Resource.data.coin.value).toBe("10000");
    };
    await checkAptosCoin();
    const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"));
    const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::coin", "transfer", [token], [transaction_builder_1.BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account2.address())), transaction_builder_1.BCS.bcsSerializeUint64(1000)]));
    const rawTxn = await client.generateRawTransaction(account1.address(), entryFunctionPayload);
    const bcsTxn = aptos_client_1.AptosClient.generateBCSSimulation(account1, rawTxn);
    const transactionRes = (await client.submitBCSSimulation(bcsTxn))[0];
    expect(parseInt(transactionRes.gas_used, 10) > 0);
    expect(transactionRes.success);
    const account2AptosCoin = transactionRes.changes.filter((change) => {
        if (change.type !== "write_resource") {
            return false;
        }
        const write = change;
        return (write.address === account2.address().toShortString() &&
            write.data.type === aptosCoin &&
            write.data.data.coin.value === "11000");
    });
    expect(account2AptosCoin).toHaveLength(1);
    await checkAptosCoin();
}, 30 * 1000);
test("submits multiagent transaction", async () => {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const faucetClient = new faucet_client_1.FaucetClient(util_test_1.NODE_URL, util_test_1.FAUCET_URL);
    const tokenClient = new token_client_1.TokenClient(client);
    const alice = new aptos_account_1.AptosAccount();
    const bob = new aptos_account_1.AptosAccount();
    // Fund both Alice's and Bob's Account
    await faucetClient.fundAccount(alice.address(), 10000000);
    await faucetClient.fundAccount(bob.address(), 10000000);
    const collectionName = "AliceCollection";
    const tokenName = "Alice Token";
    async function ensureTxnSuccess(txnHashPromise) {
        const txnHash = await txnHashPromise;
        const txn = await client.waitForTransactionWithResult(txnHash);
        expect(txn?.success).toBe(true);
    }
    // Create collection and token on Alice's account
    await ensureTxnSuccess(tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev"));
    await ensureTxnSuccess(tokenClient.createToken(alice, collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg", 1234, alice.address(), 0, 0, ["key"], ["2"], ["int"]));
    const propertyVersion = 0;
    const tokenId = {
        token_data_id: {
            creator: alice.address().hex(),
            collection: collectionName,
            name: tokenName,
        },
        property_version: `${propertyVersion}`,
    };
    // Transfer Token from Alice's Account to Bob's Account
    await tokenClient.getCollectionData(alice.address().hex(), collectionName);
    let aliceBalance = await tokenClient.getTokenBalanceForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("1");
    const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x3::token", "direct_transfer_script", [], [
        transaction_builder_1.BCS.bcsToBytes(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(alice.address())),
        transaction_builder_1.BCS.bcsSerializeStr(collectionName),
        transaction_builder_1.BCS.bcsSerializeStr(tokenName),
        transaction_builder_1.BCS.bcsSerializeUint64(propertyVersion),
        transaction_builder_1.BCS.bcsSerializeUint64(1),
    ]));
    const rawTxn = await client.generateRawTransaction(alice.address(), entryFunctionPayload);
    const multiAgentTxn = new transaction_builder_1.TxnBuilderTypes.MultiAgentRawTransaction(rawTxn, [
        transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(bob.address()),
    ]);
    const aliceSignature = new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(alice.signBuffer(transaction_builder_1.TransactionBuilder.getSigningMessage(multiAgentTxn)).toUint8Array());
    const aliceAuthenticator = new transaction_builder_1.TxnBuilderTypes.AccountAuthenticatorEd25519(new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(alice.signingKey.publicKey), aliceSignature);
    const bobSignature = new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(bob.signBuffer(transaction_builder_1.TransactionBuilder.getSigningMessage(multiAgentTxn)).toUint8Array());
    const bobAuthenticator = new transaction_builder_1.TxnBuilderTypes.AccountAuthenticatorEd25519(new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(bob.signingKey.publicKey), bobSignature);
    const multiAgentAuthenticator = new transaction_builder_1.TxnBuilderTypes.TransactionAuthenticatorMultiAgent(aliceAuthenticator, // sender authenticator
    [transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(bob.address())], // secondary signer addresses
    [bobAuthenticator]);
    const bcsTxn = transaction_builder_1.BCS.bcsToBytes(new transaction_builder_1.TxnBuilderTypes.SignedTransaction(rawTxn, multiAgentAuthenticator));
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    const transaction = await client.getTransactionByHash(transactionRes.hash);
    expect(transaction?.success).toBe(true);
    aliceBalance = await tokenClient.getTokenBalanceForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("0");
    const bobBalance = await tokenClient.getTokenBalanceForAccount(bob.address().hex(), tokenId);
    expect(bobBalance.amount).toBe("1");
}, 30 * 1000);
//# sourceMappingURL=aptos_client.test.js.map