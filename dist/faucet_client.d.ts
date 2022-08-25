/** Faucet creates and funds accounts. This is a thin wrapper around that. */
import { AptosClient } from "./aptos_client";
import { OpenAPIConfig } from "./generated";
import { AxiosHttpRequest } from "./generated/core/AxiosHttpRequest";
import { MaybeHexString } from "./hex_string";
/**
 * Class for requsting tokens from faucet
 */
export declare class FaucetClient extends AptosClient {
    faucetRequester: AxiosHttpRequest;
    /**
     * Establishes a connection to Aptos node
     * @param nodeUrl A url of the Aptos Node API endpoint
     * @param faucetUrl A faucet url
     * @param config An optional config for inner axios instance
     * Detailed config description: {@link https://github.com/axios/axios#request-config}
     */
    constructor(nodeUrl: string, faucetUrl: string, config?: OpenAPIConfig);
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
     * @param amount Amount of tokens to mint
     * @returns Hashes of submitted transactions
     */
    fundAccount(address: MaybeHexString, amount: number): Promise<string[]>;
}
//# sourceMappingURL=faucet_client.d.ts.map