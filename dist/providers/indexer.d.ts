import { AnyNumber } from "../bcs/types";
import { MaybeHexString } from "../utils";
import { GetAccountTokensCountQuery, GetAccountCoinsDataQuery, GetAccountCurrentTokensQuery, GetAccountTransactionsCountQuery, GetAccountTransactionsDataQuery, GetNumberOfDelegatorsQuery, GetDelegatedStakingActivitiesQuery, GetIndexerLedgerInfoQuery, GetTokenActivitiesCountQuery, GetTokenActivitiesQuery, GetTokenDataQuery, GetTokenOwnersDataQuery, GetTopUserTransactionsQuery, GetUserTransactionsQuery, GetOwnedTokensQuery, GetTokenOwnedFromCollectionQuery, GetCollectionDataQuery, GetCollectionsWithOwnedTokensQuery, GetTokenCurrentOwnerDataQuery } from "../indexer/generated/operations";
import { ClientConfig } from "../client";
/**
 * Controls the number of results that are returned and the starting position of those results.
 * limit specifies the maximum number of items or records to return in a query result.
 * offset parameter specifies the starting position of the query result within the set of data.
 * For example, if you want to retrieve records 11-20,
 * you would set the offset parameter to 10 (i.e., the index of the first record to retrieve is 10)
 * and the limit parameter to 10 (i.e., the number of records to retrieve is 10))
 */
interface PaginationArgs {
    offset?: AnyNumber;
    limit?: number;
}
declare type TokenStandard = "v1" | "v2";
declare type GraphqlQuery = {
    query: string;
    variables?: {};
};
/**
 * Provides methods for retrieving data from Aptos Indexer.
 * For more detailed Queries specification see
 * {@link https://cloud.hasura.io/public/graphiql?endpoint=https://indexer.mainnet.aptoslabs.com/v1/graphql}
 */
export declare class IndexerClient {
    readonly endpoint: string;
    readonly config: ClientConfig | undefined;
    /**
     * @param endpoint URL of the Aptos Indexer API endpoint.
     */
    constructor(endpoint: string, config?: ClientConfig);
    /**
     * Indexer only accepts address in the long format, i.e a 66 chars long -> 0x<64 chars>
     * This method makes sure address is 66 chars long.
     * @param address
     */
    static validateAddress(address: string): void;
    /**
     * Makes axios client call to fetch data from Aptos Indexer.
     *
     * @param graphqlQuery A GraphQL query to pass in the `data` axios call.
     */
    queryIndexer<T>(graphqlQuery: GraphqlQuery): Promise<T>;
    /**
     * Queries Indexer Ledger Info
     *
     * @returns GetLedgerInfoQuery response type
     */
    getIndexerLedgerInfo(): Promise<GetIndexerLedgerInfoQuery>;
    /**
     * Queries an Aptos account's NFTs by owner address
     *
     * @param ownerAddress Hex-encoded 32 byte Aptos account address
     * @returns GetAccountCurrentTokensQuery response type
     */
    getAccountNFTs(ownerAddress: MaybeHexString, options?: PaginationArgs): Promise<GetAccountCurrentTokensQuery>;
    /**
     * Queries a token activities by token id hash
     *
     * @param idHash token id hash
     * @returns GetTokenActivitiesQuery response type
     */
    getTokenActivities(idHash: string, options?: PaginationArgs): Promise<GetTokenActivitiesQuery>;
    /**
     * Queries an account coin data
     *
     * @param ownerAddress Owner address
     * @returns GetAccountCoinsDataQuery response type
     */
    getAccountCoinsData(ownerAddress: MaybeHexString, options?: PaginationArgs): Promise<GetAccountCoinsDataQuery>;
    /**
     * Gets the count of tokens owned by an account
     *
     * @param ownerAddress Owner address
     * @returns AccountTokensCountQuery response type
     */
    getAccountTokensCount(ownerAddress: MaybeHexString): Promise<GetAccountTokensCountQuery>;
    /**
     * Gets the count of transactions submitted by an account
     *
     * @param address Account address
     * @returns GetAccountTransactionsCountQuery response type
     */
    getAccountTransactionsCount(accountAddress: MaybeHexString): Promise<GetAccountTransactionsCountQuery>;
    /**
     * Queries an account transactions data
     *
     * @param address Account address
     * @returns GetAccountTransactionsDataQuery response type
     */
    getAccountTransactionsData(accountAddress: MaybeHexString, options?: PaginationArgs): Promise<GetAccountTransactionsDataQuery>;
    /**
     * Queries delegated staking activities
     *
     * @param delegatorAddress Delegator address
     * @param poolAddress Pool address
     * @returns GetDelegatedStakingActivitiesQuery response type
     */
    getDelegatedStakingActivities(delegatorAddress: MaybeHexString, poolAddress: MaybeHexString): Promise<GetDelegatedStakingActivitiesQuery>;
    /**
     * Gets the count of token's activities
     *
     * @param tokenId Token ID
     * @returns GetTokenActivitiesCountQuery response type
     */
    getTokenActivitiesCount(tokenId: string): Promise<GetTokenActivitiesCountQuery>;
    /**
     * Queries token data
     *
     * @param tokenId Token ID address
     * @returns GetTokenDataQuery response type
     */
    getTokenData(tokenId: string, extraArgs?: {
        tokenStandard?: TokenStandard;
    }): Promise<GetTokenDataQuery>;
    /**
     * Queries token owners data. This query returns historical owners data
     * To fetch token v2 standard, pass in the optional `tokenStandard` parameter and
     * dont pass `propertyVersion` parameter (as propertyVersion only compatible with v1 standard)
     *
     * @param tokenId Token ID
     * @param propertyVersion Property version (optional) - only compatible with token v1 standard
     * @returns GetTokenOwnersDataQuery response type
     */
    getTokenOwnersData(tokenId: string, propertyVersion?: number, extraArgs?: {
        tokenStandard?: TokenStandard;
    }): Promise<GetTokenOwnersDataQuery>;
    /**
     * Queries token current owner data. This query returns the current token owner data.
     * To fetch token v2 standard, pass in the optional `tokenStandard` parameter and
     * dont pass `propertyVersion` parameter (as propertyVersion only compatible with v1 standard)
     *
     * @param tokenId Token ID
     * @param propertyVersion Property version (optional) - only compatible with token v1 standard
     * @returns GetTokenCurrentOwnerDataQuery response type
     */
    getTokenCurrentOwnerData(tokenId: string, propertyVersion?: number, extraArgs?: {
        tokenStandard?: TokenStandard;
    }): Promise<GetTokenCurrentOwnerDataQuery>;
    /**
     * Queries top user transactions
     *
     * @param limit
     * @returns GetTopUserTransactionsQuery response type
     */
    getTopUserTransactions(limit: number): Promise<GetTopUserTransactionsQuery>;
    /**
     * Queries top user transactions
     *
     * @returns GetUserTransactionsQuery response type
     */
    getUserTransactions(startVersion?: number, options?: PaginationArgs): Promise<GetUserTransactionsQuery>;
    /**
     * Queries current number of delegators in a pool
     *
     * @returns GetNumberOfDelegatorsQuery response type
     */
    getNumberOfDelegators(poolAddress: MaybeHexString): Promise<GetNumberOfDelegatorsQuery>;
    /**
     * Queries account's current owned tokens.
     * This query returns all tokens (v1 and v2 standards) an account owns, including NFTs, fungible, soulbound, etc.
     * If you want to get only the token from a specific standrd, you can pass an optional tokenStandard param
     * @example An example of how to pass a specific token standard
     * ```
     * {
     *    tokenStandard:"v2"
     * }
     * ```
     * @param ownerAddress The token owner address we want to get the tokens for
     * @returns GetOwnedTokensQuery response type
     */
    getOwnedTokens(ownerAddress: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: PaginationArgs;
    }): Promise<GetOwnedTokensQuery>;
    /**
     * Queries all tokens of a specific collection that an account owns by the collection address
     *
     * @param ownerAddress owner address that owns the tokens
     * @param collectionAddress the collection address
     * @returns GetTokenOwnedFromCollectionQuery response type
     */
    getTokenOwnedFromCollectionAddress(ownerAddress: MaybeHexString, collectionAddress: string, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: PaginationArgs;
    }): Promise<GetTokenOwnedFromCollectionQuery>;
    /**
     * Queries all tokens of a specific collection that an account owns by the collection name and collection
     * creator address
     *
     * @param ownerAddress owner address that owns the tokens
     * @param collectionName the collection name
     * @param creatorAddress the collection creator address
     * @returns GetTokenOwnedFromCollectionQuery response type
     */
    getTokenOwnedFromCollectionNameAndCreatorAddress(ownerAddress: MaybeHexString, collectionName: string, creatorAddress: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: PaginationArgs;
    }): Promise<GetTokenOwnedFromCollectionQuery>;
    /**
     * Queries data of a specific collection by the collection creator address and the collection name.
     *
     * if, for some reason, a creator account has 2 collections with the same name in v1 and v2,
     * can pass an optional `tokenStandard` parameter to query a specific standard
     *
     * @param creatorAddress the collection creator address
     * @param collectionName the collection name
     * @returns GetCollectionDataQuery response type
     */
    getCollectionData(creatorAddress: MaybeHexString, collectionName: string, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: PaginationArgs;
    }): Promise<GetCollectionDataQuery>;
    /**
     * Queries a collection address.
     *
     * @param creatorAddress the collection creator address
     * @param collectionName the collection name
     * @returns the collection address
     */
    getCollectionAddress(creatorAddress: MaybeHexString, collectionName: string, extraArgs?: {
        tokenStandard?: TokenStandard;
    }): Promise<string>;
    /**
     * Queries for all collections that an account has tokens for.
     *
     * @param ownerAddress the account address that owns the tokens
     * @returns GetCollectionsWithOwnedTokensQuery response type
     */
    getCollectionsWithOwnedTokens(ownerAddress: MaybeHexString, extraArgs?: {
        tokenStandard?: TokenStandard;
        options?: PaginationArgs;
    }): Promise<GetCollectionsWithOwnedTokensQuery>;
}
export {};
//# sourceMappingURL=indexer.d.ts.map