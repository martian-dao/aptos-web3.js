import { AptosAccount } from './aptos_account';
import { AptosClient } from './aptos_client';
import { Types } from './types';
import { MaybeHexString } from './hex_string';
/**
 * Class for creating, minting and managing minting NFT collections and tokens
 */
export declare class TokenClient {
    aptosClient: AptosClient;
    /**
     * Creates new TokenClient instance
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient);
    /**
     * Brings together methods for generating, signing and submitting transaction
     * @param account AptosAccount which will sign a transaction
     * @param payload Transaction payload. It depends on transaction type you want to send
     * @returns Promise that resolves to transaction hash
     */
    submitTransactionHelper(account: AptosAccount, payload: Types.TransactionPayload, max_gas_amount?: string): Promise<string>;
    /**
     * Creates a new NFT collection within the specified account
     * @param account AptosAccount where collection will be created
     * @param name Collection name
     * @param description Collection description
     * @param uri URL to additional info about collection
     * @returns A hash of transaction
     */
    createCollection(account: AptosAccount, name: string, description: string, uri: string): Promise<Types.HexEncodedBytes>;
    /**
     * Creates a new NFT within the specified account
     * @param account AptosAccount where token will be created
     * @param collectionName Name of collection, that token belongs to
     * @param name Token name
     * @param description Token description
     * @param supply Token supply
     * @param uri URL to additional info about token
     * @param royalty_points_per_million the royal points to be provided to creator
     * @returns A hash of transaction
     */
    createToken(account: AptosAccount, collectionName: string, name: string, description: string, supply: number, uri: string, royalty_points_per_million: number): Promise<Types.HexEncodedBytes>;
    /**
     * Transfers specified amount of tokens from account to receiver
     * @param account AptosAccount where token from which tokens will be transfered
     * @param receiver  Hex-encoded 16 bytes Aptos account address to which tokens will be transfered
     * @param creator Hex-encoded 16 bytes Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @returns A hash of transaction
     */
    offerToken(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number): Promise<Types.HexEncodedBytes>;
    /**
     * Claims a token on specified account
     * @param account AptosAccount which will claim token
     * @param sender Hex-encoded 16 bytes Aptos account address which holds a token
     * @param creator Hex-encoded 16 bytes Aptos account address which created a token
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @returns A hash of transaction
     */
    claimToken(account: AptosAccount, sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Types.HexEncodedBytes>;
    /**
     * Removes a token from pending claims list
     * @param account AptosAccount which will remove token from pending list
     * @param receiver Hex-encoded 16 bytes Aptos account address which had to claim token
     * @param creator Hex-encoded 16 bytes Aptos account address which created a token
     * @param collectionName Name of collection where token is strored
     * @param name Token name
     * @returns A hash of transaction
     */
    cancelTokenOffer(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string): Promise<Types.HexEncodedBytes>;
    /**
     * Queries collection data
     * @param creator Hex-encoded 16 bytes Aptos account address which created a collection
     * @param collectionName Collection name
     * @returns Collection data in below format
     * ```
     *  Collection {
     *    // Describes the collection
     *    description: string,
     *    // Unique name within this creators account for this collection
     *    name: string,
     *    // URL for additional information/media
     *    uri: string,
     *    // Total number of distinct Tokens tracked by the collection
     *    count: number,
     *    // Optional maximum number of tokens allowed within this collections
     *    maximum: number
     *  }
     * ```
     */
    getCollectionData(creator: MaybeHexString, collectionName: string): Promise<any>;
    /**
     * Queries token data from collection
     * @param creator Hex-encoded 16 bytes Aptos account address which created a token
     * @param collectionName Name of collection, which holds a token
     * @param tokenName Token name
     * @returns Token data in below format
     * ```
     * TokenData {
     *     // Unique name within this creators account for this Token's collection
     *     collection: string;
     *     // Describes this Token
     *     description: string;
     *     // The name of this Token
     *     name: string;
     *     // Optional maximum number of this type of Token.
     *     maximum: number;
     *     // Total number of this type of Token
     *     supply: number;
     *     /// URL for additional information / media
     *     uri: string;
     *   }
     * ```
     */
    getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Types.TokenData>;
    /**
     * Queries token balance for the token creator
     * @deprecated Use getTokenBalanceForAccount instead
     */
    getTokenBalance(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<Types.Token>;
    /**
     * Queries token balance for a token account
     * @param account Hex-encoded 16 bytes Aptos account address which created a token
     * @param tokenId token id
     *
     * @example
     * ```
     * {
     *   creator: '0x1',
     *   collection: 'Some collection',
     *   name: 'Awesome token'
     * }
     * ```
     * @returns Token object in below format
     * ```
     * Token {
     *   id: TokenId;
     *   value: number;
     * }
     * ```
     */
    getTokenBalanceForAccount(account: MaybeHexString, tokenId: Types.TokenId): Promise<Types.Token>;
}
//# sourceMappingURL=token_client.d.ts.map