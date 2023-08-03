export declare const NetworkToIndexerAPI: Record<string, string>;
export declare const NetworkToNodeAPI: Record<string, string>;
export declare const NodeAPIToNetwork: Record<string, string>;
export declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    DEVNET = "devnet"
}
export interface CustomEndpoints {
    fullnodeUrl: string;
    indexerUrl?: string;
}
//# sourceMappingURL=api-endpoints.d.ts.map