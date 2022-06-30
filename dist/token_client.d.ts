import { AptosAccount } from "./aptos_account";
import { AptosClient } from "./aptos_client";
import { Types } from "./types";
import { MaybeHexString } from "./hex_string";
export interface HashWithStatus {
    txnHash: string;
    success: string | boolean;
}
export declare class TokenClient {
    aptosClient: AptosClient;
    constructor(aptosClient: AptosClient);
    submitTransactionHelper(account: AptosAccount, payload: Types.TransactionPayload): Promise<string>;
    getTransactionStatus(txnHash: string): Promise<{
        success: any;
        vm_status: any;
    }>;
    createCollection(account: AptosAccount, name: string, description: string, uri: string): Promise<HashWithStatus>;
    createToken(account: AptosAccount, collectionName: string, name: string, description: string, supply: number, uri: string): Promise<HashWithStatus>;
    offerToken(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number): Promise<HashWithStatus>;
    claimToken(account: AptosAccount, sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<HashWithStatus>;
    cancelTokenOffer(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, tokenCreationNum: number): Promise<Types.HexEncodedBytes>;
    tableItem(handle: string, keyType: string, valueType: string, key: any): Promise<any>;
    /** Retrieve the token's creation_num, which is useful for non-creator operations */
    getTokenId(creator: string, collection_name: string, token_name: string): Promise<number>;
}
//# sourceMappingURL=token_client.d.ts.map