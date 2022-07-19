import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Accounts } from './api/Accounts';
import { Events } from './api/Events';
import { Transactions } from './api/Transactions';
import { HttpClient, RequestParams } from './api/http-client';
import { MaybeHexString } from './hex_string';
import { AptosAccount } from './aptos_account';
import { Types } from './types';
import { Tables } from './api/Tables';
import { TxnBuilderTypes } from './transaction_builder';
export declare class RequestError extends Error {
    response?: AxiosResponse<any, Types.AptosError>;
    requestBody?: string;
    constructor(message?: string, response?: AxiosResponse<any, Types.AptosError>, requestBody?: string);
}
export declare type AptosClientConfig = Omit<AxiosRequestConfig, 'data' | 'cancelToken' | 'method'>;
export declare function raiseForStatus<T>(expectedStatus: number, response: AxiosResponse<T, Types.AptosError>, requestContent?: any): void;
/**
 * Provides methods for retrieving data from Aptos node.
 * For more detailed API specification see {@link https://fullnode.devnet.aptoslabs.com/spec.html#/}
 */
export declare class AptosClient {
    nodeUrl: string;
    client: HttpClient;
    accounts: Accounts;
    tables: Tables;
    events: Events;
    transactions: Transactions;
    /**
     * Establishes a connection to Aptos node
     * @param nodeUrl A url of the Aptos Node API endpoint
     * @param config An optional config for inner axios instance.
     * Detailed `config` description: {@link https://github.com/axios/axios#request-config}
     */
    constructor(nodeUrl: string, config?: AptosClientConfig);
    /**
     * Queries an Aptos account by address
     * @param accountAddress Hex-encoded 16 bytes Aptos account address
     * @returns Core account resource, used for identifying account and transaction execution
     * @example An example of the returned account
     * ```
     * {
     *    sequence_number: "1",
     *    authentication_key: "0x5307b5f4bc67829097a8ba9b43dba3b88261eeccd1f709d9bde240fc100fbb69"
     * }
     * ```
     */
    getAccount(accountAddress: MaybeHexString): Promise<Types.Account>;
    /**
     * Queries transactions sent by given account
     * @param accountAddress Hex-encoded 16 bytes Aptos account address
     * @param query Optional pagination object
     * @param query.start The start transaction version of the page. Default is the latest ledger version
     * @param query.limit The max number of transactions should be returned for the page. Default is 25.
     * @returns An array of on-chain transactions, sent by account
     */
    getAccountTransactions(accountAddress: MaybeHexString, query?: {
        start?: number;
        limit?: number;
    }): Promise<Types.OnChainTransaction[]>;
    /**
     * Queries modules associated with given account
     * @param accountAddress Hex-encoded 16 bytes Aptos account address
     * @param query.version Specifies ledger version of transactions. By default latest version will be used
     * @returns Account modules array for a specific ledger version.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which is JSON representation of a module
     */
    getAccountModules(accountAddress: MaybeHexString, query?: {
        version?: Types.LedgerVersion;
    }): Promise<Types.MoveModule[]>;
    /**
     * Queries module associated with given account by module name
     * @param accountAddress Hex-encoded 16 bytes Aptos account address
     * @param moduleName The name of the module
     * @param query.version Specifies ledger version of transactions. By default latest version will be used
     * @returns Specified module.
     * Module is represented by MoveModule interface. It contains module `bytecode` and `abi`,
     * which JSON representation of a module
     */
    getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: {
        version?: Types.LedgerVersion;
    }): Promise<Types.MoveModule>;
    /**
     * Queries all resources associated with given account
     * @param accountAddress Hex-encoded 16 bytes Aptos account address
     * @param query.version Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resources for a specific ledger version
     * @example An example of an account resource
     * ```
     * {
     *    type: "0x1::AptosAccount::Coin",
     *    data: { value: 6 }
     * }
     * ```
     */
    getAccountResources(accountAddress: MaybeHexString, query?: {
        version?: Types.LedgerVersion;
    }): Promise<Types.AccountResource[]>;
    /**
     * Queries resource associated with given account by resource type
     * @param accountAddress Hex-encoded 16 bytes Aptos account address
     * @param resourceType String representation of an on-chain Move struct type
     * @param query.version Specifies ledger version of transactions. By default latest version will be used
     * @returns Account resource of specified type and ledger version
     * @example An example of an account resource
     * ```
     * {
     *    type: "0x1::AptosAccount::Coin",
     *    data: { value: 6 }
     * }
     * ```
     */
    getAccountResource(accountAddress: MaybeHexString, resourceType: string, query?: {
        version?: Types.LedgerVersion;
    }): Promise<Types.AccountResource>;
    /** Generates a signed transaction that can be submitted to the chain for execution. */
    static generateBCSTransaction(accountFrom: AptosAccount, rawTxn: TxnBuilderTypes.RawTransaction): Uint8Array;
    /** Generates a BCS transaction that can be submitted to the chain for simulation. */
    static generateBCSSimulation(accountFrom: AptosAccount, rawTxn: TxnBuilderTypes.RawTransaction): Uint8Array;
    /** Generates a transaction request that can be submitted to produce a raw transaction that
     * can be signed, which upon being signed can be submitted to the blockchain
     * @param sender Hex-encoded 16 bytes Aptos account address of transaction sender
     * @param payload Transaction payload. It depends on transaction type you want to send
     * @param options Options allow to overwrite default transaction options.
     * Defaults are:
     * ```bash
     *   {
     *     sender: senderAddress.hex(),
     *     sequence_number: account.sequence_number,
     *     max_gas_amount: "1000",
     *     gas_unit_price: "1",
     *     gas_currency_code: "XUS",
     *     // Unix timestamp, in seconds + 10 seconds
     *     expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 10).toString(),
     *   }
     * ```
     * @returns A transaction object
     */
    generateTransaction(sender: MaybeHexString, payload: Types.TransactionPayload, options?: Partial<Types.UserTransactionRequest>): Promise<Types.UserTransactionRequest>;
    /**
     * Converts a transaction request by `generate_transaction` into it's binary hex BCS representation, ready for
     * signing and submitting.
     * Generally you may want to use `signTransaction`, as it takes care of this step + signing
     * @param txnRequest A raw transaction generated by `generateTransaction` method
     * @returns A hex-encoded string prefixed with `0x` and fulfilled with two hex digits per byte
     */
    createSigningMessage(txnRequest: Types.UserTransactionRequest): Promise<Types.HexEncodedBytes>;
    /** Converts a transaction request produced by `generate_transaction` into a properly signed
     * transaction, which can then be submitted to the blockchain
     * @param accountFrom AptosAccount of transaction sender
     * @param txnRequest A raw transaction generated by `generateTransaction` method
     * @returns A transaction, signed with sender account
     */
    signTransaction(accountFrom: AptosAccount, txnRequest: Types.UserTransactionRequest): Promise<Types.SubmitTransactionRequest>;
    /**
     * Queries events by event key
     * @param eventKey Event key for an event stream. It is BCS serialized bytes
     * of `guid` field in the Move struct `EventHandle`
     * @returns Array of events assotiated with given key
     */
    getEventsByEventKey(eventKey: Types.HexEncodedBytes): Promise<Types.Event[]>;
    /**
     * Extracts event key from the account resource identified by the
     * `event_handle_struct` and `field_name`, then returns events identified by the event key
     * @param address Hex-encoded 16 bytes Aptos account from which events are queried
     * @param eventHandleStruct String representation of an on-chain Move struct type.
     * (e.g. `0x1::Coin::CoinStore<0x1::TestCoin::TestCoin>`)
     * @param fieldName The field name of the EventHandle in the struct
     * @param query Optional query object
     * @param query.start The start sequence number in the EVENT STREAM, defaulting to the latest event.
     * The events are returned in the reverse order of sequence number
     * @param query.limit The number of events to be returned for the page default is 5
     * @returns Array of events
     */
    getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: Types.MoveStructTagId, fieldName: string, query?: {
        start?: number;
        limit?: number;
    }): Promise<Types.Event[]>;
    /**
     * Submits a signed transaction to the transaction endpoint that takes JSON payload
     * @param signedTxnRequest A transaction, signed by `signTransaction` method
     * @returns Transaction that is accepted and submitted to mempool
     */
    submitTransaction(signedTxnRequest: Types.SubmitTransactionRequest): Promise<Types.PendingTransaction>;
    /** Submits a transaction with fake signature to the transaction simulation endpoint that takes JSON payload. */
    simulateTransaction(accountFrom: AptosAccount, txnRequest: Types.UserTransactionRequest): Promise<Types.OnChainTransaction>;
    /**
     * Submits a signed transaction to the the endpoint that takes BCS payload
     * @param signedTxn A BCS transaction representation
     * @returns Transaction that is accepted and submitted to mempool
     */
    submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Types.PendingTransaction>;
    /**
     * Submits a signed transaction to the the endpoint that takes BCS payload
     * @param signedTxn output of generateBCSSimulation()
     * @returns Simulation result in the form of OnChainTransaction
     */
    submitBCSSimulation(bcsBody: Uint8Array): Promise<Types.OnChainTransaction>;
    /**
     * Queries on-chain transactions
     * @param query Optional pagination object
     * @param query.start The start transaction version of the page. Default is the latest ledger version
     * @param query.limit The max number of transactions should be returned for the page. Default is 25
     * @returns Array of on-chain transactions
     */
    getTransactions(query?: {
        start?: number;
        limit?: number;
    }): Promise<Types.OnChainTransaction[]>;
    /**
     * Queries transaction by hash or version. When given transaction hash, server first looks up
     * on-chain transaction by hash; if no on-chain transaction found, then look up transaction
     * by hash in the mempool (pending) transactions.
     * When given a transaction version, server looks up the transaction on-chain by version
     * @param txnHashOrVersion - Transaction hash should be hex-encoded bytes string with 0x prefix.
     * Transaction version is an uint64 number.
     * @returns Transaction from mempool or on-chain transaction
     */
    getTransaction(txnHashOrVersion: string): Promise<Types.Transaction>;
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
    transactionPending(txnHash: Types.HexEncodedBytes): Promise<boolean>;
    /**
     * Waits up to 10 seconds for a transaction to move past pending state
     * @param txnHash A hash of transaction
     * @returns A Promise, that will resolve if transaction is accepted to the blockchain,
     * and reject if more then 10 seconds passed
     * @example
     * ```
     * const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
     * const res = await this.aptosClient.submitTransaction(signedTxn);
     * await this.aptosClient.waitForTransaction(res.hash);
     * // do smth after transaction is accepted into blockchain
     * ```
     */
    waitForTransaction(txnHash: Types.HexEncodedBytes): Promise<void>;
    /**
     * Queries the latest ledger information
     * @param params Request params
     * @returns Latest ledger information
     * @example Example of returned data
     * ```
     * {
     *   chain_id: 15,
     *   epoch: 6,
     *   ledger_version: "2235883",
     *   ledger_timestamp:"1654580922321826"
     * }
     * ```
     */
    getLedgerInfo(params?: RequestParams): Promise<Types.LedgerInfo>;
    /**
     * @param params Request params
     * @returns Current chain id
     */
    getChainId(params?: RequestParams): Promise<number>;
    /**
     * Gets a table item for a table identified by the handle and the key for the item.
     * Key and value types need to be passed in to help with key serialization and value deserialization.
     * @param handle A pointer to where that table is stored
     * @param data Object, that describes table item
     * @param data.key_type Move type of table key (e.g. `vector<u8>`)
     * @param data.value_type Move type of table value (e.g. `u64`)
     * @param data.key Value of table key
     * @param params Request params
     * @returns Table item value rendered in JSON
     */
    getTableItem(handle: string, data: Types.TableItemRequest, params?: RequestParams): Promise<any>;
}
//# sourceMappingURL=aptos_client.d.ts.map