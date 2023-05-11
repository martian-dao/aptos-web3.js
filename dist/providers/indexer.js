"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexerClient = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const queries_1 = require("../indexer/generated/queries");
/**
 * Provides methods for retrieving data from Aptos Indexer.
 * For more detailed Queries specification see
 * {@link https://cloud.hasura.io/public/graphiql?endpoint=https://indexer.mainnet.aptoslabs.com/v1/graphql}
 */
class IndexerClient {
    /**
     * @param endpoint URL of the Aptos Indexer API endpoint.
     */
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
    /**
     * Indexer only accepts address in the long format, i.e a 66 chars long -> 0x<64 chars>
     * This method makes sure address is 66 chars long.
     * @param address
     */
    static validateAddress(address) {
        if (address.length < 66) {
            throw new Error("Address needs to be 66 chars long.");
        }
    }
    /**
     * Builds a axios client call to fetch data from Aptos Indexer.
     *
     * @param graphqlQuery A GraphQL query to pass in the `data` axios call.
     */
    async queryIndexer(graphqlQuery) {
        const { data } = await axios_1.default.post(this.endpoint, graphqlQuery);
        if (data.errors) {
            throw new Error(`Indexer data error ${JSON.stringify(data.errors, null, " ")}`);
        }
        return data.data;
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
     * @param tokenId Token ID
     * @returns GetTokenDataQuery response type
     */
    async getTokenData(tokenId) {
        const graphqlQuery = {
            query: queries_1.GetTokenData,
            variables: { token_id: tokenId },
        };
        return this.queryIndexer(graphqlQuery);
    }
    /**
     * Queries token owners data
     *
     * @param tokenId Token ID
     * @param propertyVersion Property version
     * @returns GetTokenOwnersDataQuery response type
     */
    async getTokenOwnersData(tokenId, propertyVersion) {
        const graphqlQuery = {
            query: queries_1.GetTokenOwnersData,
            variables: { token_id: tokenId, property_version: propertyVersion },
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
}
exports.IndexerClient = IndexerClient;
//# sourceMappingURL=indexer.js.map