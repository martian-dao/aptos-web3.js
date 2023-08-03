import type { HexEncodedBytes } from './HexEncodedBytes';
/**
 * A Ed25519 multi-sig signature
 *
 * This allows k-of-n signing for a transaction
 */
export declare type MultiEd25519Signature = {
    /**
     * The public keys for the Ed25519 signature
     */
    public_keys: Array<HexEncodedBytes>;
    /**
     * Signature associated with the public keys in the same order
     */
    signatures: Array<HexEncodedBytes>;
    /**
     * The number of signatures required for a successful transaction
     */
    threshold: number;
    bitmap: HexEncodedBytes;
};
//# sourceMappingURL=MultiEd25519Signature.d.ts.map