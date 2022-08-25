import type { HexEncodedBytes } from './HexEncodedBytes';
export declare type MultiEd25519Signature = {
    public_keys: Array<HexEncodedBytes>;
    signatures: Array<HexEncodedBytes>;
    threshold: number;
    bitmap: HexEncodedBytes;
};
//# sourceMappingURL=MultiEd25519Signature.d.ts.map