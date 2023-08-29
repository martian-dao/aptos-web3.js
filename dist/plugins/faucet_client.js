"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaucetClient = void 0;
/** Faucet creates and funds accounts. This is a thin wrapper around that. */
const aptos_client_1 = require("../providers/aptos_client");
const utils_1 = require("../utils");
const client_1 = require("../client");
/**
 * Class for requsting tokens from faucet
 */
class FaucetClient extends aptos_client_1.AptosClient {
    /**
     * Establishes a connection to Aptos node
     * @param nodeUrl A url of the Aptos Node API endpoint
     * @param faucetUrl A faucet url
     * @param config An optional config for inner axios instance
     * Detailed config description: {@link https://github.com/axios/axios#request-config}
     */
    constructor(nodeUrl, faucetUrl, config) {
        super(nodeUrl, config);
        if (!faucetUrl) {
            throw new Error("Faucet URL cannot be empty.");
        }
        this.faucetUrl = faucetUrl;
        this.config = config;
    }
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
     * @param amount Amount of tokens to mint
     * @param timeoutSecs
     * @returns Hashes of submitted transactions
     */
    async fundAccount(address, amount, timeoutSecs = utils_1.DEFAULT_TXN_TIMEOUT_SEC) {
        const { data } = await (0, client_1.post)({
            url: this.faucetUrl,
            endpoint: "mint",
            body: null,
            params: {
                address: utils_1.HexString.ensure(address).noPrefix(),
                amount,
            },
            overrides: { ...this.config },
            originMethod: "fundAccount",
        });
        const promises = [];
        for (let i = 0; i < data.length; i += 1) {
            const tnxHash = data[i];
            promises.push(this.waitForTransaction(tnxHash, { timeoutSecs }));
        }
        await Promise.all(promises);
        return data;
    }
}
exports.FaucetClient = FaucetClient;
//# sourceMappingURL=faucet_client.js.map