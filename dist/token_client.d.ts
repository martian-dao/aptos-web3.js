import { AptosAccount } from "./aptos_account";
import { AptosClient, OptionalTransactionArgs } from "./aptos_client";
import * as TokenTypes from "./token_types";
import { MaybeHexString } from "./hex_string";
import { TransactionBuilderABI } from "./transaction_builder";
import { AnyNumber } from "./bcs";
/**
 * Class for creating, minting and managing minting NFT collections and tokens
 */
export declare class TokenClient {
    aptosClient: AptosClient;
    transactionBuilder: TransactionBuilderABI;
    /**
     * Creates new TokenClient instance
     *
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient: AptosClient);
    /**
     * Creates a new NFT collection within the specified account
     *
     * @param account AptosAccount where collection will be created
     * @param name Collection name
     * @param description Collection description
     * @param uri URL to additional info about collection
     * @param maxAmount Maximum number of `token_data` allowed within this collection
     * @returns The hash of the transaction submitted to the API
     */
    createCollection(account: AptosAccount, name: string, description: string, uri: string, maxAmount?: AnyNumber, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Creates a new NFT within the specified account
     *
     * @param account AptosAccount where token will be created
     * @param collectionName Name of collection, that token belongs to
     * @param name Token name
     * @param description Token description
     * @param supply Token supply
     * @param uri URL to additional info about token
     * @param max The maxium of tokens can be minted from this token
     * @param royalty_payee_address the address to receive the royalty, the address can be a shared account address.
     * @param royalty_points_denominator the denominator for calculating royalty
     * @param royalty_points_numerator the numerator for calculating royalty
     * @param property_keys the property keys for storing on-chain properties
     * @param property_values the property values to be stored on-chain
     * @param property_types the type of property values
     * @returns The hash of the transaction submitted to the API
     */
    createToken(account: AptosAccount, collectionName: string, name: string, description: string, supply: number, uri: string, max?: AnyNumber, royalty_payee_address?: MaybeHexString, royalty_points_denominator?: number, royalty_points_numerator?: number, property_keys?: Array<string>, property_values?: Array<string>, property_types?: Array<string>, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Transfers specified amount of tokens from account to receiver
     *
     * @param account AptosAccount where token from which tokens will be transfered
     * @param receiver  Hex-encoded 32 byte Aptos account address to which tokens will be transfered
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    offerToken(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, amount: number, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Claims a token on specified account
     *
     * @param account AptosAccount which will claim token
     * @param sender Hex-encoded 32 byte Aptos account address which holds a token
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    claimToken(account: AptosAccount, sender: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Removes a token from pending claims list
     *
     * @param account AptosAccount which will remove token from pending list
     * @param receiver Hex-encoded 32 byte Aptos account address which had to claim token
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection where token is strored
     * @param name Token name
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    cancelTokenOffer(account: AptosAccount, receiver: MaybeHexString, creator: MaybeHexString, collectionName: string, name: string, property_version?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Directly transfer the specified amount of tokens from account to receiver
     * using a single multi signature transaction.
     *
     * @param sender AptosAccount where token from which tokens will be transfered
     * @param receiver Hex-encoded 32 byte Aptos account address to which tokens will be transfered
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns The hash of the transaction submitted to the API
     */
    directTransferToken(sender: AptosAccount, receiver: AptosAccount, creator: MaybeHexString, collectionName: string, name: string, amount: number, propertyVersion?: number, extraArgs?: OptionalTransactionArgs): Promise<string>;
    /**
     * Queries collection data
     * @param creator Hex-encoded 32 byte Aptos account address which created a collection
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
     *
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
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
    getTokenData(creator: MaybeHexString, collectionName: string, tokenName: string): Promise<TokenTypes.TokenData>;
    /**
     * Queries token balance for the token creator
     */
    getToken(creator: MaybeHexString, collectionName: string, tokenName: string, property_version?: string): Promise<TokenTypes.Token>;
    /**
     * Queries token balance for a token account
     * @param account Hex-encoded 32 byte Aptos account address which created a token
     * @param tokenId token id
     *
     * TODO: Update this:
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
    getTokenForAccount(account: MaybeHexString, tokenId: TokenTypes.TokenId): Promise<TokenTypes.Token>;
}
//# sourceMappingURL=token_client.d.ts.map