import { HexString, MaybeHexString } from "../utils";
import { AptosAccount } from "../account/aptos_account";
import * as Gen from "../generated/index";
import { TxnBuilderTypes } from "../transaction_builder";
import { Bytes, Seq, Uint64, AnyNumber } from "../bcs";
import { Ed25519PublicKey, MultiEd25519PublicKey } from "../aptos_types";
export interface OptionalTransactionArgs {
    maxGasAmount?: Uint64;
    gasUnitPrice?: Uint64;
    expireTimestamp?: Uint64;
}
interface PaginationArgs {
    start?: AnyNumber;
    limit?: number;
}
/**
 * Provides methods for retrieving data from Aptos node.
 * For more detailed API specification see {@link https://fullnode.devnet.aptoslabs.com/v1/spec}
 */
export declare class AptosClient {
    client: Gen.AptosGeneratedClient;
    readonly nodeUrl: string;
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
    constructor(nodeUrl: string, config?: Partial<Gen.OpenAPIConfig>, doNotFixNodeUrl?: boolean);
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
    getAccount(accountAddress: MaybeHexString): Promise<Gen.AccountData>;
    /**
     * Queries transactions sent by given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query Optional pagination object
     * @param query.start The sequence number of the start transaction of the page. Default is 0.
     * @param query.limit The max number of transactions should be returned for the page. Default is 25.
     * @returns An array of on-chain transactions, sent by account
     */
    getAccountTransactions(accountAddress: MaybeHexString, query?: PaginationArgs): Promise<Gen.Transaction[]>;
    /**
     * Queries modules associated with given account
     *
     * Note: In order to get all account modules, this function may call the API
     * multiple times as it paginates.
     *
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account modules array for a specific ledger version.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which is JSON representation of a module
     */
    getAccountModules(accountAddress: MaybeHexString, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<Gen.MoveModuleBytecode[]>;
    /**
     * Queries module associated with given account by module name
     *
     * Note: In order to get all account resources, this function may call the API
     * multiple times as it paginates.
     *
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param moduleName The name of the module
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Specified module.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which JSON representation of a module
     */
    getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<Gen.MoveModuleBytecode>;
    /**
     * Queries all resources associated with given account
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resources for a specific ledger version
     */
    getAccountResources(accountAddress: MaybeHexString, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<Gen.MoveResource[]>;
    /**
     * Queries resource associated with given account by resource type
     * @param accountAddress Hex-encoded 32 byte Aptos account address
     * @param resourceType String representation of an on-chain Move struct type
     * @param query.ledgerVersion Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resource of specified type and ledger version
     * @example An example of an account resource
     * ```
     * {
     *    type: "0x1::aptos_coin::AptosCoin",
     *    data: { value: 6 }
     * }
     * ```
     */
    getAccountResource(accountAddress: MaybeHexString, resourceType: Gen.MoveStructTag, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<Gen.MoveResource>;
    /** Generates a signed transaction that can be submitted to the chain for execution. */
    static generateBCSTransaction(accountFrom: AptosAccount, rawTxn: TxnBuilderTypes.RawTransaction): Uint8Array;
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
    static generateBCSSimulation(accountFrom: AptosAccount, rawTxn: TxnBuilderTypes.RawTransaction): Uint8Array;
    /** Generates an entry function transaction request that can be submitted to produce a raw transaction that
     * can be signed, which upon being signed can be submitted to the blockchain
     * This function fetches the remote ABI and uses it to serialized the data, therefore
     * users don't need to handle serialization by themselves.
     * @param sender Hex-encoded 32 byte Aptos account address of transaction sender
     * @param payload Entry function transaction payload type
     * @param options Options allow to overwrite default transaction options.
     * @returns A raw transaction object
     */
    generateTransaction(sender: MaybeHexString, payload: Gen.EntryFunctionPayload, options?: Partial<Gen.SubmitTransactionRequest>): Promise<TxnBuilderTypes.RawTransaction>;
    /** Converts a transaction request produced by `generateTransaction` into a properly
     * signed transaction, which can then be submitted to the blockchain
     * @param accountFrom AptosAccount of transaction sender
     * @param rawTransaction A raw transaction generated by `generateTransaction` method
     * @returns A transaction, signed with sender account
     */
    signTransaction(accountFrom: AptosAccount, rawTransaction: TxnBuilderTypes.RawTransaction): Promise<Uint8Array>;
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
    getEventsByCreationNumber(address: MaybeHexString, creationNumber: AnyNumber | string, query?: PaginationArgs): Promise<Gen.Event[]>;
    /**
     * This API uses the given account `address`, `eventHandle`, and `fieldName`
     * to build a key that can globally identify an event types. It then uses this
     * key to return events emitted to the given account matching that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix,
     * for which events are queried. This refers to the account that events were emitted
     * to, not the account hosting the move module that emits that event type.
     * @param eventHandleStruct String representation of an on-chain Move struct type.
     * (e.g. `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`)
     * @param fieldName The field name of the EventHandle in the struct
     * @param query Optional query object
     * @param query.start The start sequence number in the EVENT STREAM, defaulting to the latest event.
     * The events are returned in the reverse order of sequence number
     * @param query.limit The number of events to be returned. The default is 25.
     * @returns Array of events
     */
    getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: Gen.MoveStructTag, fieldName: string, query?: PaginationArgs): Promise<Gen.Event[]>;
    /**
     * Submits a signed transaction to the transaction endpoint.
     * @param signedTxn A transaction, signed by `signTransaction` method
     * @returns Transaction that is accepted and submitted to mempool
     */
    submitTransaction(signedTxn: Uint8Array): Promise<Gen.PendingTransaction>;
    /**
     * Generates and submits a transaction to the transaction simulation
     * endpoint. For this we generate a transaction with a fake signature.
     *
     * @param accountOrPubkey The sender or sender's public key. When private key is available, `AptosAccount` instance
     * can be used to send the transaction for simulation. If private key is not available, sender's public key can be
     * used to send the transaction for simulation.
     * @param rawTransaction The raw transaction to be simulated, likely created
     * by calling the `generateTransaction` function.
     * @param query.estimateGasUnitPrice If set to true, the gas unit price in the
     * transaction will be ignored and the estimated value will be used.
     * @param query.estimateMaxGasAmount If set to true, the max gas value in the
     * transaction will be ignored and the maximum possible gas will be used.
     * @param query.estimatePrioritizedGasUnitPrice If set to true, the transaction will use a higher price than the
     * original estimate.
     * @returns The BCS encoded signed transaction, which you should then provide
     *
     */
    simulateTransaction(accountOrPubkey: AptosAccount | Ed25519PublicKey | MultiEd25519PublicKey | MaybeHexString, rawTransaction: TxnBuilderTypes.RawTransaction, query?: {
        estimateGasUnitPrice?: boolean;
        estimateMaxGasAmount?: boolean;
        estimatePrioritizedGasUnitPrice: boolean;
    }): Promise<Gen.UserTransaction[]>;
    /**
     * Submits a signed transaction to the endpoint that takes BCS payload
     *
     * @param signedTxn A BCS transaction representation
     * @returns Transaction that is accepted and submitted to mempool
     */
    submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Gen.PendingTransaction>;
    /**
     * Submits the BCS serialization of a signed transaction to the simulation endpoint.
     *
     * @param bcsBody The output of `generateBCSSimulation`.
     * @param query?.estimateGasUnitPrice If set to true, the gas unit price in the
     * transaction will be ignored and the estimated value will be used.
     * @param query?.estimateMaxGasAmount If set to true, the max gas value in the
     * transaction will be ignored and the maximum possible gas will be used.
     * @param query?.estimatePrioritizedGasUnitPrice If set to true, the transaction will use a higher price than the
     * original estimate.
     * @returns Simulation result in the form of UserTransaction.
     */
    submitBCSSimulation(bcsBody: Uint8Array, query?: {
        estimateGasUnitPrice?: boolean;
        estimateMaxGasAmount?: boolean;
        estimatePrioritizedGasUnitPrice?: boolean;
    }): Promise<Gen.UserTransaction[]>;
    /**
     * Queries on-chain transactions. This function will not return pending
     * transactions. For that, use `getTransactionsByHash`.
     *
     * @param query Optional pagination object
     * @param query.start The start transaction version of the page. Default is the latest ledger version
     * @param query.limit The max number of transactions should be returned for the page. Default is 25
     * @returns Array of on-chain transactions
     */
    getTransactions(query?: PaginationArgs): Promise<Gen.Transaction[]>;
    /**
     * @param txnHash - Transaction hash should be hex-encoded bytes string with 0x prefix.
     * @returns Transaction from mempool (pending) or on-chain (committed) transaction
     */
    getTransactionByHash(txnHash: string): Promise<Gen.Transaction>;
    /**
     * @param txnVersion - Transaction version is an uint64 number.
     * @returns On-chain transaction. Only on-chain transactions have versions, so this
     * function cannot be used to query pending transactions.
     */
    getTransactionByVersion(txnVersion: AnyNumber): Promise<Gen.Transaction>;
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
    transactionPending(txnHash: string): Promise<boolean>;
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
    waitForTransactionWithResult(txnHash: string, extraArgs?: {
        timeoutSecs?: number;
        checkSuccess?: boolean;
    }): Promise<Gen.Transaction>;
    /**
     * This function works the same as `waitForTransactionWithResult` except it
     * doesn't return the transaction in those cases, it returns nothing. For
     * more information, see the documentation for `waitForTransactionWithResult`.
     */
    waitForTransaction(txnHash: string, extraArgs?: {
        timeoutSecs?: number;
        checkSuccess?: boolean;
    }): Promise<void>;
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
    getLedgerInfo(): Promise<Gen.IndexResponse>;
    /**
     * @returns Current chain id
     */
    getChainId(): Promise<number>;
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
    getTableItem(handle: string, data: Gen.TableItemRequest, query?: {
        ledgerVersion?: AnyNumber;
    }): Promise<any>;
    /**
     * Generates a raw transaction out of a transaction payload
     * @param accountFrom
     * @param payload
     * @param extraArgs
     * @returns A raw transaction object
     */
    generateRawTransaction(accountFrom: HexString, payload: TxnBuilderTypes.TransactionPayload, extraArgs?: OptionalTransactionArgs): Promise<TxnBuilderTypes.RawTransaction>;
    /**
     * Helper for generating, signing, and submitting a transaction.
     *
     * @param sender AptosAccount of transaction sender.
     * @param payload Transaction payload.
     * @param extraArgs Extra args for building the transaction payload.
     * @returns The transaction response from the API.
     */
    generateSignSubmitTransaction(sender: AptosAccount, payload: TxnBuilderTypes.TransactionPayload, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Publishes a move package. `packageMetadata` and `modules` can be generated with command
     * `aptos move compile --save-metadata [ --included-artifacts=<...> ]`.
     * @param sender
     * @param packageMetadata package metadata bytes
     * @param modules bytecodes of modules
     * @param extraArgs
     * @returns Transaction hash
     */
    publishPackage(sender: AptosAccount, packageMetadata: Bytes, modules: Seq<TxnBuilderTypes.Module>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Helper for generating, submitting, and waiting for a transaction, and then
     * checking whether it was committed successfully. Under the hood this is just
     * `generateSignSubmitTransaction` and then `waitForTransactionWithResult`, see
     * those for information about the return / error semantics of this function.
     */
    generateSignSubmitWaitForTransaction(sender: AptosAccount, payload: TxnBuilderTypes.TransactionPayload, extraArgs?: OptionalTransactionArgs & {
        checkSuccess?: boolean;
        timeoutSecs?: number;
    }): Promise<Gen.Transaction>;
    estimateGasPrice(): Promise<Gen.GasEstimation>;
    estimateMaxGasAmount(forAccount: MaybeHexString): Promise<Uint64>;
    /**
     * Rotate an account's auth key. After rotation, only the new private key can be used to sign txns for
     * the account.
     * WARNING: You must create a new instance of AptosAccount after using this function.
     * @param forAccount Account of which the auth key will be rotated
     * @param toPrivateKeyBytes New private key
     * @param extraArgs Extra args for building the transaction payload.
     * @returns PendingTransaction
     */
    rotateAuthKeyEd25519(forAccount: AptosAccount, toPrivateKeyBytes: Uint8Array, extraArgs?: OptionalTransactionArgs): Promise<Gen.PendingTransaction>;
    /**
     * Lookup the original address by the current derived address
     * @param addressOrAuthKey
     * @returns original address
     */
    lookupOriginalAddress(addressOrAuthKey: MaybeHexString): Promise<HexString>;
    /**
     * Get block by height
     *
     * @param blockHeight Block height to lookup.  Starts at 0
     * @param withTransactions If set to true, include all transactions in the block
     *
     * @returns Block
     */
    getBlockByHeight(blockHeight: number, withTransactions?: boolean): Promise<Gen.Block>;
    /**
     * Get block by block transaction version
     *
     * @param version Ledger version to lookup block information for
     * @param withTransactions If set to true, include all transactions in the block
     *
     * @returns Block
     */
    getBlockByVersion(version: number, withTransactions?: boolean): Promise<Gen.Block>;
    /**
     * Call for a move view function
     *
     * @param payload Transaction payload
     * @param version (optional) Ledger version to lookup block information for
     *
     * @returns MoveValue[]
     */
    view(payload: Gen.ViewRequest, ledger_version?: string): Promise<Gen.MoveValue[]>;
    clearCache(tags: string[]): void;
}
export declare class ApiError extends Error {
    readonly status: number;
    readonly message: string;
    readonly errorCode?: string;
    readonly vmErrorCode?: string;
    constructor(status: number, message: string, errorCode?: string, vmErrorCode?: string);
}
/**
 * This error is used by `waitForTransactionWithResult` when waiting for a
 * transaction times out.
 */
export declare class WaitForTransactionError extends Error {
    readonly lastSubmittedTransaction: Gen.Transaction | undefined;
    constructor(message: string, lastSubmittedTransaction: Gen.Transaction | undefined);
}
/**
 * This error is used by `waitForTransactionWithResult` if `checkSuccess` is true.
 * See that function for more information.
 */
export declare class FailedTransactionError extends Error {
    readonly transaction: Gen.Transaction;
    constructor(message: string, transaction: Gen.Transaction);
}
export {};
//# sourceMappingURL=aptos_client.d.ts.map