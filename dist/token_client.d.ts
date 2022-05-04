import { AptosAccount } from "./aptos_account";
import { AptosClient } from "./aptos_client";
import { Types } from "./types";
import { MaybeHexString } from "./hex_string";
export declare class TokenClient {
    aptosClient: AptosClient;
    constructor(aptosClient: AptosClient);
    submitTransactionHelper(account: AptosAccount, payload: Types.TransactionPayload): Promise<string>;
    createCollection(account: AptosAccount, name: string, description: string, uri: string): Promise<Types.HexEncodedBytes>;
    createToken(account: AptosAccount, collectionName: string, name: string, description: string, supply: number, uri: string): Promise<Types.HexEncodedBytes>;
    offerToken(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number): Promise<Types.HexEncodedBytes>;
    claimToken(account: AptosAccount, sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Types.HexEncodedBytes>;
    cancelTokenOffer(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, tokenCreationNum: number): Promise<Types.HexEncodedBytes>;
    tableItem(handle: string, keyType: string, valueType: string, key: any): Promise<any>;
    /** Retrieve the token's creation_num, which is useful for non-creator operations */
    getTokenId(creator: string, collection_name: string, token_name: string): Promise<number>;
}
//# sourceMappingURL=token_client.d.ts.map