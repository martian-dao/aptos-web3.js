"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenClient = void 0;
const hex_string_1 = require("./hex_string");
const transaction_builder_1 = require("./transaction_builder");
const consts_1 = require("./bcs/consts");
const abis_1 = require("./abis");
const bcs_1 = require("./bcs");
/**
 * Class for creating, minting and managing minting NFT collections and tokens
 */
class TokenClient {
    /**
     * Creates new TokenClient instance
     *
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient) {
        this.aptosClient = aptosClient;
        this.transactionBuilder = new transaction_builder_1.TransactionBuilderABI(abis_1.TOKEN_ABIS.map((abi) => new hex_string_1.HexString(abi).toUint8Array()));
    }
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
    // :!:>createCollection
    async createCollection(account, name, description, uri, maxAmount = consts_1.MAX_U64_BIG_INT, extraArgs) {
        // <:!:createCollection
        const payload = this.transactionBuilder.buildTransactionPayload("0x3::token::create_collection_script", [], [name, description, uri, maxAmount, [false, false, false]]);
        const txn = await this.aptosClient.generateSignSubmitWaitForTransaction(account, payload, extraArgs);
        return txn.hash;
    }
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
    // :!:>createToken
    async createToken(account, collectionName, name, description, supply, uri, max = consts_1.MAX_U64_BIG_INT, royalty_payee_address = account.address(), royalty_points_denominator = 0, royalty_points_numerator = 0, property_keys = [], property_values = [], property_types = [], extraArgs) {
        // <:!:createToken
        const payload = this.transactionBuilder.buildTransactionPayload("0x3::token::create_token_script", [], [
            collectionName,
            name,
            description,
            supply,
            max,
            uri,
            royalty_payee_address,
            royalty_points_denominator,
            royalty_points_numerator,
            [false, false, false, false, false],
            property_keys,
            property_values,
            property_types,
        ]);
        const txn = await this.aptosClient.generateSignSubmitWaitForTransaction(account, payload, extraArgs);
        return txn.hash;
    }
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
    async offerToken(account, receiver, creator, collectionName, name, amount, property_version = 0, extraArgs) {
        const payload = this.transactionBuilder.buildTransactionPayload("0x3::token_transfers::offer_script", [], [receiver, creator, collectionName, name, property_version, amount]);
        const txn = await this.aptosClient.generateSignSubmitWaitForTransaction(account, payload, extraArgs);
        return txn.hash;
    }
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
    async claimToken(account, sender, creator, collectionName, name, property_version = 0, extraArgs) {
        const payload = this.transactionBuilder.buildTransactionPayload("0x3::token_transfers::claim_script", [], [sender, creator, collectionName, name, property_version]);
        const txn = await this.aptosClient.generateSignSubmitWaitForTransaction(account, payload, extraArgs);
        return txn.hash;
    }
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
    async cancelTokenOffer(account, receiver, creator, collectionName, name, property_version = 0, extraArgs) {
        const payload = this.transactionBuilder.buildTransactionPayload("0x3::token_transfers::cancel_offer_script", [], [receiver, creator, collectionName, name, property_version]);
        const txn = await this.aptosClient.generateSignSubmitWaitForTransaction(account, payload, extraArgs);
        return txn.hash;
    }
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
    async directTransferToken(sender, receiver, creator, collectionName, name, amount, propertyVersion = 0, extraArgs) {
        const payload = this.transactionBuilder.buildTransactionPayload("0x3::token::direct_transfer_script", [], [creator, collectionName, name, propertyVersion, amount]);
        const rawTxn = await this.aptosClient.generateRawTransaction(sender.address(), payload, extraArgs);
        const multiAgentTxn = new transaction_builder_1.TxnBuilderTypes.MultiAgentRawTransaction(rawTxn, [
            transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(receiver.address()),
        ]);
        const senderSignature = new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(sender
            .signBuffer(transaction_builder_1.TransactionBuilder.getSigningMessage(multiAgentTxn))
            .toUint8Array());
        const senderAuthenticator = new transaction_builder_1.TxnBuilderTypes.AccountAuthenticatorEd25519(new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(sender.signingKey.publicKey), senderSignature);
        const receiverSignature = new transaction_builder_1.TxnBuilderTypes.Ed25519Signature(receiver
            .signBuffer(transaction_builder_1.TransactionBuilder.getSigningMessage(multiAgentTxn))
            .toUint8Array());
        const receiverAuthenticator = new transaction_builder_1.TxnBuilderTypes.AccountAuthenticatorEd25519(new transaction_builder_1.TxnBuilderTypes.Ed25519PublicKey(receiver.signingKey.publicKey), receiverSignature);
        const multiAgentAuthenticator = new transaction_builder_1.TxnBuilderTypes.TransactionAuthenticatorMultiAgent(senderAuthenticator, [transaction_builder_1.TxnBuilderTypes.AccountAddress.fromHex(receiver.address())], // Secondary signer addresses
        [receiverAuthenticator] // Secondary signer authenticators
        );
        const bcsTxn = (0, bcs_1.bcsToBytes)(new transaction_builder_1.TxnBuilderTypes.SignedTransaction(rawTxn, multiAgentAuthenticator));
        const transactionRes = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
        return transactionRes.hash;
    }
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
    async getCollectionData(creator, collectionName) {
        const resources = await this.aptosClient.getAccountResources(creator);
        const accountResource = resources.find((r) => r.type === "0x3::token::Collections");
        const { handle } = accountResource.data.collection_data;
        const getCollectionTableItemRequest = {
            key_type: "0x1::string::String",
            value_type: "0x3::token::CollectionData",
            key: collectionName,
        };
        const collectionTable = await this.aptosClient.getTableItem(handle, getCollectionTableItemRequest);
        return collectionTable;
    }
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
    // :!:>getTokenData
    async getTokenData(creator, collectionName, tokenName) {
        const creatorHex = creator instanceof hex_string_1.HexString ? creator.hex() : creator;
        const collection = await this.aptosClient.getAccountResource(creatorHex, "0x3::token::Collections");
        const { handle } = collection.data.token_data;
        const tokenDataId = {
            creator: creatorHex,
            collection: collectionName,
            name: tokenName,
        };
        const getTokenTableItemRequest = {
            key_type: "0x3::token::TokenDataId",
            value_type: "0x3::token::TokenData",
            key: tokenDataId,
        };
        // We know the response will be a struct containing TokenData, hence the
        // implicit cast.
        return this.aptosClient.getTableItem(handle, getTokenTableItemRequest);
    } // <:!:getTokenData
    /**
     * Queries token balance for the token creator
     */
    async getToken(creator, collectionName, tokenName, property_version = "0") {
        const tokenDataId = {
            creator: creator instanceof hex_string_1.HexString ? creator.hex() : creator,
            collection: collectionName,
            name: tokenName,
        };
        return this.getTokenForAccount(creator, {
            token_data_id: tokenDataId,
            property_version,
        });
    }
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
    async getTokenForAccount(account, tokenId) {
        const tokenStore = await this.aptosClient.getAccountResource(account instanceof hex_string_1.HexString ? account.hex() : account, "0x3::token::TokenStore");
        const { handle } = tokenStore.data.tokens;
        const getTokenTableItemRequest = {
            key_type: "0x3::token::TokenId",
            value_type: "0x3::token::Token",
            key: tokenId,
        };
        try {
            return await this.aptosClient.getTableItem(handle, getTokenTableItemRequest);
        }
        catch (error) {
            if (error.status === 404) {
                return {
                    id: tokenId,
                    amount: "0",
                };
            }
            return error;
        }
    }
}
exports.TokenClient = TokenClient;
//# sourceMappingURL=token_client.js.map