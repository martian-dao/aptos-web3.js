import { AptosAccount } from "./aptos_account";
import { TokenClient } from "./token_client";
import { AptosClient } from "./aptos_client";
import { FaucetClient } from "./faucet_client";
import { HexString, MaybeHexString } from "./hex_string";
import { Types } from "./types";
import { Buffer } from "buffer/";
import { RawTransaction } from "./transaction_builder/aptos_types/transaction";
export interface TokenId {
    creator: string;
    collectionName: string;
    name: string;
}
export interface AccountMetaData {
    derivationPath: string;
    address: string;
    publicKey?: string;
}
export interface Wallet {
    code: string;
    accounts: AccountMetaData[];
}
export declare class WalletClient {
    faucetClient: FaucetClient;
    aptosClient: AptosClient;
    tokenClient: TokenClient;
    constructor(node_url: any, faucet_url: any);
    importWallet(code: string): Promise<Wallet>;
    createWallet(): Promise<Wallet>;
    createNewAccount(code: string): Promise<AccountMetaData>;
    getAccountFromPrivateKey(privateKey: Buffer, address?: string): Promise<AptosAccount>;
    getAccountFromMnemonic(code: string): Promise<AptosAccount>;
    getAccountFromMetaData(code: string, metaData: AccountMetaData): Promise<AptosAccount>;
    airdrop(address: string, amount: number): Promise<string[]>;
    getBalance(address: string | HexString): Promise<number>;
    accountTransactions(accountAddress: MaybeHexString): Promise<{
        data: any;
        from: any;
        gas: any;
        gasPrice: any;
        hash: any;
        success: any;
        timestamp: any;
        toAddress: any;
        price: any;
        type: any;
        version: any;
        vmStatus: any;
    }[]>;
    transfer(account: AptosAccount, recipient_address: string | HexString, amount: number): Promise<string>;
    getSentEvents(address: MaybeHexString): Promise<Types.OnChainTransaction[]>;
    getReceivedEvents(address: string): Promise<Types.Event[]>;
    createCollection(account: AptosAccount, name: string, description: string, uri: string): Promise<string>;
    createToken(account: AptosAccount, collection_name: string, name: string, description: string, supply: number, uri: string, royalty_points_per_million?: number): Promise<string>;
    offerToken(account: AptosAccount, receiver_address: string, creator_address: string, collection_name: string, token_name: string, amount: number): Promise<string>;
    cancelTokenOffer(account: AptosAccount, receiver_address: string, creator_address: string, collection_name: string, token_name: string): Promise<string>;
    claimToken(account: AptosAccount, sender_address: string, creator_address: string, collection_name: string, token_name: string): Promise<string>;
    signGenericTransaction(account: AptosAccount, func: string, args: string[], type_args: string[]): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
    signAndSubmitTransaction(account: AptosAccount, txnRequest: Types.UserTransactionRequest): Promise<string>;
    signTransaction(account: AptosAccount, txnRequest: Types.UserTransactionRequest): Promise<Types.SubmitTransactionRequest>;
    submitTransaction(signedTxn: Types.SubmitTransactionRequest): Promise<Types.PendingTransaction>;
    generateBCSTransaction(account: AptosAccount, rawTxn: RawTransaction): Promise<Uint8Array>;
    generateBCSSimulation(account: AptosAccount, rawTxn: RawTransaction): Promise<Uint8Array>;
    submitSignedBCSTransaction(signedTxn: Uint8Array): Promise<Types.PendingTransaction>;
    submitBCSSimulation(bcsBody: Uint8Array): Promise<Types.OnChainTransaction>;
    signMessage(account: AptosAccount, message: string): Promise<string>;
    rotateAuthKey(code: string, metaData: AccountMetaData): Promise<{
        authkey: string;
        success: boolean;
        vm_status: any;
    }>;
    getEventStream(address: string, eventHandleStruct: string, fieldName: string): Promise<any>;
    getTokenIds(address: string): Promise<any[]>;
    getTokens(address: string): Promise<any[]>;
    getToken(tokenId: TokenId): Promise<any>;
    getCollection(address: string, collectionName: string): Promise<any>;
    getCustomResource(address: string, resourceType: string, fieldName: string, keyType: string, valueType: string, key: any): Promise<any>;
    getAccountResource(accountAddress: string, resourceType: string): Promise<any>;
    /**
     * fungible tokens (coins)
     */
    initializeCoin(account: AptosAccount, coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    name: string, symbol: string, scaling_factor: number): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
    /** Registers the coin */
    registerCoin(account: AptosAccount, coin_type_path: string): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
    /** Mints the coin */
    mintCoin(account: AptosAccount, coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    dst_address: string, amount: number): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
    /** Transfers the coins */
    transferCoin(account: AptosAccount, coin_type_path: string, // coin_type_path: something like 0x${coinTypeAddress}::moon_coin::MoonCoin
    to_address: string, amount: number): Promise<{
        success: any;
        vm_status: any;
        txnHash: string;
    }>;
    getCoinData(coin_type_path: string): Promise<any>;
    getCoinBalance(address: string, coin_type_path: string): Promise<number>;
}
//# sourceMappingURL=wallet_client.d.ts.map