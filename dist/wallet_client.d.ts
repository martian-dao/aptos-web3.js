import { AptosAccount } from './aptos_account';
import { TokenClient } from './token_client';
import { AptosClient } from './aptos_client';
import { FaucetClient } from './faucet_client';
import { HexString, MaybeHexString } from './hex_string';
import { Types } from './types';
export interface TokenId {
    creator: string;
    collectionName: string;
    name: string;
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
    getAccountFromMnemonic(code: string, address?: MaybeHexString): Promise<AptosAccount>;
    createWallet(): Promise<{
        code: string;
        "address key": string;
    }>;
    getUninitializedAccount(): Promise<{
        code: string;
        auth_key: HexString;
        "address key": string;
    }>;
    importWallet(code: string, address?: string): Promise<{
        auth_key: HexString;
        "address key": string;
    }>;
    airdrop(address: string, amount: number): Promise<string[]>;
    getBalance(address: string): Promise<number>;
    transfer(code: string, recipient_address: string, amount: number, sender_address?: string): Promise<void>;
    getSentEvents(address: string): Promise<Types.Event[]>;
    getReceivedEvents(address: string): Promise<Types.Event[]>;
    createNFTCollection(code: string, name: string, description: string, uri: string, address?: string): Promise<string>;
    createNFT(code: string, collection_name: string, name: string, description: string, supply: number, uri: string, address?: string): Promise<string>;
    offerNFT(code: string, receiver_address: string, creator_address: string, collection_name: string, token_name: string, amount: number, address?: string): Promise<string>;
    cancelNFTOffer(code: string, receiver_address: string, creator_address: string, collection_name: string, token_name: string, address?: string): Promise<string>;
    claimNFT(code: string, sender_address: string, creator_address: string, collection_name: string, token_name: string, address?: string): Promise<string>;
    signGenericTransaction(code: string, func: string, ...args: string[]): Promise<string>;
    getAccountResources(accountAddress: string): Promise<Types.AccountResource[]>;
    getEventStream(address: string, eventHandleStruct: string, fieldName: string): Promise<any>;
    getTokenIds(address: string): Promise<any[]>;
    getTokens(address: string): Promise<any[]>;
    getToken(tokenId: TokenId): Promise<any>;
    getCollection(address: string, collectionName: string): Promise<any>;
    getCustomResource(address: string, resourceType: string, fieldName: string, keyType: string, valueType: string, key: any): Promise<any>;
}
//# sourceMappingURL=wallet_client.d.ts.map