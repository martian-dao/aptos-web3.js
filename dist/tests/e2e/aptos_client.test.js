"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_client_1 = require("../../providers/aptos_client");
const aptos_account_1 = require("../../account/aptos_account");
const transaction_builder_1 = require("../../transaction_builder");
const plugins_1 = require("../../plugins");
const utils_1 = require("../../utils");
const test_helper_test_1 = require("../unit/test_helper.test");
const bcs_1 = require("../../bcs");
const aptos_types_1 = require("../../aptos_types");
const providers_1 = require("../../providers");
const __1 = require("../..");
const account = "0x1::account::Account";
const aptosCoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
test("node url empty", () => {
    expect(() => {
        const client = new aptos_client_1.AptosClient("");
        client.getAccount("0x1");
    }).toThrow("Node URL cannot be empty.");
});
test("gets genesis account", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const genesisAccount = await client.getAccount("0x1");
    expect(genesisAccount.authentication_key.length).toBe(66);
    expect(genesisAccount.sequence_number).not.toBeNull();
});
test("gets transactions", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const transactions = await client.getTransactions();
    expect(transactions.length).toBeGreaterThan(0);
});
test("gets genesis resources", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const resources = await client.getAccountResources("0x1");
    const accountResource = resources.find((r) => r.type === account);
    expect(accountResource).toBeDefined();
});
test("gets the Account resource", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const accountResource = await client.getAccountResource("0x1", account);
    expect(accountResource).toBeDefined();
});
test("gets ledger info", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const ledgerInfo = await client.getLedgerInfo();
    expect(ledgerInfo.chain_id).toBeGreaterThan(1);
    expect(parseInt(ledgerInfo.ledger_version, 10)).toBeGreaterThan(0);
});
test("gets account modules", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const modules = await client.getAccountModules("0x1");
    const module = modules.find((r) => r.abi.name === "aptos_coin");
    expect(module.abi.address).toBe("0x1");
});
test("gets the AptosCoin module", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const module = await client.getAccountModule("0x1", "aptos_coin");
    expect(module.abi.address).toBe("0x1");
});
test("submits bcs transaction", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const account1 = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(account1.address(), 100000000);
    let resources = await client.getAccountResources(account1.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("100000000");
    const account2 = new aptos_account_1.AptosAccount();
    const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::aptos_account", "transfer", [], [(0, bcs_1.bcsToBytes)(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account2.address())), (0, bcs_1.bcsSerializeUint64)(717)]));
    const rawTxn = await client.generateRawTransaction(account1.address(), entryFunctionPayload);
    const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(account1, rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(account2.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("717");
}, test_helper_test_1.longTestTimeout);
test("submits generic type bcs transaction", async () => {
    const provider = new providers_1.Provider(test_helper_test_1.PROVIDER_LOCAL_NETWORK_CONFIG);
    const aptosToken = new plugins_1.AptosToken(provider);
    const account1 = new aptos_account_1.AptosAccount();
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    await faucetClient.fundAccount(account1.address(), 100000000);
    let resources = await provider.getAccountResources(account1.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("100000000");
    let tokenAddress = "";
    await provider.waitForTransaction(await aptosToken.createCollection(account1, "Collection description", "Collection Name", "https://aptos.dev", 5, {
        royaltyNumerator: 10,
        royaltyDenominator: 10,
    }));
    const txn = await provider.waitForTransactionWithResult(await aptosToken.mint(account1, "Collection Name", "Token Description", "Token Name", "https://aptos.dev/img/nyan.jpeg", ["key"], ["bool"], ["true"]), { checkSuccess: true });
    tokenAddress = txn.events[0].data.token;
    const token = new transaction_builder_1.TxnBuilderTypes.TypeTagStruct(transaction_builder_1.TxnBuilderTypes.StructTag.fromString("0x4::token::Token"));
    const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x4::aptos_token", "add_typed_property", [token, new aptos_types_1.TypeTagStruct(aptos_types_1.stringStructTag)], [
        __1.BCS.bcsToBytes(aptos_types_1.AccountAddress.fromHex(tokenAddress)),
        __1.BCS.bcsSerializeStr("bcsKey"),
        __1.BCS.bcsSerializeStr("bcs value"),
    ]));
    const rawTxn = await provider.generateRawTransaction(account1.address(), entryFunctionPayload);
    const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(account1, rawTxn);
    const transactionRes = await provider.submitSignedBCSTransaction(bcsTxn);
    await provider.waitForTransaction(transactionRes.hash, { checkSuccess: true });
}, test_helper_test_1.longTestTimeout);
test("submits transaction with remote ABI", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const sender = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(sender.address(), 100000000);
    let resources = await client.getAccountResources(sender.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("100000000");
    const receiver = new aptos_account_1.AptosAccount();
    const builder = new transaction_builder_1.TransactionBuilderRemoteABI(client, { sender: sender.address() });
    const rawTxn = await builder.build("0x1::aptos_account::transfer", [], [receiver.address(), 400]);
    const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(sender, rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(receiver.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("400");
}, test_helper_test_1.longTestTimeout);
test("submits multisig transaction simulation", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
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
    await faucetClient.fundAccount(mutisigAccountAddress, 50000000);
    let resources = await client.getAccountResources(mutisigAccountAddress);
    let accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("50000000");
    const account4 = new aptos_account_1.AptosAccount();
    const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::aptos_account", "transfer", [], [(0, bcs_1.bcsToBytes)(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(account4.address())), (0, bcs_1.bcsSerializeUint64)(123)]));
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
    // simulate transaction
    const [simulateTransactionRes] = await client.simulateTransaction(multiSigPublicKey, rawTxn, {
        estimateGasUnitPrice: true,
        estimateMaxGasAmount: true,
        estimatePrioritizedGasUnitPrice: true,
    });
    expect(parseInt(simulateTransactionRes.gas_used, 10) > 0);
    expect(simulateTransactionRes.success);
    const bcsTxn = txnBuilder.sign(rawTxn);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(account4.address());
    accountResource = resources.find((r) => r.type === aptosCoin);
    expect(accountResource.data.coin.value).toBe("123");
}, test_helper_test_1.longTestTimeout);
test("submits json transaction simulation", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const account1 = new aptos_account_1.AptosAccount();
    const account2 = new aptos_account_1.AptosAccount();
    const txns1 = await faucetClient.fundAccount(account1.address(), 1000000);
    const tx1 = await client.getTransactionByHash(txns1[0]);
    expect(tx1.type).toBe("user_transaction");
    const checkAptosCoin = async () => {
        const resources1 = await client.getAccountResources(account1.address());
        const account1Resource = resources1.find((r) => r.type === aptosCoin);
        expect(account1Resource.data.coin.value).toBe("1000000");
    };
    await checkAptosCoin();
    const payload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        type_arguments: [],
        arguments: [account2.address().hex(), 100000],
    };
    const txnRequest = await client.generateTransaction(account1.address(), payload);
    [account1, new aptos_types_1.Ed25519PublicKey(account1.pubKey().toUint8Array())].forEach(async (accountOrAddress) => {
        const transactionRes = (await client.simulateTransaction(accountOrAddress, txnRequest, {
            estimateGasUnitPrice: true,
            estimateMaxGasAmount: true,
            estimatePrioritizedGasUnitPrice: true,
        }))[0];
        expect(parseInt(transactionRes.gas_used, 10) > 0);
        expect(transactionRes.success);
        const account2AptosCoin = transactionRes.changes.filter((change) => {
            if (change.type !== "write_resource") {
                return false;
            }
            const write = change;
            return (write.address === account2.address().hex() &&
                write.data.type === aptosCoin &&
                write.data.data.coin.value === "100000");
        });
        expect(account2AptosCoin).toHaveLength(1);
    });
    await checkAptosCoin();
}, test_helper_test_1.longTestTimeout);
test("submits bcs transaction simulation", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const sender = new aptos_account_1.AptosAccount();
    const receiver = new aptos_account_1.AptosAccount();
    const txns1 = await faucetClient.fundAccount(sender.address(), 100000000);
    const tx1 = await client.getTransactionByHash(txns1[0]);
    expect(tx1.type).toBe("user_transaction");
    const checkAptosCoin = async () => {
        const resources1 = await client.getAccountResources(sender.address());
        const senderResource = resources1.find((r) => r.type === aptosCoin);
        expect(senderResource.data.coin.value).toBe("100000000");
    };
    await checkAptosCoin();
    const entryFunctionPayload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::aptos_account", "transfer", [], [(0, bcs_1.bcsToBytes)(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(receiver.address())), (0, bcs_1.bcsSerializeUint64)(1000)]));
    const rawTxn = await client.generateRawTransaction(sender.address(), entryFunctionPayload);
    const bcsTxn = aptos_client_1.AptosClient.generateBCSSimulation(sender, rawTxn);
    const transactionRes = (await client.submitBCSSimulation(bcsTxn))[0];
    expect(parseInt(transactionRes.gas_used, 10) > 0);
    expect(transactionRes.success);
    const receiverAptosCoin = transactionRes.changes.filter((change) => {
        if (change.type !== "write_resource") {
            return false;
        }
        const write = change;
        return (write.address === receiver.address().toShortString() &&
            write.data.type === aptosCoin &&
            write.data.data.coin.value === "1000");
    });
    expect(receiverAptosCoin).toHaveLength(1);
    await checkAptosCoin();
}, test_helper_test_1.longTestTimeout);
test("submits multiagent transaction", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const tokenClient = new plugins_1.TokenClient(client);
    const alice = new aptos_account_1.AptosAccount();
    const bob = new aptos_account_1.AptosAccount();
    // Fund both Alice's and Bob's Account
    await faucetClient.fundAccount(alice.address(), 100000000);
    await faucetClient.fundAccount(bob.address(), 100000000);
    const collectionName = "AliceCollection";
    const tokenName = "Alice Token";
    async function ensureTxnSuccess(txnHashPromise) {
        const txnHash = await txnHashPromise;
        const txn = await client.waitForTransactionWithResult(txnHash);
        expect(txn?.success).toBe(true);
    }
    // Create collection and token on Alice's account
    await ensureTxnSuccess(tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev"));
    await ensureTxnSuccess(tokenClient.createToken(alice, collectionName, tokenName, "Alice's simple token", 1, "https://aptos.dev/img/nyan.jpeg", 1000, alice.address(), 0, 0, ["key"], ["2"], ["u64"]));
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
    let aliceBalance = await tokenClient.getTokenForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("1");
    const txnHash = await tokenClient.directTransferToken(alice, bob, alice.address(), collectionName, tokenName, 1, propertyVersion);
    await client.waitForTransaction(txnHash, { checkSuccess: true });
    aliceBalance = await tokenClient.getTokenForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("0");
    const bobBalance = await tokenClient.getTokenForAccount(bob.address().hex(), tokenId);
    expect(bobBalance.amount).toBe("1");
}, test_helper_test_1.longTestTimeout);
/*
TODO(xinding): Skip test for now, as it's blocking CI
test(
  "submits multiagent transaction with fee payer",
  async () => {
    const client = new AptosClient(NODE_URL);
    const faucetClient = getFaucetClient();
    const tokenClient = new TokenClient(client);

    const alice = new AptosAccount();
    const bob = new AptosAccount();

    // Fund both Alice's and Bob's Account
    await faucetClient.fundAccount(alice.address(), 100000000);
    await faucetClient.fundAccount(bob.address(), 100000000);

    const collectionName = "AliceCollection";
    const tokenName = "Alice Token";

    async function ensureTxnSuccess(txnHashPromise: Promise<string>) {
      const txnHash = await txnHashPromise;
      const txn = await client.waitForTransactionWithResult(txnHash);
      expect((txn as any)?.success).toBe(true);
    }

    // Create collection and token on Alice's account
    await ensureTxnSuccess(
      tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev"),
    );

    await ensureTxnSuccess(
      tokenClient.createToken(
        alice,
        collectionName,
        tokenName,
        "Alice's simple token",
        1,
        "https://aptos.dev/img/nyan.jpeg",
        1000,
        alice.address(),
        0,
        0,
        ["key"],
        ["2"],
        ["u64"],
      ),
    );

    const propertyVersion = 0;
    const tokenId = {
      token_data_id: {
        creator: alice.address().hex(),
        collection: collectionName,
        name: tokenName,
      },
      property_version: `${propertyVersion}`,
    };

    // Transfer Token from Alice's Account to Bob's Account with bob paying the fee
    await tokenClient.getCollectionData(alice.address().hex(), collectionName);
    let aliceBalance = await tokenClient.getTokenForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("1");

    const getBalance = async (account: AptosAccount) => {
      const resources = await client.getAccountResources(account.address().hex());
      let accountResource = resources.find((r) => r.type === aptosCoin);
      return BigInt((accountResource!.data as any).coin.value);
    };

    const aliceBefore = await getBalance(alice);
    const bobBefore = await getBalance(bob);

    const txnHash = await tokenClient.directTransferTokenWithFeePayer(
      alice,
      bob,
      alice.address(),
      collectionName,
      tokenName,
      1,
      bob,
      propertyVersion,
      undefined,
    );

    await client.waitForTransaction(txnHash, { checkSuccess: true });

    aliceBalance = await tokenClient.getTokenForAccount(alice.address().hex(), tokenId);
    expect(aliceBalance.amount).toBe("0");

    const bobBalance = await tokenClient.getTokenForAccount(bob.address().hex(), tokenId);
    expect(bobBalance.amount).toBe("1");

    // Check that Alice did not pay the fee
    expect(await getBalance(alice)).toBe(aliceBefore);
    // Check that Bob paid the fee
    expect(await getBalance(bob)).toBeLessThan(bobBefore);
  },
  longTestTimeout,
);
 */
test("publishes a package", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const account1 = new aptos_account_1.AptosAccount(new utils_1.HexString("0x883fdd67576e5fdceb370ba665b8af8856d0cae63fd808b8d16077c6b008ea8c").toUint8Array());
    await faucetClient.fundAccount(account1.address(), 100000000);
    const txnHash = await client.publishPackage(account1, new utils_1.HexString(
    // eslint-disable-next-line max-len
    "084578616d706c657301000000000000000040314137344146383742383132393043323533323938383036373846304137444637393737373637383734334431434345443230413446354345334238464446388f011f8b08000000000002ff3dccc10ac2300c06e07b9ea2f46ee70b78f0a02f31c6886d74a55d5b1a51417c7713c1915c927cf9c7863ee18d2628b89239187b7ae1da32b18507758eb5e872efa42cc088217462269e60a19ceb7cc9d527bf60fcb9594da0462550f151d9b1dd2b9fbba43f6b4f82de465e302b776e90befe8f03aadd6db3351ff802f2294cdfa100000001076d6573736167658f051f8b08000000000002ff95555d6bdb30147dcfafb8ed20d8c52c1d8c3194a6ec83b0be747be8dec6108a7d9d983a5226c94dc3f07f9f2cd98e6cc769e787884857e79e73bfb4154991236c30cf055de5227e8c372ce3846c5129b646f83b01f3150a41e984109452c879774f656b8e834d2d33be3e6eb29d168aa6926d712fe423212c8e45c175dfc27979c2ea64329b910b722b518942c6682d0d6e116bb877f4ee449ea0840d53f088879a6cf5d5f409381e843cd835ea1b5023979bc57a5404ec4ac8b25aee184f72bca95d7db586f6e0d6c19486df8d21d8f23b41d0bb65592652ec226323247a6c5329b6f445ca5a9cb7291d81d96c063f37681c640ab86894c2cef03434ac4d2cb8d2b0fcfe83de2f1f1e3e7f5b12283ebc87055ccf1dc8ae58e5590c69c1618dbaf11bb0249104aa5fb311f669008bff149939eaa5e728942985525f04f89c29ad6e3a66b7163d8cc0d618215c689a9a1249028f6718ce5bb0abe94a18d33d5de762c5f293686f6be67e806a6d2616f260152a5fa12b4b23cd5675345649a1857a51708e1a6a485a11322176c0a6015c14a94883696de289cb52082e46c2e4e185a1e7ccd6b57842aa450b198d52eb75423476d06f91264284e3de6dd2cd68a71ca575f1cbb0fd5b02e60a7bc4aab819c24d5ae8c6b15f4027e5745be8b3d1990f40fd56337057d3a197a666ba97ebc980db4c3bd5c1d47887f1ebddb845a726c230193ebd6146fc09108bdde174eeca9eec718a260003ada5df2a6f7e6954ba89a931ff74fdfc2efc3dd646dc60d398717aa6a3c25736cdff34cbd8e342482c9169a44d51a44252a7a85b1d27f846d0767ca1d38fc1eaf2ae7a2423f8d2be9297d5341acc362ff6fdd119c262f10a543f9ddeec6b776be2e5a49cfc0325c63f11c007000000000300000000000000000000000000000000000000000000000000000000000000010e4170746f734672616d65776f726b00000000000000000000000000000000000000000000000000000000000000010b4170746f735374646c696200000000000000000000000000000000000000000000000000000000000000010a4d6f76655374646c696200").toUint8Array(), [
        new transaction_builder_1.TxnBuilderTypes.Module(new utils_1.HexString(
        // eslint-disable-next-line max-len
        "a11ceb0b050000000c01000c020c12031e20043e04054228076ad50108bf024006ff020a108903450ace03150ce3035f0dc20404000001010102010301040105000606000007080005080700030e040106010009000100000a020300020f0404000410060000011106080106031209030106040705070105010802020c08020001030305080207080101060c010800010b0301090002070b030109000900076d657373616765076163636f756e74056572726f72056576656e74067369676e657206737472696e67124d6573736167654368616e67654576656e740d4d657373616765486f6c64657206537472696e670b6765745f6d6573736167650b7365745f6d6573736167650c66726f6d5f6d6573736167650a746f5f6d657373616765156d6573736167655f6368616e67655f6576656e74730b4576656e7448616e646c65096e6f745f666f756e640a616464726573735f6f66106e65775f6576656e745f68616e646c650a656d69745f6576656e746766284c3984add58e00d20ba272a40d33d5b4ea33c08a904254e28fdff97b9f000000000000000000000000000000000000000000000000000000000000000103080000000000000000126170746f733a3a6d657461646174615f7630310100000000000000000b454e4f5f4d4553534147451b5468657265206973206e6f206d6573736167652070726573656e740002020b08020c08020102020008020d0b030108000001000101030b0a002901030607001102270b002b0110001402010104010105210e0011030c020a022901200308050f0e000b010e00380012012d0105200b022a010c040a041000140c030a040f010b030a01120038010b010b040f0015020100010100").toUint8Array()),
    ]);
    await client.waitForTransaction(txnHash);
    const txn = await client.getTransactionByHash(txnHash);
    expect(txn.success).toBeTruthy();
}, test_helper_test_1.longTestTimeout);
test("rotates auth key ed25519", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const alice = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(alice.address(), 100000000);
    const helperAccount = new aptos_account_1.AptosAccount();
    const pendingTxn = await client.rotateAuthKeyEd25519(alice, helperAccount.signingKey.secretKey);
    await client.waitForTransaction(pendingTxn.hash);
    const origAddressHex = await client.lookupOriginalAddress(helperAccount.address());
    // Sometimes the returned addresses do not have leading 0s. To be safe, converting hex addresses to AccountAddress
    const origAddress = transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(origAddressHex);
    const aliceAddress = transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(alice.address());
    expect(utils_1.HexString.fromUint8Array((0, bcs_1.bcsToBytes)(origAddress)).hex()).toBe(utils_1.HexString.fromUint8Array((0, bcs_1.bcsToBytes)(aliceAddress)).hex());
}, test_helper_test_1.longTestTimeout);
test("gets block by height", async () => {
    const blockHeight = 100;
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const block = await client.getBlockByHeight(blockHeight);
    expect(block.block_height).toBe(blockHeight.toString());
}, test_helper_test_1.longTestTimeout);
test("gets block by version", async () => {
    const version = 100;
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const block = await client.getBlockByVersion(version);
    expect(parseInt(block.first_version, 10)).toBeLessThanOrEqual(version);
    expect(parseInt(block.last_version, 10)).toBeGreaterThanOrEqual(version);
}, test_helper_test_1.longTestTimeout);
test("estimates max gas amount", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const alice = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(alice.address(), 10000000);
    const maxGasAmount = await client.estimateMaxGasAmount(alice.address());
    expect(maxGasAmount).toBeGreaterThan(BigInt(0));
}, test_helper_test_1.longTestTimeout);
test("view function", async () => {
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const alice = new aptos_account_1.AptosAccount();
    await faucetClient.fundAccount(alice.address(), 100000000);
    const payload = {
        function: "0x1::coin::balance",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [alice.address().hex()],
    };
    const balance = await client.view(payload);
    expect(balance[0]).toBe("100000000");
}, test_helper_test_1.longTestTimeout);
test("view function with a struct return type", async () => {
    // This test is just to show that the view function supports a struct return type.
    // We test against get_collection_mutability_config although
    // b/c at the time of writing this is the only view function on the move side
    // that can easily test a struct return type.
    const client = new aptos_client_1.AptosClient(test_helper_test_1.NODE_URL);
    const faucetClient = (0, test_helper_test_1.getFaucetClient)();
    const tokenClient = new plugins_1.TokenClient(client);
    const alice = new aptos_account_1.AptosAccount();
    // Fund Alice's Account
    await faucetClient.fundAccount(alice.address(), 100000000);
    const collectionName = "AliceCollection";
    // Create collection on Alice's account
    await client.waitForTransaction(await tokenClient.createCollection(alice, collectionName, "Alice's simple collection", "https://aptos.dev"), { checkSuccess: true });
    const payload = {
        function: "0x3::token::get_collection_mutability_config",
        type_arguments: [],
        arguments: [alice.address().hex(), collectionName],
    };
    const collection = await client.view(payload);
    expect(collection[0]).toMatchObject({ description: false, maximum: false, uri: false });
}, test_helper_test_1.longTestTimeout);
//# sourceMappingURL=aptos_client.test.js.map