/** Faucet creates and funds accounts. This is a thin wrapper around that. */
import { AptosClient } from "../providers/aptos_client";
import { MaybeHexString } from "../utils";
import { ClientConfig } from "../client";
/**
 * Class for requsting tokens from faucet
 */
export declare class FaucetClient extends AptosClient {
    readonly faucetUrl: string;
    readonly config: ClientConfig | undefined;
    /**
     * Establishes a connection to Aptos node
     * @param nodeUrl A url of the Aptos Node API endpoint
     * @param faucetUrl A faucet url
     * @param config An optional config for inner axios instance
     * Detailed config description: {@link https://github.com/axios/axios#request-config}
     */
    constructor(nodeUrl: string, faucetUrl: string, config?: ClientConfig);
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
     * @param amount Amount of tokens to mint
     * @param timeoutSecs
     * @returns Hashes of submitted transactions
     */
    fundAccount(address: MaybeHexString, amount: number, timeoutSecs?: number): Promise<string[]>;
}
//# sourceMappingURL=faucet_client.d.ts.map