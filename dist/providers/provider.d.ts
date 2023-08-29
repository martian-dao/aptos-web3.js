import { AptosClient } from "./aptos_client";
import { IndexerClient } from "./indexer";
import { CustomEndpoints, Network } from "../utils";
import { ClientConfig } from "../client";
declare type NetworkWithCustom = Network | "CUSTOM";
/**
 * Builds a Provider class with an aptos client configured to connect to an Aptos node
 * and indexer client configured to connect to Aptos Indexer.
 *
 * It creates AptosClient and IndexerClient instances based on the network or custom endpoints provided.
 *
 * This class holds both AptosClient and IndexerClient classes's methods and properties so we
 * can instantiate the Provider class and use it to query full node and/or Indexer.
 *
 * @example An example of how to use this class
 * ```
 * const provider = new Provider(Network.DEVNET)
 * const account = await provider.getAccount("0x123");
 * const accountNFTs = await provider.getAccountNFTs("0x123");
 * ```
 *
 * @param network enum of type Network - MAINNET | TESTNET | DEVENET or custom endpoints of type CustomEndpoints
 * @param config AptosClient config arg - additional configuration options for the generated Axios client.
 */
export declare class Provider {
    aptosClient: AptosClient;
    indexerClient: IndexerClient;
    network: NetworkWithCustom;
    constructor(network: Network | CustomEndpoints, config?: ClientConfig, doNotFixNodeUrl?: boolean);
}
export interface Provider extends AptosClient, IndexerClient {
}
export {};
//# sourceMappingURL=provider.d.ts.map