"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexerClient = void 0;
const utils_1 = require("../utils");
const queries_1 = require("../indexer/generated/queries");
const client_1 = require("../client");
const aptos_client_1 = require("./aptos_client");
/**
 * Provides methods for retrieving data from Aptos Indexer.
 * For more detailed Queries specification see
 * {@link https://cloud.hasura.io/public/graphiql?endpoint=https://indexer.mainnet.aptoslabs.com/v1/graphql}
 */
class IndexerClient {
    /**
     * @param endpoint URL of the Aptos Indexer API endpoint.
     */
    constructor(endpoint, config) {
        this.endpoint = endpoint;
        this.config = config;
    }
    /**
     * Indexer only accepts address in the long format, i.e a 66 chars long -> 0x<64 chars>
     * This method makes sure address is 66 chars long.
     * @param address
     */
    static validateAddress(address) {
        if (address.length < 66) {
            throw new Error(`${address} is less than 66 chars long.`);
        }
    }
    /**
     * Makes axios client call to fetch data from Aptos Indexer.
     *
     * @param graphqlQuery A GraphQL query to pass in the `data` axios call.
     */
    async queryIndexer(graphqlQuery) {
        const response = await (0, client_1.post)({
            url: this.endpoint,
            body: graphqlQuery,
            overrides: { WITH_CREDENTIALS: false, ...this.config },
        });
        if (response.data.errors) {
            throw new aptos_client_1.ApiError(response.data.errors[0].extensions.code, JSON.stringify({
                message: response.data.errors[0].message,
                error_code: response.data.errors[0].extensions.code,
            }));
        }
        return response.data.data;
    }
    /**
     * Queries Indexer Ledger Info
     *
     * @returns GetLedgerInfoQuery response type
     */
    async getIndexerLedgerInfo() {
        const graphqlQuery = {
            query: queries_1.GetIndexerLedgerInfo,
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries an Aptos account's NFTs by owner address
     *
     * @param ownerAddress Hex-encoded 32 byte Aptos account address
     * @returns GetAccountCurrentTokensQuery response type
     */
    async getAccountNFTs(ownerAddress, options) {
        const address = utils_1.HexString.ensure(ownerAddress).hex();
        IndexerClient.validateAddress(address);
        const graphqlQuery = {
            query: queries_1.GetAccountCurrentTokens,
            variables: { address, offset: options?.offset, limit: options?.limit },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries a token activities by token id hash
     *
     * @param idHash token id hash
     * @returns GetTokenActivitiesQuery response type
     */
    async getTokenActivities(idHash, options) {
        const graphqlQuery = {
            query: queries_1.GetTokenActivities,
            variables: { idHash, offset: options?.offset, limit: options?.limit },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries an account coin data
     *
     * @param ownerAddress Owner address
     * @returns GetAccountCoinsDataQuery response type
     */
    async getAccountCoinsData(ownerAddress, options) {
        const address = utils_1.HexString.ensure(ownerAddress).hex();
        IndexerClient.validateAddress(address);
        const graphqlQuery = {
            query: queries_1.GetAccountCoinsData,
            variables: { owner_address: address, offset: options?.offset, limit: options?.limit },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Gets the count of tokens owned by an account
     *
     * @param ownerAddress Owner address
     * @returns AccountTokensCountQuery response type
     */
    async getAccountTokensCount(ownerAddress) {
        const address = utils_1.HexString.ensure(ownerAddress).hex();
        IndexerClient.validateAddress(address);
        const graphqlQuery = {
            query: queries_1.GetAccountTokensCount,
            variables: { owner_address: address },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Gets the count of transactions submitted by an account
     *
     * @param address Account address
     * @returns GetAccountTransactionsCountQuery response type
     */
    async getAccountTransactionsCount(accountAddress) {
        const address = utils_1.HexString.ensure(accountAddress).hex();
        IndexerClient.validateAddress(address);
        const graphqlQuery = {
            query: queries_1.GetAccountTransactionsCount,
            variables: { address },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries an account transactions data
     *
     * @param address Account address
     * @returns GetAccountTransactionsDataQuery response type
     */
    async getAccountTransactionsData(accountAddress, options) {
        const address = utils_1.HexString.ensure(accountAddress).hex();
        IndexerClient.validateAddress(address);
        const graphqlQuery = {
            query: queries_1.GetAccountTransactionsData,
            variables: { address, offset: options?.offset, limit: options?.limit },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries delegated staking activities
     *
     * @param delegatorAddress Delegator address
     * @param poolAddress Pool address
     * @returns GetDelegatedStakingActivitiesQuery response type
     */
    async getDelegatedStakingActivities(delegatorAddress, poolAddress) {
        const delegator = utils_1.HexString.ensure(delegatorAddress).hex();
        const pool = utils_1.HexString.ensure(poolAddress).hex();
        IndexerClient.validateAddress(delegator);
        IndexerClient.validateAddress(pool);
        const graphqlQuery = {
            query: queries_1.GetDelegatedStakingActivities,
            variables: {
                delegatorAddress: delegator,
                poolAddress: pool,
            },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Gets the count of token's activities
     *
     * @param tokenId Token ID
     * @returns GetTokenActivitiesCountQuery response type
     */
    async getTokenActivitiesCount(tokenId) {
        const graphqlQuery = {
            query: queries_1.GetTokenActivitiesCount,
            variables: { token_id: tokenId },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries token data
     *
     * @param tokenId Token ID address
     * @returns GetTokenDataQuery response type
     */
    async getTokenData(tokenId, extraArgs) {
        const tokenAddress = utils_1.HexString.ensure(tokenId).hex();
        IndexerClient.validateAddress(tokenAddress);
        const whereCondition = {
            token_data_id: { _eq: tokenAddress },
        };
        if (extraArgs?.tokenStandard) {
            whereCondition.token_standard = { _eq: extraArgs?.tokenStandard };
        }
        const graphqlQuery = {
            query: queries_1.GetTokenData,
            variables: { where_condition: whereCondition },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries token owners data. This query returns historical owners data
     * To fetch token v2 standard, pass in the optional `tokenStandard` parameter and
     * dont pass `propertyVersion` parameter (as propertyVersion only compatible with v1 standard)
     *
     * @param tokenId Token ID
     * @param propertyVersion Property version (optional) - only compatible with token v1 standard
     * @returns GetTokenOwnersDataQuery response type
     */
    async getTokenOwnersData(tokenId, propertyVersion, extraArgs) {
        const tokenAddress = utils_1.HexString.ensure(tokenId).hex();
        IndexerClient.validateAddress(tokenAddress);
        const whereCondition = {
            token_data_id: { _eq: tokenAddress },
        };
        if (propertyVersion) {
            whereCondition.property_version_v1 = { _eq: propertyVersion };
        }
        if (extraArgs?.tokenStandard) {
            whereCondition.token_standard = { _eq: extraArgs?.tokenStandard };
        }
        const graphqlQuery = {
            query: queries_1.GetTokenOwnersData,
            variables: { where_condition: whereCondition },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries token current owner data. This query returns the current token owner data.
     * To fetch token v2 standard, pass in the optional `tokenStandard` parameter and
     * dont pass `propertyVersion` parameter (as propertyVersion only compatible with v1 standard)
     *
     * @param tokenId Token ID
     * @param propertyVersion Property version (optional) - only compatible with token v1 standard
     * @returns GetTokenCurrentOwnerDataQuery response type
     */
    async getTokenCurrentOwnerData(tokenId, propertyVersion, extraArgs) {
        const tokenAddress = utils_1.HexString.ensure(tokenId).hex();
        IndexerClient.validateAddress(tokenAddress);
        const whereCondition = {
            token_data_id: { _eq: tokenAddress },
            amount: { _gt: "0" },
        };
        if (propertyVersion) {
            whereCondition.property_version_v1 = { _eq: propertyVersion };
        }
        if (extraArgs?.tokenStandard) {
            whereCondition.token_standard = { _eq: extraArgs?.tokenStandard };
        }
        const graphqlQuery = {
            query: queries_1.GetTokenCurrentOwnerData,
            variables: { where_condition: whereCondition },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries top user transactions
     *
     * @param limit
     * @returns GetTopUserTransactionsQuery response type
     */
    async getTopUserTransactions(limit) {
        const graphqlQuery = {
            query: queries_1.GetTopUserTransactions,
            variables: { limit },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries top user transactions
     *
     * @returns GetUserTransactionsQuery response type
     */
    async getUserTransactions(startVersion, options) {
        const graphqlQuery = {
            query: queries_1.GetUserTransactions,
            variables: { start_version: startVersion, offset: options?.offset, limit: options?.limit },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries current number of delegators in a pool
     *
     * @returns GetNumberOfDelegatorsQuery response type
     */
    async getNumberOfDelegators(poolAddress) {
        const address = utils_1.HexString.ensure(poolAddress).hex();
        IndexerClient.validateAddress(address);
        const graphqlQuery = {
            query: queries_1.GetNumberOfDelegators,
            variables: { poolAddress: address },
        };
        return this.queryIndexer(graphqlQuery);
    }
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
    async getOwnedTokens(ownerAddress, extraArgs) {
        const address = utils_1.HexString.ensure(ownerAddress).hex();
        IndexerClient.validateAddress(address);
        const whereCondition = {
            owner_address: { _eq: address },
            amount: { _gt: 0 },
        };
        if (extraArgs?.tokenStandard) {
            whereCondition.token_standard = { _eq: extraArgs?.tokenStandard };
        }
        const graphqlQuery = {
            query: queries_1.GetOwnedTokens,
            variables: {
                where_condition: whereCondition,
                offset: extraArgs?.options?.offset,
                limit: extraArgs?.options?.limit,
            },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries all tokens of a specific collection that an account owns by the collection address
     *
     * @param ownerAddress owner address that owns the tokens
     * @param collectionAddress the collection address
     * @returns GetTokenOwnedFromCollectionQuery response type
     */
    async getTokenOwnedFromCollectionAddress(ownerAddress, collectionAddress, extraArgs) {
        const ownerHexAddress = utils_1.HexString.ensure(ownerAddress).hex();
        IndexerClient.validateAddress(ownerHexAddress);
        const collectionHexAddress = utils_1.HexString.ensure(collectionAddress).hex();
        IndexerClient.validateAddress(collectionHexAddress);
        const whereCondition = {
            owner_address: { _eq: ownerHexAddress },
            current_token_data: { collection_id: { _eq: collectionHexAddress } },
            amount: { _gt: 0 },
        };
        if (extraArgs?.tokenStandard) {
            whereCondition.token_standard = { _eq: extraArgs?.tokenStandard };
        }
        const graphqlQuery = {
            query: queries_1.GetTokenOwnedFromCollection,
            variables: {
                where_condition: whereCondition,
                offset: extraArgs?.options?.offset,
                limit: extraArgs?.options?.limit,
            },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries all tokens of a specific collection that an account owns by the collection name and collection
     * creator address
     *
     * @param ownerAddress owner address that owns the tokens
     * @param collectionName the collection name
     * @param creatorAddress the collection creator address
     * @returns GetTokenOwnedFromCollectionQuery response type
     */
    async getTokenOwnedFromCollectionNameAndCreatorAddress(ownerAddress, collectionName, creatorAddress, extraArgs) {
        const collectionAddress = await this.getCollectionAddress(creatorAddress, collectionName, extraArgs);
        const tokens = await this.getTokenOwnedFromCollectionAddress(ownerAddress, collectionAddress, extraArgs);
        return tokens;
    }
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
    async getCollectionData(creatorAddress, collectionName, extraArgs) {
        const address = utils_1.HexString.ensure(creatorAddress).hex();
        IndexerClient.validateAddress(address);
        const whereCondition = {
            collection_name: { _eq: collectionName },
            creator_address: { _eq: address },
        };
        if (extraArgs?.tokenStandard) {
            whereCondition.token_standard = { _eq: extraArgs?.tokenStandard };
        }
        const graphqlQuery = {
            query: queries_1.GetCollectionData,
            variables: {
                where_condition: whereCondition,
                offset: extraArgs?.options?.offset,
                limit: extraArgs?.options?.limit,
            },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries a collection address.
     *
     * @param creatorAddress the collection creator address
     * @param collectionName the collection name
     * @returns the collection address
     */
    async getCollectionAddress(creatorAddress, collectionName, extraArgs) {
        return (await this.getCollectionData(creatorAddress, collectionName, extraArgs)).current_collections_v2[0]
            .collection_id;
    }
    /**
     * Queries for all collections that an account has tokens for.
     *
     * @param ownerAddress the account address that owns the tokens
     * @returns GetCollectionsWithOwnedTokensQuery response type
     */
    async getCollectionsWithOwnedTokens(ownerAddress, extraArgs) {
        const ownerHexAddress = utils_1.HexString.ensure(ownerAddress).hex();
        IndexerClient.validateAddress(ownerHexAddress);
        const whereCondition = {
            owner_address: { _eq: ownerHexAddress },
        };
        if (extraArgs?.tokenStandard) {
            whereCondition.current_collection = { token_standard: { _eq: extraArgs?.tokenStandard } };
        }
        const graphqlQuery = {
            query: queries_1.GetCollectionsWithOwnedTokens,
            variables: {
                where_condition: whereCondition,
                offset: extraArgs?.options?.offset,
                limit: extraArgs?.options?.limit,
            },
        };
        return this.queryIndexer(graphqlQuery);
    }
}
exports.IndexerClient = IndexerClient;
//# sourceMappingURL=indexer.js.map