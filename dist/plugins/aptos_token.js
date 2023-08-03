"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosToken = void 0;
const consts_1 = require("../bcs/consts");
const aptos_client_1 = require("../providers/aptos_client");
const transaction_builder_1 = require("../transaction_builder");
const utils_1 = require("../utils");
const property_map_serde_1 = require("../utils/property_map_serde");
const fungible_asset_client_1 = require("./fungible_asset_client");
const PropertyTypeMap = {
    BOOLEAN: "bool",
    U8: "u8",
    U16: "u16",
    U32: "u32",
    U64: "u64",
    U128: "u128",
    U256: "u256",
    ADDRESS: "address",
    VECTOR: "vector<u8>",
    STRING: "string",
};
/**
 * Class for managing aptos_token
 */
class AptosToken {
    /**
     * Creates new AptosToken instance
     *
     * @param provider Provider instance
     */
    constructor(provider) {
        this.tokenType = "0x4::token::Token";
        this.provider = provider;
    }
    async submitTransaction(account, funcName, typeArgs, args, extraArgs) {
        const builder = new transaction_builder_1.TransactionBuilderRemoteABI(this.provider, {
            sender: account.address(),
            ...extraArgs,
        });
        const rawTxn = await builder.build(`0x4::aptos_token::${funcName}`, typeArgs, args);
        const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(account, rawTxn);
        const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
        return pendingTransaction.hash;
    }
    /**
     * Creates a new collection within the specified account
     *
     * @param creator AptosAccount where collection will be created
     * @param description Collection description
     * @param name Collection name
     * @param uri URL to additional info about collection
     * @param options CreateCollectionOptions type. By default all values set to `true` or `0`
     * @returns The hash of the transaction submitted to the API
     */
    async createCollection(creator, description, name, uri, maxSupply = consts_1.MAX_U64_BIG_INT, options, extraArgs) {
        return this.submitTransaction(creator, "create_collection", [], [
            description,
            maxSupply,
            name,
            uri,
            options?.mutableDescription ?? true,
            options?.mutableRoyalty ?? true,
            options?.mutableURI ?? true,
            options?.mutableTokenDescription ?? true,
            options?.mutableTokenName ?? true,
            options?.mutableTokenProperties ?? true,
            options?.mutableTokenURI ?? true,
            options?.tokensBurnableByCreator ?? true,
            options?.tokensFreezableByCreator ?? true,
            options?.royaltyNumerator ?? 0,
            options?.royaltyDenominator ?? 0,
        ], extraArgs);
    }
    /**
     * Mint a new token within the specified account
     *
     * @param account AptosAccount where token will be created
     * @param collection Name of collection, that token belongs to
     * @param description Token description
     * @param name Token name
     * @param uri URL to additional info about token
     * @param propertyKeys the property keys for storing on-chain properties
     * @param propertyTypes the type of property values
     * @param propertyValues the property values to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    async mint(account, collection, description, name, uri, propertyKeys = [], propertyTypes = [], propertyValues = [], extraArgs) {
        return this.submitTransaction(account, "mint", [], [
            collection,
            description,
            name,
            uri,
            propertyKeys,
            propertyTypes,
            (0, property_map_serde_1.getPropertyValueRaw)(propertyValues, propertyTypes),
        ], extraArgs);
    }
    /**
     * Mint a soul bound token into a recipient's account
     *
     * @param account AptosAccount that mints the token
     * @param collection Name of collection, that token belongs to
     * @param description Token description
     * @param name Token name
     * @param uri URL to additional info about token
     * @param recipient AptosAccount where token will be created
     * @param propertyKeys the property keys for storing on-chain properties
     * @param propertyTypes the type of property values
     * @param propertyValues the property values to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    async mintSoulBound(account, collection, description, name, uri, recipient, propertyKeys = [], propertyTypes = [], propertyValues = [], extraArgs) {
        return this.submitTransaction(account, "mint_soul_bound", [], [
            collection,
            description,
            name,
            uri,
            propertyKeys,
            propertyTypes,
            (0, property_map_serde_1.getPropertyValueRaw)(propertyValues, propertyTypes),
            recipient.address().hex(),
        ], extraArgs);
    }
    /**
     * Burn a token by its creator
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    async burnToken(creator, token, tokenType, extraArgs) {
        return this.submitTransaction(creator, "burn", [tokenType || this.tokenType], [utils_1.HexString.ensure(token).hex()], extraArgs);
    }
    /**
     * Freeze token transfer ability
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    async freezeTokenTransafer(creator, token, tokenType, extraArgs) {
        return this.submitTransaction(creator, "freeze_transfer", [tokenType || this.tokenType], [utils_1.HexString.ensure(token).hex()], extraArgs);
    }
    /**
     * Unfreeze token transfer ability
     * @param creator Creator account
     * @param token Token address
     * @returns The hash of the transaction submitted to the API
     */
    async unfreezeTokenTransafer(creator, token, tokenType, extraArgs) {
        return this.submitTransaction(creator, "unfreeze_transfer", [tokenType || this.tokenType], [utils_1.HexString.ensure(token).hex()], extraArgs);
    }
    /**
     * Set token description
     * @param creator Creator account
     * @param token Token address
     * @param description Token description
     * @returns The hash of the transaction submitted to the API
     */
    async setTokenDescription(creator, token, description, tokenType, extraArgs) {
        return this.submitTransaction(creator, "set_description", [tokenType || this.tokenType], [utils_1.HexString.ensure(token).hex(), description], extraArgs);
    }
    /**
     * Set token name
     * @param creator Creator account
     * @param token Token address
     * @param name Token name
     * @returns The hash of the transaction submitted to the API
     */
    async setTokenName(creator, token, name, tokenType, extraArgs) {
        return this.submitTransaction(creator, "set_name", [tokenType || this.tokenType], [utils_1.HexString.ensure(token).hex(), name], extraArgs);
    }
    /**
     * Set token URI
     * @param creator Creator account
     * @param token Token address
     * @param uri Token uri
     * @returns The hash of the transaction submitted to the API
     */
    async setTokenURI(creator, token, uri, tokenType, extraArgs) {
        return this.submitTransaction(creator, "set_uri", [tokenType || this.tokenType], [utils_1.HexString.ensure(token).hex(), uri], extraArgs);
    }
    /**
     * Add token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key for storing on-chain property
     * @param type the type of property value
     * @param value the property value to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    async addTokenProperty(creator, token, propertyKey, propertyType, propertyValue, tokenType, extraArgs) {
        return this.submitTransaction(creator, "add_property", [tokenType || this.tokenType], [
            utils_1.HexString.ensure(token).hex(),
            propertyKey,
            PropertyTypeMap[propertyType],
            (0, property_map_serde_1.getSinglePropertyValueRaw)(propertyValue, PropertyTypeMap[propertyType]),
        ], extraArgs);
    }
    /**
     * Remove token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    async removeTokenProperty(creator, token, propertyKey, tokenType, extraArgs) {
        return this.submitTransaction(creator, "remove_property", [tokenType || this.tokenType], [utils_1.HexString.ensure(token).hex(), propertyKey], extraArgs);
    }
    /**
     * Update token property
     * @param creator Creator account
     * @param token Token address
     * @param key the property key stored on-chain
     * @param type the property typed stored on-chain
     * @param value the property value to be stored on-chain
     * @returns The hash of the transaction submitted to the API
     */
    async updateTokenProperty(creator, token, propertyKey, propertyType, propertyValue, tokenType, extraArgs) {
        return this.submitTransaction(creator, "update_property", [tokenType || this.tokenType], [
            utils_1.HexString.ensure(token).hex(),
            propertyKey,
            PropertyTypeMap[propertyType],
            (0, property_map_serde_1.getSinglePropertyValueRaw)(propertyValue, PropertyTypeMap[propertyType]),
        ], extraArgs);
    }
    async addTypedProperty(creator, token, propertyKey, propertyType, propertyValue, tokenType, extraArgs) {
        return this.submitTransaction(creator, "add_typed_property", [tokenType || this.tokenType, PropertyTypeMap[propertyType]], [utils_1.HexString.ensure(token).hex(), propertyKey, propertyValue], extraArgs);
    }
    async updateTypedProperty(creator, token, propertyKey, propertyType, propertyValue, tokenType, extraArgs) {
        return this.submitTransaction(creator, "update_typed_property", [tokenType || this.tokenType, PropertyTypeMap[propertyType]], [utils_1.HexString.ensure(token).hex(), propertyKey, propertyValue], extraArgs);
    }
    /**
     * Transfer a non fungible token ownership.
     * We can transfer a token only when the token is not frozen (i.e. owner transfer is not disabled such as for soul bound tokens)
     * @param owner The account of the current token owner
     * @param token Token address
     * @param recipient Recipient address
     * @returns The hash of the transaction submitted to the API
     */
    async transferTokenOwnership(owner, token, recipient, tokenType, extraArgs) {
        const builder = new transaction_builder_1.TransactionBuilderRemoteABI(this.provider, {
            sender: owner.address(),
            ...extraArgs,
        });
        const rawTxn = await builder.build("0x1::object::transfer", [tokenType || this.tokenType], [utils_1.HexString.ensure(token).hex(), utils_1.HexString.ensure(recipient).hex()]);
        const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(owner, rawTxn);
        const pendingTransaction = await this.provider.submitSignedBCSTransaction(bcsTxn);
        return pendingTransaction.hash;
    }
    /**
     * Transfer a token. This function supports transfer non-fungible token and fungible token.
     *
     * To set the token type, set isFungibleToken param to true or false.
     * If isFungibleToken param is not set, the function would query Indexer
     * for the token data and check whether it is a non-fungible or a fungible token.
     *
     * Note: this function supports only token v2 standard (it does not support the token v1 standard)
     *
     * @param data NonFungibleTokenParameters | FungibleTokenParameters type
     * @param isFungibleToken (optional) The token type, non-fungible or fungible token.
     * @returns The hash of the transaction submitted to the API
     */
    async transfer(data, isFungibleToken) {
        let isFungible = isFungibleToken;
        if (isFungible === undefined || isFungible === null) {
            const tokenData = await this.provider.getTokenData(utils_1.HexString.ensure(data.tokenAddress).hex());
            isFungible = tokenData.current_token_datas_v2[0].is_fungible_v2;
        }
        if (isFungible) {
            const token = data;
            const fungibleAsset = new fungible_asset_client_1.FungibleAssetClient(this.provider);
            const txnHash = await fungibleAsset.transfer(token.owner, token.tokenAddress, token.recipient, token.amount, token.extraArgs);
            return txnHash;
        }
        const token = data;
        const txnHash = await this.transferTokenOwnership(token.owner, token.tokenAddress, token.recipient, token.tokenType, token.extraArgs);
        return txnHash;
    }
}
exports.AptosToken = AptosToken;
//# sourceMappingURL=aptos_token.js.map