"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaucetClient = void 0;
/** Faucet creates and funds accounts. This is a thin wrapper around that. */
const aptos_client_1 = require("./aptos_client");
const AxiosHttpRequest_1 = require("./generated/core/AxiosHttpRequest");
const hex_string_1 = require("./hex_string");
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
        // Build a requester configured to talk to the faucet.
        this.faucetRequester = new AxiosHttpRequest_1.AxiosHttpRequest({
            BASE: faucetUrl,
            VERSION: config?.VERSION ?? "0.1.0",
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? "include",
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
    }
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
     * @param amount Amount of tokens to mint
     * @returns Hashes of submitted transactions
     */
    async fundAccount(address, amount) {
        const tnxHashes = await this.faucetRequester.request({
            method: "POST",
            url: "/mint",
            query: {
                address: hex_string_1.HexString.ensure(address).toString(),
                amount,
            },
        });
        const promises = [];
        for (let i = 0; i < tnxHashes.length; i += 1) {
            const tnxHash = tnxHashes[i];
            promises.push(this.waitForTransaction(tnxHash));
        }
        await Promise.all(promises);
        return tnxHashes;
    }
}
exports.FaucetClient = FaucetClient;
//# sourceMappingURL=faucet_client.js.map