"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenClient = void 0;
const hex_string_1 = require("./hex_string");
/**
 * Class for creating, minting and managing minting NFT collections and tokens
 */
class TokenClient {
    /**
     * Creates new TokenClient instance
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient) {
        this.aptosClient = aptosClient;
    }
    /**
     * Brings together methods for generating, signing and submitting transaction
     * @param account AptosAccount which will sign a transaction
     * @param payload Transaction payload. It depends on transaction type you want to send
     * @returns Promise that resolves to transaction hash
     */
    async submitTransactionHelper(account, payload, max_gas_amount = "4000") {
        const txnRequest = await this.aptosClient.generateTransaction(account.address(), payload, {
            max_gas_amount: max_gas_amount,
        });
        const signedTxn = await this.aptosClient.signTransaction(account, txnRequest);
        const res = await this.aptosClient.submitTransaction(signedTxn);
        await this.aptosClient.waitForTransaction(res.hash);
        return Promise.resolve(res.hash);
    }
    /**
     * Creates a new NFT collection within the specified account
     * @param account AptosAccount where collection will be created
     * @param name Collection name
     * @param description Collection description
     * @param uri URL to additional info about collection
     * @returns A hash of transaction
     */
    async createCollection(account, name, description, uri) {
        const payload = {
            type: 'script_function_payload',
            function: '0x1::Token::create_unlimited_collection_script',
            type_arguments: [],
            arguments: [
                Buffer.from(name).toString('hex'),
                Buffer.from(description).toString('hex'),
                Buffer.from(uri).toString('hex'),
            ],
        };
        const transactionHash = await this.submitTransactionHelper(account, payload);
        return transactionHash;
    }
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
    async createToken(account, collectionName, name, description, supply, uri, royalty_points_per_million) {
        const payload = {
            type: 'script_function_payload',
            function: '0x1::Token::create_unlimited_token_script',
            type_arguments: [],
            arguments: [
                Buffer.from(collectionName).toString('hex'),
                Buffer.from(name).toString('hex'),
                Buffer.from(description).toString('hex'),
                true,
                supply.toString(),
                Buffer.from(uri).toString('hex'),
                royalty_points_per_million.toString(),
            ],
        };
        const transactionHash = await this.submitTransactionHelper(account, payload);
        return transactionHash;
    }
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
    async offerToken(account, receiver, creator, collectionName, name, amount) {
        const payload = {
            type: 'script_function_payload',
            function: '0x1::TokenTransfers::offer_script',
            type_arguments: [],
            arguments: [
                receiver,
                creator,
                Buffer.from(collectionName).toString('hex'),
                Buffer.from(name).toString('hex'),
                amount.toString(),
            ],
        };
        const transactionHash = await this.submitTransactionHelper(account, payload);
        return transactionHash;
    }
    /**
     * Claims a token on specified account
     * @param account AptosAccount which will claim token
     * @param sender Hex-encoded 16 bytes Aptos account address which holds a token
     * @param creator Hex-encoded 16 bytes Aptos account address which created a token
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @returns A hash of transaction
     */
    async claimToken(account, sender, creator, collectionName, name) {
        const payload = {
            type: 'script_function_payload',
            function: '0x1::TokenTransfers::claim_script',
            type_arguments: [],
            arguments: [sender, creator, Buffer.from(collectionName).toString('hex'), Buffer.from(name).toString('hex')],
        };
        const transactionHash = await this.submitTransactionHelper(account, payload);
        return transactionHash;
    }
    /**
     * Removes a token from pending claims list
     * @param account AptosAccount which will remove token from pending list
     * @param receiver Hex-encoded 16 bytes Aptos account address which had to claim token
     * @param creator Hex-encoded 16 bytes Aptos account address which created a token
     * @param collectionName Name of collection where token is strored
     * @param name Token name
     * @returns A hash of transaction
     */
    async cancelTokenOffer(account, receiver, creator, collectionName, name) {
        const payload = {
            type: 'script_function_payload',
            function: '0x1::TokenTransfers::cancel_offer_script',
            type_arguments: [],
            arguments: [receiver, creator, Buffer.from(collectionName).toString('hex'), Buffer.from(name).toString('hex')],
        };
        const transactionHash = await this.submitTransactionHelper(account, payload);
        return transactionHash;
    }
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
    async getCollectionData(creator, collectionName) {
        const resources = await this.aptosClient.getAccountResources(creator);
        const accountResource = resources.find((r) => r.type === '0x1::Token::Collections');
        const { handle } = accountResource.data.collections;
        const getCollectionTableItemRequest = {
            key_type: '0x1::ASCII::String',
            value_type: '0x1::Token::Collection',
            key: collectionName,
        };
        // eslint-disable-next-line no-unused-vars
        const collectionTable = await this.aptosClient.getTableItem(handle, getCollectionTableItemRequest);
        return collectionTable;
    }
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
    async getTokenData(creator, collectionName, tokenName) {
        const collection = await this.aptosClient.getAccountResource(creator, '0x1::Token::Collections');
        const { handle } = collection.data.token_data;
        const tokenId = {
            creator,
            collection: collectionName,
            name: tokenName,
        };
        const getTokenTableItemRequest = {
            key_type: '0x1::Token::TokenId',
            value_type: '0x1::Token::TokenData',
            key: tokenId,
        };
        const tableItem = await this.aptosClient.getTableItem(handle, getTokenTableItemRequest);
        return tableItem.data;
    }
    /**
     * Queries token balance for the token creator
     * @deprecated Use getTokenBalanceForAccount instead
     */
    async getTokenBalance(creator, collectionName, tokenName) {
        return this.getTokenBalanceForAccount(creator, {
            creator: creator instanceof hex_string_1.HexString ? creator.hex() : creator,
            collection: collectionName,
            name: tokenName,
        });
    }
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
    async getTokenBalanceForAccount(account, tokenId) {
        const tokenStore = await this.aptosClient.getAccountResource(account, '0x1::Token::TokenStore');
        const { handle } = tokenStore.data.tokens;
        const getTokenTableItemRequest = {
            key_type: '0x1::Token::TokenId',
            value_type: '0x1::Token::Token',
            key: tokenId,
        };
        const tableItem = await this.aptosClient.getTableItem(handle, getTokenTableItemRequest);
        return tableItem.data;
    }
}
exports.TokenClient = TokenClient;
//# sourceMappingURL=token_client.js.map