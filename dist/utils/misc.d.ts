export declare type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
export declare type AnyObject = {
    [key: string]: any;
};
export declare function sleep(timeMs: number): Promise<null>;
export declare const DEFAULT_VERSION_PATH_BASE = "/v1";
export declare function fixNodeUrl(nodeUrl: string): string;
export declare const DEFAULT_MAX_GAS_AMOUNT = 20000;
export declare const DEFAULT_TXN_EXP_SEC_FROM_NOW = 60;
export declare const DEFAULT_TXN_TIMEOUT_SEC = 60;
export declare const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
export declare const CUSTOM_REQUEST_HEADER: {
    "x-aptos-client": string;
};
//# sourceMappingURL=misc.d.ts.map