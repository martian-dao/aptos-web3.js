import { AnyNumber } from "../bcs/types";
import { MaybeHexString } from "../utils";
import { GetAccountTokensCountQuery, GetAccountCoinsDataQuery, GetAccountCurrentTokensQuery, GetAccountTransactionsCountQuery, GetAccountTransactionsDataQuery, GetNumberOfDelegatorsQuery, GetDelegatedStakingActivitiesQuery, GetIndexerLedgerInfoQuery, GetTokenActivitiesCountQuery, GetTokenActivitiesQuery, GetTokenDataQuery, GetTokenOwnersDataQuery, GetTopUserTransactionsQuery, GetUserTransactionsQuery } from "../indexer/generated/operations";
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
type GraphqlQuery = {
    query: string;
    variables?: {};
};
/**
 * Provides methods for retrieving data from Aptos Indexer.
 * For more detailed Queries specification see
 * {@link https://cloud.hasura.io/public/graphiql?endpoint=https://indexer.mainnet.aptoslabs.com/v1/graphql}
 */
export declare class IndexerClient {
    endpoint: string;
    /**
     * @param endpoint URL of the Aptos Indexer API endpoint.
     */
    constructor(endpoint: string);
    /**
     * Indexer only accepts address in the long format, i.e a 66 chars long -> 0x<64 chars>
     * This method makes sure address is 66 chars long.
     * @param address
     */
    static validateAddress(address: string): void;
    /**
     * Builds a axios client call to fetch data from Aptos Indexer.
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
     * @param tokenId Token ID
     * @returns GetTokenDataQuery response type
     */
    getTokenData(tokenId: string): Promise<GetTokenDataQuery>;
    /**
     * Queries token owners data
     *
     * @param tokenId Token ID
     * @param propertyVersion Property version
     * @returns GetTokenOwnersDataQuery response type
     */
    getTokenOwnersData(tokenId: string, propertyVersion: number): Promise<GetTokenOwnersDataQuery>;
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
}
export {};
//# sourceMappingURL=indexer.d.ts.map