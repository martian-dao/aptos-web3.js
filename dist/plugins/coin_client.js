"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinClient = void 0;
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
const aptos_account_1 = require("../account/aptos_account");
const aptos_client_1 = require("../providers/aptos_client");
const utils_1 = require("../utils");
const transaction_builder_1 = require("../transaction_builder");
const fungible_asset_client_1 = require("./fungible_asset_client");
const providers_1 = require("../providers");
const aptos_types_1 = require("../aptos_types");
/**
 * Class for working with the coin module, such as transferring coins and
 * checking balances.
 */
class CoinClient {
    /**
     * Creates new CoinClient instance
     * @param aptosClient AptosClient instance
     */
    constructor(aptosClient) {
        this.aptosClient = aptosClient;
    }
    /**
     * Generate, sign, and submit a transaction to the Aptos blockchain API to
     * transfer coins from one account to another. By default it transfers
     * 0x1::aptos_coin::AptosCoin, but you can specify a different coin type
     * with the `coinType` argument.
     *
     * You may set `createReceiverIfMissing` to true if you want to create the
     * receiver account if it does not exist on chain yet. If you do not set
     * this to true, the transaction will fail if the receiver account does not
     * exist on-chain.
     *
     * The TS SDK supports fungible assets operations. If you want to use CoinClient
     * with this feature, set the `coinType` to be the fungible asset metadata address.
     * This option uses the `FungibleAssetClient` class and queries the
     * fungible asset primary store.
     *
     * @param from Account sending the coins
     * @param to Account to receive the coins
     * @param amount Number of coins to transfer
     * @param extraArgs Extra args for building the transaction or configuring how
     * the client should submit and wait for the transaction
     * @returns The hash of the transaction submitted to the API
     */
    // :!:>transfer
    async transfer(from, to, amount, extraArgs) {
        if (extraArgs?.coinType && aptos_types_1.AccountAddress.isValid(extraArgs.coinType)) {
            /* eslint-disable no-console */
            console.warn("to transfer a fungible asset, use `FungibleAssetClient()` class for better support");
            const provider = new providers_1.Provider({
                fullnodeUrl: this.aptosClient.nodeUrl,
                indexerUrl: utils_1.NetworkToIndexerAPI[utils_1.NodeAPIToNetwork[this.aptosClient.nodeUrl]] ?? this.aptosClient.nodeUrl,
            });
            const fungibleAsset = new fungible_asset_client_1.FungibleAssetClient(provider);
            const txnHash = await fungibleAsset.transfer(from, extraArgs?.coinType, (0, aptos_account_1.getAddressFromAccountOrAddress)(to), amount);
            return txnHash;
        }
        // If none is explicitly given, use 0x1::aptos_coin::AptosCoin as the coin type.
        const coinTypeToTransfer = extraArgs?.coinType ?? utils_1.APTOS_COIN;
        // If we should create the receiver account if it doesn't exist on-chain,
        // use the `0x1::aptos_account::transfer` function.
        const func = extraArgs?.createReceiverIfMissing ? "0x1::aptos_account::transfer_coins" : "0x1::coin::transfer";
        // Get the receiver address from the AptosAccount or MaybeHexString.
        const toAddress = (0, aptos_account_1.getAddressFromAccountOrAddress)(to);
        const builder = new transaction_builder_1.TransactionBuilderRemoteABI(this.aptosClient, { sender: from.address(), ...extraArgs });
        const rawTxn = await builder.build(func, [coinTypeToTransfer], [toAddress, amount]);
        const bcsTxn = aptos_client_1.AptosClient.generateBCSTransaction(from, rawTxn);
        const pendingTransaction = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);
        return pendingTransaction.hash;
    } // <:!:transfer
    /**
     * Get the balance of the account. By default it checks the balance of
     * 0x1::aptos_coin::AptosCoin, but you can specify a different coin type.
     *
     * to use a different type, set the `coinType` to be the fungible asset type.
     *
     * The TS SDK supports fungible assets operations. If you want to use CoinClient
     * with this feature, set the `coinType` to be the fungible asset metadata address.
     * This option uses the FungibleAssetClient class and queries the
     * fungible asset primary store.
     *
     * @param account Account that you want to get the balance of.
     * @param extraArgs Extra args for checking the balance.
     * @returns Promise that resolves to the balance as a bigint.
     */
    // :!:>checkBalance
    async checkBalance(account, extraArgs) {
        if (extraArgs?.coinType && aptos_types_1.AccountAddress.isValid(extraArgs.coinType)) {
            /* eslint-disable no-console */
            console.warn("to check balance of a fungible asset, use `FungibleAssetClient()` class for better support");
            const provider = new providers_1.Provider({
                fullnodeUrl: this.aptosClient.nodeUrl,
                indexerUrl: utils_1.NetworkToIndexerAPI[utils_1.NodeAPIToNetwork[this.aptosClient.nodeUrl]] ?? this.aptosClient.nodeUrl,
            });
            const fungibleAsset = new fungible_asset_client_1.FungibleAssetClient(provider);
            const balance = await fungibleAsset.getPrimaryBalance((0, aptos_account_1.getAddressFromAccountOrAddress)(account), extraArgs?.coinType);
            return balance;
        }
        const coinType = extraArgs?.coinType ?? utils_1.APTOS_COIN;
        const typeTag = `0x1::coin::CoinStore<${coinType}>`;
        const address = (0, aptos_account_1.getAddressFromAccountOrAddress)(account);
        const accountResource = await this.aptosClient.getAccountResource(address, typeTag);
        return BigInt(accountResource.data.coin.value);
    } // <:!:checkBalance
}
exports.CoinClient = CoinClient;
//# sourceMappingURL=coin_client.js.map