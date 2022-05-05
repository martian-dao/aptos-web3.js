import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Accounts } from "./api/Accounts";
import { Events } from "./api/Events";
import { Transactions } from "./api/Transactions";
import { HttpClient } from "./api/http-client";
import { MaybeHexString } from "./hex_string";
import { AptosAccount } from "./aptos_account";
import { Types } from "./types";
export declare class RequestError extends Error {
    response?: AxiosResponse<any, Types.AptosError>;
    requestBody?: string;
    constructor(message?: string, response?: AxiosResponse<any, Types.AptosError>, requestBody?: string);
}
export declare type AptosClientConfig = Omit<AxiosRequestConfig, "data" | "cancelToken" | "method">;
export declare function raiseForStatus<T>(expectedStatus: number, response: AxiosResponse<T, Types.AptosError>, requestContent?: any): void;
export declare class AptosClient {
    nodeUrl: string;
    client: HttpClient;
    accounts: Accounts;
    events: Events;
    transactions: Transactions;
    constructor(nodeUrl: string, config?: AptosClientConfig);
    /** Returns the sequence number and authentication key for an account */
    getAccount(accountAddress: MaybeHexString): Promise<Types.Account>;
    /** Returns transactions sent by the account */
    getAccountTransactions(accountAddress: MaybeHexString, query?: {
        start?: number;
        limit?: number;
    }): Promise<Types.OnChainTransaction[]>;
    /** Returns all modules associated with the account */
    getAccountModules(accountAddress: MaybeHexString, query?: {
        version?: Types.LedgerVersion;
    }): Promise<Types.MoveModule[]>;
    /** Returns the module identified by address and module name */
    getAccountModule(accountAddress: MaybeHexString, moduleName: string, query?: {
        version?: Types.LedgerVersion;
    }): Promise<Types.MoveModule>;
    /** Returns all resources associated with the account */
    getAccountResources(accountAddress: MaybeHexString, query?: {
        version?: Types.LedgerVersion;
    }): Promise<Types.AccountResource[]>;
    /** Returns the resource by the address and resource type */
    getAccountResource(accountAddress: MaybeHexString, resourceType: string, query?: {
        version?: Types.LedgerVersion;
    }): Promise<Types.AccountResource>;
    /** Generates a transaction request that can be submitted to produce a raw transaction that
     * can be signed, which upon being signed can be submitted to the blockchain. */
    generateTransaction(sender: MaybeHexString, payload: Types.TransactionPayload, options?: Partial<Types.UserTransactionRequest>): Promise<Types.UserTransactionRequest>;
    /** Converts a transaction request by `generate_transaction` into it's binary hex BCS representation, ready for
     * signing and submitting.
     * Generally you may want to use `signTransaction`, as it takes care of this step + signing */
    createSigningMessage(txnRequest: Types.UserTransactionRequest): Promise<Types.HexEncodedBytes>;
    /** Converts a transaction request produced by `generate_transaction` into a properly signed
     * transaction, which can then be submitted to the blockchain. */
    signTransaction(accountFrom: AptosAccount, txnRequest: Types.UserTransactionRequest): Promise<Types.SubmitTransactionRequest>;
    getEventsByEventKey(eventKey: Types.HexEncodedBytes): Promise<Types.Event[]>;
    getEventsByEventHandle(address: MaybeHexString, eventHandleStruct: Types.MoveStructTagId, fieldName: string, query?: {
        start?: number;
        limit?: number;
    }): Promise<Types.Event[]>;
    /** Submits a signed transaction to the blockchain. */
    submitTransaction(accountFrom: AptosAccount, signedTxnRequest: Types.SubmitTransactionRequest): Promise<Types.PendingTransaction>;
    getTransactions(query?: {
        start?: number;
        limit?: number;
    }): Promise<Types.OnChainTransaction[]>;
    getTransaction(txnHashOrVersion: string): Promise<Types.Transaction>;
    transactionPending(txnHash: Types.HexEncodedBytes): Promise<boolean>;
    /** Waits up to 10 seconds for a transaction to move past pending state */
    waitForTransaction(txnHash: Types.HexEncodedBytes): Promise<void>;
}
//# sourceMappingURL=aptos_client.d.ts.map