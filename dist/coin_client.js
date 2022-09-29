"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinClient = void 0;
const hex_string_1 = require("./hex_string");
const transaction_builder_1 = require("./transaction_builder");
const abis_1 = require("./abis");
const utils_1 = require("./utils");
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
        this.transactionBuilder = new transaction_builder_1.TransactionBuilderABI(abis_1.COIN_ABIS.map((abi) => new hex_string_1.HexString(abi).toUint8Array()));
    }
    /**
     * Generate, sign, and submit a transaction to the Aptos blockchain API to
     * transfer AptosCoin from one account to another.
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
        const coinTypeToTransfer = extraArgs?.coinType ?? utils_1.APTOS_COIN;
        const payload = this.transactionBuilder.buildTransactionPayload("0x1::coin::transfer", [coinTypeToTransfer], [to.address(), amount]);
        return this.aptosClient.generateSignSubmitTransaction(from, payload, extraArgs);
    } // <:!:transfer
    /**
     * Generate, submit, and wait for a transaction to transfer AptosCoin from
     * one account to another.
     *
     * If the transaction is submitted successfully, it returns the response
     * from the API indicating that the transaction was submitted.
     *
     * @param account Account that you want to check the balance of.
     * @param extraArgs Extra args for checking the balance.
     * @returns Promise that resolves to the balance as a bigint.
     */
    // :!:>checkBalance
    async checkBalance(account, extraArgs) {
        const coinType = extraArgs?.coinType ?? utils_1.APTOS_COIN;
        const typeTag = `0x1::coin::CoinStore<${coinType}>`;
        const resources = await this.aptosClient.getAccountResources(account.address());
        const accountResource = resources.find((r) => r.type === typeTag);
        return BigInt(accountResource.data.coin.value);
    } // <:!:checkBalance
}
exports.CoinClient = CoinClient;
//# sourceMappingURL=coin_client.js.map