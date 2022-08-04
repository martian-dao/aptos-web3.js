export declare type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
export declare type AnyObject = {
    [key: string]: any;
};
export declare function sleep(timeMs: number): Promise<null>;
//# sourceMappingURL=util.d.ts.map