"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailedTransactionError = exports.WaitForTransactionError = exports.ApiError = exports.AptosClient = void 0;
const hex_string_1 = require("./hex_string");
const utils_1 = require("./utils");
const aptos_account_1 = require("./aptos_account");
const Gen = __importStar(require("./generated/index"));
const transaction_builder_1 = require("./transaction_builder");
const bcs_1 = require("./bcs");
/**
 * Provides methods for retrieving data from Aptos node.
 * For more detailed API specification see {@link https://fullnode.devnet.aptoslabs.com/v1/spec}
 */
class AptosClient {
    /**
     * Build a client configured to connect to an Aptos node at the given URL.
     *
     * Note: If you forget to append `/v1` to the URL, the client constructor
     * will automatically append it. If you don't want this URL processing to
     * take place, set doNotFixNodeUrl to true.
     *
     * @param nodeUrl URL of the Aptos Node API endpoint.
     * @param config Additional configuration options for the generated Axios client.
     */
    constructor(nodeUrl, config, doNotFixNodeUrl = false) {
        if (!nodeUrl) {
            throw new Error("Node URL cannot be empty.");
        }
        const conf = config === undefined || config === null ? {} : { ...config };
        if (doNotFixNodeUrl) {
            conf.BASE = nodeUrl;
        }
        else {
            conf.BASE = (0, utils_1.fixNodeUrl)(nodeUrl);
        }
        // Do not carry cookies when `WITH_CREDENTIALS` is explicitly set to `false`. By default, cookies will be sent
        if (config?.WITH_CREDENTIALS === false) {
            conf.WITH_CREDENTIALS = false;
        }
        else {
            conf.WITH_CREDENTIALS = true;
        }
        this.nodeUrl = conf.BASE;
        this.client = new Gen.AptosGeneratedClient(conf);
    }
    /**
     * Queries an Aptos account by address
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @returns Core account resource, used for identifying account and transaction execution
     * @example An example of the returned account
     * ```
     * {
     *    sequence_number: "1",
     *    authentication_key: "0x5307b5f4bc67829097a8ba9b43dba3b88261eeccd1f709d9bde240fc100fbb69"
     * }
     * ```
     */
    async getAccount(accountAddress) {
        return this.client.accounts.getAccount(hex_string_1.HexString.ensure(accountAddress).hex());
    }
    /**
     * Queries transactions sent by given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query Optional pagination object
     * @param query.start The start transaction version of the page. Default is the latest ledger version
     * @param query.limit The max number of transactions should be returned for the page. Default is 25.
     * @returns An array of on-chain transactions, sent by account
     */
    async getAccountTransactions(accountAddress, query) {
        return this.client.transactions.getAccountTransactions(hex_string_1.HexString.ensure(accountAddress).hex(), query?.start?.toString(), query?.limit);
    }
    /**
     * Queries modules associated with given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account modules array for a specific ledger version.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which is JSON representation of a module
     */
    async getAccountModules(accountAddress, query) {
        return this.client.accounts.getAccountModules(hex_string_1.HexString.ensure(accountAddress).hex(), query?.ledgerVersion?.toString());
    }
    /**
     * Queries module associated with given account by module name
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param moduleName The name of the module
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Specified module.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which JSON representation of a module
     */
    async getAccountModule(accountAddress, moduleName, query) {
        return this.client.accounts.getAccountModule(hex_string_1.HexString.ensure(accountAddress).hex(), moduleName, query?.ledgerVersion?.toString());
    }
    /**
     * Queries all resources associated with given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resources for a specific ledger version
     */
    async getAccountResources(accountAddress, query) {
        return this.client.accounts.getAccountResources(hex_string_1.HexString.ensure(accountAddress).hex(), query?.ledgerVersion?.toString());
    }
    /**
     * Queries resource associated with given account by resource type
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param resourceType String representation of an on-chain Move struct type
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resource of specified type and ledger version
     * @example An example of an account resource
     * ```
     * {
     *    type: "0x1::AptosAccount::Coin",
     *    data: { value: 6 }
     * }
     * ```
     */
    async getAccountResource(accountAddress, resourceType, query) {
        return this.client.accounts.getAccountResource(hex_string_1.HexString.ensure(accountAddress).hex(), resourceType, query?.ledgerVersion?.toString());
    }
    /** Generates a signed transaction that can be submitted to the chain for execution. */
    static generateBCSTransaction(accountFrom, rawTxn) {
        const txnBuilder = new transaction_builder_1.TransactionBuilderEd25519((signingMessage) => {
            // @ts-ignore
            const sigHexStr = accountFrom.signBuffer(signingMessage);
            return new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(sigHexStr.toUint8Array());
        }, accountFrom.pubKey().toUint8Array());
        return txnBuilder.sign(rawTxn);
    }
    /**
     * Note: Unless you have a specific reason for using this, it'll probably be simpler
     * to use `simulateTransaction`.
     *
     * Generates a BCS transaction that can be submitted to the chain for simulation.
     *
     * @param accountFrom The account that will be used to send the transaction
     * for simulation.
     * @param rawTxn The raw transaction to be simulated, likely created by calling
     * the `generateTransaction` function.
     * @returns The BCS encoded signed transaction, which you should then pass into
     * the `submitBCSSimulation` function.
     */
    static generateBCSSimulation(accountFrom, rawTxn) {
        const txnBuilder = new transaction_builder_1.TransactionBuilderEd25519(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_signingMessage) => {
            // @ts-ignore
            const invalidSigBytes = new Uint8Array(64);
            return new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(invalidSigBytes);
        }, accountFrom.pubKey().toUint8Array());
        return txnBuilder.sign(rawTxn);
    }
    /** Generates a transaction request that can be submitted to produce a raw transaction that
     * can be signed, which upon being signed can be submitted to the blockchain
     * @param sender Hex-encoded 32 byte Aptos account address of transaction sender
     * @param payload Transaction payload. It depends on transaction type you want to send
     * @param options Options allow to overwrite default transaction options.
     * @returns A transaction object
     */
    async generateTransaction(sender, payload, options) {
        const config = { sender };
        // for multisig transaction
        if (options?.sender) {
            config.sender = options.sender;
        }
        if (options?.sequence_number) {
            config.sequenceNumber = options.sequence_number;
        }
        if (options?.gas_unit_price) {
            config.gasUnitPrice = options.gas_unit_price;
        }
        if (options?.max_gas_amount) {
            config.maxGasAmount = options.max_gas_amount;
        }
        if (options?.expiration_timestamp_secs) {
            const timestamp = BigInt(parseInt(options.expiration_timestamp_secs, 10));
            config.expTimestampSec = timestamp;
            config.expSecFromNow = 0;
        }
        const builder = new transaction_builder_1.TransactionBuilderRemoteABI(this, config);
        return builder.build(payload.function, payload.type_arguments, payload.arguments);
    }
    /** Converts a transaction request produced by `generateTransaction` into a properly
     * signed transaction, which can then be submitted to the blockchain
     * @param accountFrom AptosAccount of transaction sender
     * @param rawTransaction A raw transaction generated by `generateTransaction` method
     * @returns A transaction, signed with sender account
     */
    // eslint-disable-next-line class-methods-use-this
    async signTransaction(accountFrom, rawTransaction) {
        return Promise.resolve(AptosClient.generateBCSTransaction(accountFrom, rawTransaction));
    }
    /**
     * @deprecated Use `getEventsByCreationNumber` instead. This will be removed in the next release.
     *
     * Queries events by event key
     * @param eventKey Event key for an event stream. It is BCS serialized bytes
     * of `guid` field in the Move struct `EventHandle`
     * @returns Array of events assotiated with given key
     */
    async getEventsByEventKey(eventKey) {
        return this.client.events.getEventsByEventKey(eventKey);
    }
    /**
     * Event types are globally identifiable by an account `address` and
     * monotonically increasing `creation_number`, one per event type emitted
     * to the given account. This API returns events corresponding to that
     * that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix,
     * for which events are queried. This refers to the account that events were emitted
     * to, not the account hosting the move module that emits that event type.
     * @param creationNumber Creation number corresponding to the event type.
     * @returns Array of events assotiated with the given account and creation number.
     */
    async getEventsByCreationNumber(address, creationNumber, query) {
        return this.client.events.getEventsByCreationNumber(hex_string_1.HexString.ensure(address).hex(), creationNumber.toString(), query?.start?.toString(), query?.limit);
    }
    /**
     * This API uses the given account `address`, `eventHandle`, and `fieldName`
     * to build a key that can globally identify an event types. It then uses this
     * key to return events emitted to the given account matching that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix,
     * for which events are queried. This refers to the account that events were emitted
     * to, not the account hosting the move module that emits that event type.
     * @param eventHandleStruct String representation of an on-chain Move struct type.
     * (e.g. `0x1::Coin::CoinStore<0x1::aptos_coin::AptosCoin>`)
     * @param fieldName The field name of the EventHandle in the struct
     * @param query Optional query object
     * @param query.start The start sequence number in the EVENT STREAM, defaulting to the latest event.
     * The events are returned in the reverse order of sequence number
     * @param query.limit The number of events to be returned for the page default is 5
     * @returns Array of events
     */
    async getEventsByEventHandle(address, eventHandleStruct, fieldName, query) {
        return this.client.events.getEventsByEventHandle(hex_string_1.HexString.ensure(address).hex(), eventHandleStruct, fieldName, query?.start?.toString(), query?.limit);
    }
    /**
     * Submits a signed transaction to the transaction endpoint.
     * @param signedTxn A transaction, signed by `signTransaction` method
     * @returns Transaction that is accepted and submitted to mempool
     */
    async submitTransaction(signedTxn) {
        return this.submitSignedBCSTransaction(signedTxn);
    }
    /**
     * Generates and submits a transaction to the transaction simulation
     * endpoint. For this we generate a transaction with a fake signature.
     *
     * @param accountFrom The account that will be used to send the transaction
     * for simulation.
     * @param rawTransaction The raw transaction to be simulated, likely created
     * by calling the `generateTransaction` function.
     * @param query.estimateGasUnitPrice If set to true, the gas unit price in the
     * transaction will be ignored and the estimated value will be used.
     * @param query.estimateMaxGasAmount If set to true, the max gas value in the
     * transaction will be ignored and the maximum possible gas will be used.
     * @returns The BCS encoded signed transaction, which you should then provide
     *
     */
    async simulateTransaction(accountFrom, rawTransaction, query) {
        const signedTxn = AptosClient.generateBCSSimulation(accountFrom, rawTransaction);
        return this.submitBCSSimulation(signedTxn, query);
    }
    /**
     * Submits a signed transaction to the endpoint that takes BCS payload
     *
     * @param signedTxn A BCS transaction representation
     * @returns Transaction that is accepted and submitted to mempool
     */
    async submitSignedBCSTransaction(signedTxn) {
        // Need to construct a customized post request for transactions in BCS payload
        return this.client.request.request({
            url: "/transactions",
            method: "POST",
            body: signedTxn,
            mediaType: "application/x.aptos.signed_transaction+bcs",
        });
    }
    /**
     * Submits the BCS serialization of a signed transaction to the simulation endpoint.
     *
     * @param bcsBody The output of `generateBCSSimulation`.
     * @param query?.estimateGasUnitPrice If set to true, the gas unit price in the
     * transaction will be ignored and the estimated value will be used.
     * @param query?.estimateMaxGasAmount If set to true, the max gas value in the
     * transaction will be ignored and the maximum possible gas will be used.
     * @returns Simulation result in the form of UserTransaction.
     */
    async submitBCSSimulation(bcsBody, query) {
        // Need to construct a customized post request for transactions in BCS payload.
        const queryParams = {
            estimate_gas_unit_price: query?.estimateGasUnitPrice ?? false,
            estimate_max_gas_amount: query?.estimateMaxGasAmount ?? false,
        };
        return this.client.request.request({
            url: "/transactions/simulate",
            query: queryParams,
            method: "POST",
            body: bcsBody,
            mediaType: "application/x.aptos.signed_transaction+bcs",
        });
    }
    /**
     * Queries on-chain transactions
     * @param query Optional pagination object
     * @param query.start The start transaction version of the page. Default is the latest ledger version
     * @param query.limit The max number of transactions should be returned for the page. Default is 25
     * @returns Array of on-chain transactions
     */
    async getTransactions(query) {
        return this.client.transactions.getTransactions(query?.start?.toString(), query?.limit);
    }
    /**
     * @param txnHash - Transaction hash should be hex-encoded bytes string with 0x prefix.
     * @returns Transaction from mempool or on-chain transaction
     */
    async getTransactionByHash(txnHash) {
        return this.client.transactions.getTransactionByHash(txnHash);
    }
    /**
     * @param txnVersion - Transaction version is an uint64 number.
     * @returns Transaction from mempool or on-chain transaction
     */
    async getTransactionByVersion(txnVersion) {
        return this.client.transactions.getTransactionByVersion(txnVersion.toString());
    }
    /**
     * Defines if specified transaction is currently in pending state
     * @param txnHash A hash of transaction
     *
     * To create a transaction hash:
     *
     * 1. Create hash message bytes: "Aptos::Transaction" bytes + BCS bytes of Transaction.
     * 2. Apply hash algorithm SHA3-256 to the hash message bytes.
     * 3. Hex-encode the hash bytes with 0x prefix.
     *
     * @returns `true` if transaction is in pending state and `false` otherwise
     */
    async transactionPending(txnHash) {
        try {
            const response = await this.client.transactions.getTransactionByHash(txnHash);
            return response.type === "pending_transaction";
        }
        catch (e) {
            if (e?.status === 404) {
                return true;
            }
            throw e;
        }
    }
    /**
     * Wait for a transaction to move past pending state.
     *
     * There are 4 possible outcomes:
     * 1. Transaction is processed and successfully committed to the blockchain.
     * 2. Transaction is rejected for some reason, and is therefore not committed
     *    to the blockchain.
     * 3. Transaction is committed but execution failed, meaning no changes were
     *    written to the blockchain state.
     * 4. Transaction is not processed within the specified timeout.
     *
     * In case 1, this function resolves with the transaction response returned
     * by the API.
     *
     * In case 2, the function will throw an ApiError, likely with an HTTP status
     * code indicating some problem with the request (e.g. 400).
     *
     * In case 3, if `checkSuccess` is false (the default), this function returns
     * the transaction response just like in case 1, in which the `success` field
     * will be false. If `checkSuccess` is true, it will instead throw a
     * FailedTransactionError.
     *
     * In case 4, this function throws a WaitForTransactionError.
     *
     * @param txnHash The hash of a transaction previously submitted to the blockchain.
     * @param extraArgs.timeoutSecs Timeout in seconds. Defaults to 20 seconds.
     * @param extraArgs.checkSuccess See above. Defaults to false.
     * @returns See above.
     *
     * @example
     * ```
     * const rawTransaction = await this.generateRawTransaction(sender.address(), payload, extraArgs);
     * const bcsTxn = AptosClient.generateBCSTransaction(sender, rawTransaction);
     * const pendingTransaction = await this.submitSignedBCSTransaction(bcsTxn);
     * const transasction = await this.aptosClient.waitForTransactionWithResult(pendingTransaction.hash);
     * ```
     */
    async waitForTransactionWithResult(txnHash, extraArgs) {
        const timeoutSecs = extraArgs?.timeoutSecs ?? utils_1.DEFAULT_TXN_TIMEOUT_SEC;
        const checkSuccess = extraArgs?.checkSuccess ?? false;
        let isPending = true;
        let count = 0;
        let lastTxn;
        while (isPending) {
            if (count >= timeoutSecs) {
                break;
            }
            try {
                // eslint-disable-next-line no-await-in-loop
                lastTxn = await this.client.transactions.getTransactionByHash(txnHash);
                isPending = lastTxn.type === "pending_transaction";
                if (!isPending) {
                    break;
                }
            }
            catch (e) {
                // In short, this means we will retry if it was an ApiError and the code was 404 or 5xx.
                const isApiError = e instanceof Gen.ApiError;
                const isRequestError = isApiError && e.status !== 404 && e.status >= 400 && e.status < 500;
                if (!isApiError || isRequestError) {
                    throw e;
                }
            }
            // eslint-disable-next-line no-await-in-loop
            await (0, utils_1.sleep)(1000);
            count += 1;
        }
        if (isPending) {
            throw new WaitForTransactionError(`Waiting for transaction ${txnHash} timed out after ${timeoutSecs} seconds`, lastTxn);
        }
        if (!checkSuccess) {
            return lastTxn;
        }
        if (!lastTxn?.success) {
            throw new FailedTransactionError(`Transaction ${lastTxn.hash} committed to the blockchain but execution failed`, lastTxn);
        }
        return lastTxn;
    }
    /**
     * This function works the same as `waitForTransactionWithResult` except it
     * doesn't return the transaction in those cases, it returns nothing. For
     * more information, see the documentation for `waitForTransactionWithResult`.
     */
    async waitForTransaction(txnHash, extraArgs) {
        await this.waitForTransactionWithResult(txnHash, extraArgs);
    }
    /**
     * Queries the latest ledger information
     * @returns Latest ledger information
     * @example Example of returned data
     * ```
     * {
     *   chain_id: 15,
     *   epoch: 6,
     *   ledgerVersion: "2235883",
     *   ledger_timestamp:"1654580922321826"
     * }
     * ```
     */
    async getLedgerInfo() {
        return this.client.general.getLedgerInfo();
    }
    /**
     * @returns Current chain id
     */
    async getChainId() {
        const result = await this.getLedgerInfo();
        return result.chain_id;
    }
    /**
     * Gets a table item for a table identified by the handle and the key for the item.
     * Key and value types need to be passed in to help with key serialization and value deserialization.
     * @param handle A pointer to where that table is stored
     * @param data Object, that describes table item
     * @param data.key_type Move type of table key (e.g. `vector<u8>`)
     * @param data.value_type Move type of table value (e.g. `u64`)
     * @param data.key Value of table key
     * @returns Table item value rendered in JSON
     */
    async getTableItem(handle, data, query) {
        const tableItem = await this.client.tables.getTableItem(handle, data, query?.ledgerVersion?.toString());
        return tableItem;
    }
    /**
     * Generates a raw transaction out of a transaction payload
     * @param accountFrom
     * @param payload
     * @param extraArgs
     * @returns
     */
    async generateRawTransaction(accountFrom, payload, extraArgs) {
        const [{ sequence_number: sequenceNumber }, chainId, { gas_estimate: gasEstimate },] = await Promise.all([
            this.getAccount(accountFrom),
            this.getChainId(),
            extraArgs?.gasUnitPrice
                ? Promise.resolve({ gas_estimate: extraArgs.gasUnitPrice })
                : this.estimateGasPrice(),
        ]);
        const { maxGasAmount, gasUnitPrice, expireTimestamp } = {
            maxGasAmount: BigInt(utils_1.DEFAULT_MAX_GAS_AMOUNT),
            gasUnitPrice: BigInt(gasEstimate),
            expireTimestamp: BigInt(Math.floor(Date.now() / 1000) + utils_1.DEFAULT_TXN_EXP_SEC_FROM_NOW),
            ...extraArgs,
        };
        return new transaction_builder_1.TxnBuilderTypes.RawTransaction(transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(accountFrom), BigInt(sequenceNumber), payload, maxGasAmount, gasUnitPrice, expireTimestamp, new transaction_builder_1.TxnBuilderTypes.ChainId(chainId));
    }
    /**
     * Helper for generating, signing, and submitting a transaction.
     *
     * @param sender AptosAccount of transaction sender.
     * @param payload Transaction payload.
     * @param extraArgs Extra args for building the transaction payload.
     * @returns The transaction response from the API.
     */
    async generateSignSubmitTransaction(sender, payload, extraArgs) {
        // :!:>generateSignSubmitTransactionInner
        const rawTransaction = await this.generateRawTransaction(sender.address(), payload, extraArgs);
        const bcsTxn = AptosClient.generateBCSTransaction(sender, rawTransaction);
        const pendingTransaction = await this.submitSignedBCSTransaction(bcsTxn);
        return pendingTransaction.hash;
        // <:!:generateSignSubmitTransactionInner
    }
    /**
     * Publishes a move package. `packageMetadata` and `modules` can be generated with command
     * `aptos move compile --save-metadata [ --included-artifacts=<...> ]`.
     * @param sender
     * @param packageMetadata package metadata bytes
     * @param modules bytecodes of modules
     * @param extraArgs
     * @returns Transaction hash
     */
    async publishPackage(sender, packageMetadata, modules, extraArgs) {
        const codeSerializer = new bcs_1.Serializer();
        (0, bcs_1.serializeVector)(modules, codeSerializer);
        const payload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::code", "publish_package_txn", [], [(0, bcs_1.bcsSerializeBytes)(packageMetadata), codeSerializer.getBytes()]));
        return this.generateSignSubmitTransaction(sender, payload, extraArgs);
    }
    /**
     * Helper for generating, submitting, and waiting for a transaction, and then
     * checking whether it was committed successfully. Under the hood this is just
     * `generateSignSubmitTransaction` and then `waitForTransactionWithResult`, see
     * those for information about the return / error semantics of this function.
     */
    async generateSignSubmitWaitForTransaction(sender, payload, extraArgs) {
        const txnHash = await this.generateSignSubmitTransaction(sender, payload, extraArgs);
        return this.waitForTransactionWithResult(txnHash, extraArgs);
    }
    async estimateGasPrice() {
        return this.client.transactions.estimateGasPrice();
    }
    async estimateMaxGasAmount(forAccount) {
        // Only Aptos utility coin is accepted as gas
        const typeTag = `0x1::coin::CoinStore<${utils_1.APTOS_COIN}>`;
        const [{ gas_estimate: gasUnitPrice }, resources] = await Promise.all([
            this.estimateGasPrice(),
            this.getAccountResources(forAccount),
        ]);
        const accountResource = resources.find((r) => r.type === typeTag);
        const balance = BigInt(accountResource.data.coin.value);
        return balance / BigInt(gasUnitPrice);
    }
    /**
     * Rotate an account's auth key. After rotation, only the new private key can be used to sign txns for
     * the account.
     * WARNING: You must create a new instance of AptosAccount after using this function.
     * @param forAccount Account of which the auth key will be rotated
     * @param toPrivateKeyBytes New private key
     * @param extraArgs Extra args for building the transaction payload.
     * @returns PendingTransaction
     */
    async rotateAuthKeyEd25519(forAccount, toPrivateKeyBytes, extraArgs) {
        const { sequence_number: sequenceNumber, authentication_key: authKey } = await this.getAccount(forAccount.address());
        const helperAccount = new aptos_account_1.AptosAccount(toPrivateKeyBytes);
        const challenge = new transaction_builder_1.TxnBuilderTypes.RotationProofChallenge(transaction_builder_1.TxnBuilderTypes.AccountAddress.CORE_CODE_ADDRESS, "account", "RotationProofChallenge", BigInt(sequenceNumber), transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(forAccount.address()), new transaction_builder_1.TxnBuilderTypes.AccountAddress(new hex_string_1.HexString(authKey).toUint8Array()), helperAccount.pubKey().toUint8Array());
        const challengeHex = hex_string_1.HexString.fromUint8Array((0, bcs_1.bcsToBytes)(challenge));
        const proofSignedByCurrentPrivateKey = forAccount.signHexString(challengeHex);
        const proofSignedByNewPrivateKey = helperAccount.signHexString(challengeHex);
        const payload = new transaction_builder_1.TxnBuilderTypes.TransactionPayloadEntryFunction(transaction_builder_1.TxnBuilderTypes.EntryFunction.natural("0x1::account", "rotate_authentication_key", [], [
            (0, bcs_1.bcsSerializeU8)(0),
            (0, bcs_1.bcsSerializeBytes)(forAccount.pubKey().toUint8Array()),
            (0, bcs_1.bcsSerializeU8)(0),
            (0, bcs_1.bcsSerializeBytes)(helperAccount.pubKey().toUint8Array()),
            (0, bcs_1.bcsSerializeBytes)(proofSignedByCurrentPrivateKey.toUint8Array()),
            (0, bcs_1.bcsSerializeBytes)(proofSignedByNewPrivateKey.toUint8Array()),
        ]));
        const rawTransaction = await this.generateRawTransaction(forAccount.address(), payload, extraArgs);
        const bcsTxn = AptosClient.generateBCSTransaction(forAccount, rawTransaction);
        return this.submitSignedBCSTransaction(bcsTxn);
    }
    /**
     * Lookup the original address by the current derived address
     * @param addressOrAuthKey
     * @returns original address
     */
    async lookupOriginalAddress(addressOrAuthKey) {
        const resource = await this.getAccountResource("0x1", "0x1::account::OriginatingAddress");
        const { address_map: { handle }, } = resource.data;
        const origAddress = await this.getTableItem(handle, {
            key_type: "address",
            value_type: "address",
            key: hex_string_1.HexString.ensure(addressOrAuthKey).hex(),
        });
        return new hex_string_1.HexString(origAddress);
    }
    /**
     * Get block by height
     *
     * @param blockHeight Block height to lookup.  Starts at 0
     * @param withTransactions If set to true, include all transactions in the block
     *
     * @returns Block
     */
    async getBlockByHeight(blockHeight, withTransactions) {
        return this.client.blocks.getBlockByHeight(blockHeight, withTransactions);
    }
    /**
     * Get block by block transaction version
     *
     * @param version Ledger version to lookup block information for
     * @param withTransactions If set to true, include all transactions in the block
     *
     * @returns Block
     */
    async getBlockByVersion(version, withTransactions) {
        return this.client.blocks.getBlockByVersion(version, withTransactions);
    }
    // eslint-disable-next-line class-methods-use-this
    clearCache(tags) {
        (0, utils_1.clear)(tags);
    }
}
__decorate([
    parseApiError
], AptosClient.prototype, "getAccount", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getAccountTransactions", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getAccountModules", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getAccountModule", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getAccountResources", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getAccountResource", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getEventsByEventKey", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getEventsByCreationNumber", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getEventsByEventHandle", null);
__decorate([
    parseApiError
], AptosClient.prototype, "submitSignedBCSTransaction", null);
__decorate([
    parseApiError
], AptosClient.prototype, "submitBCSSimulation", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getTransactions", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getTransactionByHash", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getTransactionByVersion", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getLedgerInfo", null);
__decorate([
    (0, utils_1.Memoize)()
], AptosClient.prototype, "getChainId", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getTableItem", null);
__decorate([
    parseApiError,
    (0, utils_1.Memoize)({
        ttlMs: 5 * 60 * 1000,
        tags: ["gas_estimates"],
    })
], AptosClient.prototype, "estimateGasPrice", null);
__decorate([
    parseApiError
], AptosClient.prototype, "estimateMaxGasAmount", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getBlockByHeight", null);
__decorate([
    parseApiError
], AptosClient.prototype, "getBlockByVersion", null);
exports.AptosClient = AptosClient;
class ApiError extends Error {
    constructor(status, message, errorCode, vmErrorCode) {
        super(message);
        this.status = status;
        this.message = message;
        this.errorCode = errorCode;
        this.vmErrorCode = vmErrorCode;
    }
}
exports.ApiError = ApiError;
/**
 * This error is used by `waitForTransactionWithResult` when waiting for a
 * transaction times out.
 */
class WaitForTransactionError extends Error {
    constructor(message, lastSubmittedTransaction) {
        super(message);
        this.lastSubmittedTransaction = lastSubmittedTransaction;
    }
}
exports.WaitForTransactionError = WaitForTransactionError;
/**
 * This error is used by `waitForTransactionWithResult` if `checkSuccess` is true.
 * See that function for more information.
 */
class FailedTransactionError extends Error {
    constructor(message, transaction) {
        super(message);
        this.transaction = transaction;
    }
}
exports.FailedTransactionError = FailedTransactionError;
/**
 * Creates a decorator to parse Gen.ApiError and return a wrapped error that is more developer friendly
 */
function parseApiError(target, propertyKey, descriptor) {
    const childFunction = descriptor.value;
    // eslint-disable-next-line no-param-reassign
    descriptor.value = async function wrapper(...args) {
        try {
            // We need to explicitly await here so that the function is called and
            // potentially throws an error. If we just return without awaiting, the
            // promise is returned directly and the catch block cannot trigger.
            const res = await childFunction.apply(this, [...args]);
            return res;
        }
        catch (e) {
            if (e instanceof Gen.ApiError) {
                throw new ApiError(e.status, JSON.stringify({ message: e.message, ...e.body }), e.body?.error_code, e.body?.vm_error_code);
            }
            throw e;
        }
    };
    return descriptor;
}
//# sourceMappingURL=aptos_client.js.map