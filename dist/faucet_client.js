"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaucetClient = void 0;
/** Faucet creates and funds accounts. This is a thin wrapper around that. */
const axios_1 = __importDefault(require("axios"));
const aptos_client_1 = require("./aptos_client");
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
        this.faucetUrl = faucetUrl;
    }
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
     * @param amount Amount of tokens to mint
     * @returns Hashes of submitted transactions
     */
    async fundAccount(address, amount) {
        const url = `${this.faucetUrl}/mint?amount=${amount}&address=${hex_string_1.HexString.ensure(address).noPrefix()}`;
        const response = await axios_1.default.post(url, {}, { validateStatus: () => true });
        (0, aptos_client_1.raiseForStatus)(200, response);
        const tnxHashes = response.data;
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