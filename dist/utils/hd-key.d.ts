declare type Hex = string;
declare type Path = string;
declare type Keys = {
    key: Uint8Array;
    chainCode: Uint8Array;
};
export declare const getMasterKeyFromSeed: (seed: Hex) => Keys;
export declare const CKDPriv: ({ key, chainCode }: Keys, index: number) => Keys;
export declare const getPublicKey: (privateKey: Uint8Array, withZeroByte?: boolean) => Uint8Array;
export declare const isValidPath: (path: string) => boolean;
export declare const derivePath: (path: Path, seed: Hex, offset?: number) => Keys;
export {};
//# sourceMappingURL=hd-key.d.ts.map