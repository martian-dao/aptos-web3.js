import { AptosClient, AptosClientConfig } from './aptos_client';
import { Types } from './types';
import { MaybeHexString } from './hex_string';
/**
 * Class for requsting tokens from faucet
 */
export declare class FaucetClient extends AptosClient {
    faucetUrl: string;
    /**
     * Establishes a connection to Aptos node
     * @param nodeUrl A url of the Aptos Node API endpoint
     * @param faucetUrl A faucet url
     * @param config An optional config for inner axios instance
     * Detailed config description: {@link https://github.com/axios/axios#request-config}
     */
    constructor(nodeUrl: string, faucetUrl: string, config?: AptosClientConfig);
    /**
     * This creates an account if it does not exist and mints the specified amount of
     * coins into that account
     * @param address Hex-encoded 16 bytes Aptos account address wich mints tokens
     * @param amount Amount of tokens to mint
     * @returns Hashes of submitted transactions
     */
    fundAccount(address: MaybeHexString, amount: number): Promise<Types.HexEncodedBytes[]>;
}
//# sourceMappingURL=faucet_client.d.ts.map