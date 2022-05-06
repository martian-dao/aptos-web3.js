/// <reference types="node" />
import { AptosAccount } from './aptos_account';
import { TokenClient } from './token_client';
import { AptosClient } from './aptos_client';
import { FaucetClient } from './faucet_client';
import { Types } from './types';
export interface TokenId {
    creator: string;
    collectionName: string;
    name: string;
}
export interface AccountMetaData {
    derivationPath: string;
    address: string;
}
export interface Wallet {
    code: string;
    accounts: AccountMetaData[];
}
/** A wrapper around the Aptos-core Rest API */
export declare class RestClient {
    client: AptosClient;
    constructor(url: string);
    accountSentEvents(accountAddress: string): Promise<Types.Event[]>;
    accountReceivedEvents(accountAddress: string): Promise<Types.Event[]>;
    transactionPending(txnHash: string): Promise<boolean>;
    /** Waits up to 10 seconds for a transaction to move past pending state */
    waitForTransaction(txnHash: string): Promise<void>;
    /** Returns the test coin balance associated with the account */
    accountBalance(accountAddress: string): Promise<number | null>;
    /** Transfer a given coin amount from a given Account to the recipient's account address.
     Returns the sequence number of the transaction used to transfer. */
    transfer(accountFrom: AptosAccount, recipient: string, amount: number): Promise<string>;
}
export declare class WalletClient {
    faucetClient: FaucetClient;
    restClient: RestClient;
    aptosClient: AptosClient;
    tokenClient: TokenClient;
    constructor(node_url: any, faucet_url: any);
    importWallet(code: string): Promise<Wallet>;
    createWallet2(): Promise<Wallet>;
    createNewAccount(code: string): Promise<AccountMetaData>;
    getAccountFromPrivateKey(privateKey: Buffer, address?: string): Promise<AptosAccount>;
    getAccountFromMetaData(code: string, metaData: AccountMetaData): Promise<AptosAccount>;
    airdrop(address: string, amount: number): Promise<string[]>;
    getBalance(address: string): Promise<number>;
    transfer(account: AptosAccount, recipient_address: string, amount: number): Promise<void>;
    getSentEvents(address: string): Promise<Types.Event[]>;
    getReceivedEvents(address: string): Promise<Types.Event[]>;
    createCollection(account: AptosAccount, name: string, description: string, uri: string): Promise<string>;
    createToken(account: AptosAccount, collection_name: string, name: string, description: string, supply: number, uri: string): Promise<string>;
    offerToken(account: AptosAccount, receiver_address: string, creator_address: string, collection_name: string, token_name: string, amount: number): Promise<string>;
    cancelTokenOffer(account: AptosAccount, receiver_address: string, creator_address: string, collection_name: string, token_name: string): Promise<string>;
    claimNFT(account: AptosAccount, sender_address: string, creator_address: string, collection_name: string, token_name: string): Promise<string>;
    signGenericTransaction(account: AptosAccount, func: string, ...args: string[]): Promise<string>;
    rotateAuthKey(code: string, metaData: AccountMetaData): Promise<string>;
    getEventStream(address: string, eventHandleStruct: string, fieldName: string): Promise<any>;
    getTokenIds(address: string): Promise<any[]>;
    getTokens(address: string): Promise<any[]>;
    getToken(tokenId: TokenId): Promise<any>;
    getCollection(address: string, collectionName: string): Promise<any>;
    getCustomResource(address: string, resourceType: string, fieldName: string, keyType: string, valueType: string, key: any): Promise<any>;
}
//# sourceMappingURL=wallet_client.d.ts.map