export declare type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
export declare type AnyObject = {
    [key: string]: any;
};
export declare function sleep(timeMs: number): Promise<null>;
export declare const DEFAULT_VERSION_PATH_BASE = "/v1";
export declare function fixNodeUrl(nodeUrl: string): string;
//# sourceMappingURL=util.d.ts.map