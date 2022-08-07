"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenClient = void 0;
const hex_string_1 = require("./hex_string");
const NUMBER_MAX = 9007199254740991;
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
    async submitTransactionHelper(account, payload, options = { max_gas_amount: "4000" }) {
        const txnRequest = await this.aptosClient.generateTransaction(account.address(), payload, options);
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
            type: "script_function_payload",
            function: "0x3::token::create_collection_script",
            type_arguments: [],
            arguments: [
                name,
                description,
                uri,
                NUMBER_MAX.toString(),
                [false, false, false],
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
     * @param max The maxium of tokens can be minted from this token
     * @param royalty_payee_address the address to receive the royalty, the address can be a shared account address.
     * @param royalty_points_denominator the denominator for calculating royalty
     * @param royalty_points_numerator the numerator for calculating royalty
     * @param property_keys the property keys for storing on-chain properties
     * @param property_values the property values to be stored on-chain
     * @param property_types the type of property values
     * @returns A hash of transaction
     */
    async createToken(account, collectionName, name, description, supply, uri, royalty_payee_address = account.address(), royalty_points_denominator = 0, royalty_points_numerator = 0, property_keys = [], property_values = [], property_types = []) {
        const payload = {
            type: "script_function_payload",
            function: "0x3::token::create_token_script",
            type_arguments: [],
            arguments: [
                collectionName,
                name,
                description,
                supply.toString(),
                NUMBER_MAX.toString(),
                uri,
                royalty_payee_address.toString(),
                royalty_points_denominator.toString(),
                royalty_points_numerator.toString(),
                [false, false, false, false, false],
                property_keys,
                property_values,
                property_types,
            ],
        };
        const transactionHash = await this.submitTransactionHelper(account, payload);
        return transactionHash;
    }
    /**
     * Transfers specified amount of tokens from account to receiver
     * @param account AptosAccount where token from which tokens will be transfered
     * @param receiver  Hex-encoded 32 byte Aptos account address to which tokens will be transfered
     * @param creator Hex-encoded 32 byte Aptos account address to which created tokens
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param amount Amount of tokens which will be transfered
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns A hash of transaction
     */
    async offerToken(account, receiver, creator, collectionName, name, amount, property_version = 0) {
        const payload = {
            type: "script_function_payload",
            function: "0x3::token_transfers::offer_script",
            type_arguments: [],
            arguments: [
                receiver,
                creator,
                collectionName,
                name,
                property_version.toString(),
                amount.toString(),
            ],
        };
        const transactionHash = await this.submitTransactionHelper(account, payload);
        return transactionHash;
    }
    /**
     * Claims a token on specified account
     * @param account AptosAccount which will claim token
     * @param sender Hex-encoded 32 byte Aptos account address which holds a token
     * @param creator Hex-encoded 32 byte Aptos account address which created a token
     * @param collectionName Name of collection where token is stored
     * @param name Token name
     * @param property_version the version of token PropertyMap with a default value 0.
     * @returns A hash of transaction
     */
    async claimToken(account, sender, creator, collectionName, name, property_version = 0) {
        const payload = {
            type: "script_function_payload",
            function: "0x3::token_transfers::claim_script",
            type_arguments: [],
            arguments: [sender, creator, collectionName, name, property_version.toString()],
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
    async cancelTokenOffer(account, receiver, creator, collectionName, name, property_version = 0) {
        const payload = {
            type: "script_function_payload",
            function: "0x3::token_transfers::cancel_offer_script",
            type_arguments: [],
            arguments: [receiver, creator, collectionName, name, property_version.toString()],
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
        const accountResource = resources.find((r) => r.type === "0x3::token::Collections");
        const { handle } = accountResource.data.collection_data;
        const getCollectionTableItemRequest = {
            key_type: "0x1::string::String",
            value_type: "0x3::token::Collection",
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
        const collection = await this.aptosClient.getAccountResource(creator, "0x3::token::Collections");
        const { handle } = collection.data.token_data;
        const tokenId = {
            creator,
            collection: collectionName,
            name: Buffer.from(tokenName).toString("hex"),
        };
        const getTokenTableItemRequest = {
            key_type: "0x3::token::TokenDataId",
            value_type: "0x3::token::TokenData",
            key: tokenId,
        };
        const tableItem = await this.aptosClient.getTableItem(handle, getTokenTableItemRequest);
        return tableItem.data;
    }
    /**
     * Queries token balance for the token creator
     * @deprecated Use getTokenBalanceForAccount instead
     */
    async getTokenBalance(creator, collectionName, tokenName, property_version = "0") {
        const tokenDataId = {
            creator: creator instanceof hex_string_1.HexString ? creator.hex() : creator,
            collection: collectionName,
            name: tokenName,
        };
        return this.getTokenBalanceForAccount(creator, {
            token_data_id: tokenDataId,
            property_version,
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
        const tokenStore = await this.aptosClient.getAccountResource(account, "0x3::token::TokenStore");
        const { handle } = tokenStore.data.tokens;
        const getTokenTableItemRequest = {
            key_type: "0x3::token::TokenId",
            value_type: "0x3::token::Token",
            key: tokenId,
        };
        const tableItem = await this.aptosClient.getTableItem(handle, getTokenTableItemRequest);
        return tableItem.data;
    }
}
exports.TokenClient = TokenClient;
//# sourceMappingURL=token_client.js.map