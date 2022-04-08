import * as Nacl from "tweetnacl";
export declare const TESTNET_URL = "https://fullnode.devnet.aptoslabs.com";
export declare const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
/** A subset of the fields of a TransactionRequest, for this tutorial */
export declare type TxnRequest = Record<string, any> & {
    sequence_number: string;
};
/** Represents an account as well as the private, public key-pair for the Aptos blockchain */
export declare class Account {
    signingKey: Nacl.SignKeyPair;
    constructor(seed?: Uint8Array | undefined);
    /** Returns the address associated with the given account */
    address(): string;
    /** Returns the authKey for the associated account */
    authKey(): string;
    /** Returns the public key for the associated account */
    pubKey(): string;
}
/** A wrapper around the Aptos-core Rest API */
export declare class RestClient {
    url: string;
    constructor(url: string);
    /** Returns the sequence number and authentication key for an account */
    account(accountAddress: string): Promise<Record<string, string> & {
        sequence_number: string;
    }>;
    /** Returns all resources associated with the account */
    accountResources(accountAddress: string): Promise<Record<string, any> & {
        type: string;
    }>;
    accountSentEvents(accountAddress: string): Promise<Record<string, any> & {
        type: string;
    }>;
    accountReceivedEvents(accountAddress: string): Promise<Record<string, any> & {
        type: string;
    }>;
    /** Generates a transaction request that can be submitted to produce a raw transaction that
     can be signed, which upon being signed can be submitted to the blockchain. */
    generateTransaction(sender: string, payload: Record<string, any>): Promise<TxnRequest>;
    /** Converts a transaction request produced by `generate_transaction` into a properly signed
     transaction, which can then be submitted to the blockchain. */
    signTransaction(accountFrom: Account, txnRequest: TxnRequest): Promise<TxnRequest>;
    /** Submits a signed transaction to the blockchain. */
    submitTransaction(accountFrom: Account, txnRequest: TxnRequest): Promise<Record<string, any>>;
    transactionPending(txnHash: string): Promise<boolean>;
    /** Waits up to 10 seconds for a transaction to move past pending state */
    waitForTransaction(txnHash: string): Promise<void>;
    /** Returns the test coin balance associated with the account */
    accountBalance(accountAddress: string): Promise<number | null>;
    /** Transfer a given coin amount from a given Account to the recipient's account address.
     Returns the sequence number of the transaction used to transfer. */
    transfer(accountFrom: Account, recipient: string, amount: number): Promise<string>;
}
/** Faucet creates and funds accounts. This is a thin wrapper around that. */
export declare class FaucetClient {
    url: string;
    restClient: RestClient;
    constructor(url: string, restClient: RestClient);
    /** This creates an account if it does not exist and mints the specified amount of
     coins into that account */
    fundAccount(authKey: string, amount: number): Promise<void>;
}
export declare class TokenClient {
    restClient: RestClient;
    constructor(restClient: RestClient);
    submitTransactionHelper(account: Account, payload: Record<string, any>): Promise<any>;
    /** Creates a new collection within the specified account */
    createCollection(account: Account, description: string, name: string, uri: string): Promise<any>;
    createToken(account: Account, collection_name: string, description: string, name: string, supply: number, uri: string): Promise<any>;
    offerToken(account: Account, receiver: string, creator: string, token_creation_num: number, amount: number): Promise<any>;
    claimToken(account: Account, sender: string, creator: string, token_creation_num: number): Promise<any>;
    cancelTokenOffer(account: Account, receiver: string, creator: string, token_creation_num: number): Promise<any>;
    /** Retrieve the token's creation_num, which is useful for non-creator operations */
    getTokenId(creator: string, collection_name: string, token_name: string): Promise<number>;
}
export declare function create_wallet(): Promise<{
    code: string;
    "address key": string;
}>;
export declare function import_wallet(code: string): Promise<{
    "address key": string;
}>;
export declare function air_drop(code: string, amount: number): Promise<void>;
export declare function get_balance(address: string): Promise<number | null>;
export declare function transfer(code: string, recipient_address: string, amount: number): Promise<void>;
export declare function getSentEvents(address: string): Promise<Record<string, any> & {
    type: string;
}>;
export declare function getReceivedEvents(address: string): Promise<Record<string, any> & {
    type: string;
}>;
export declare function createNFTCollection(code: string, description: string, name: string, uri: string): Promise<any>;
export declare function createNFT(code: string, collection_name: string, description: string, name: string, supply: number, uri: string): Promise<any>;
export declare function offerNFT(code: string, receiver_address: string, creator_address: string, collection_name: string, token_name: string, amount: number): Promise<any>;
export declare function cancelNFTOffer(code: string, receiver_address: string, creator_address: string, collection_name: string, token_name: string): Promise<any>;
export declare function claimNFT(code: string, sender_address: string, creator_address: string, collection_name: string, token_name: string): Promise<any>;
