import { Bytes, Deserializer, Seq, Serializer, Uint8 } from '../bcs';
import { Ed25519PublicKey, Ed25519Signature } from './ed25519';
export declare class MultiEd25519PublicKey {
    readonly public_keys: Seq<Ed25519PublicKey>;
    readonly threshold: Uint8;
    /**
     * Public key for a K-of-N multisig transaction. A K-of-N multisig transaction means that for such a
     * transaction to be executed, at least K out of the N authorized signers have signed the transaction
     * and passed the check conducted by the chain.
     *
     * @see {@link
     * https://aptos.dev/guides/creating-a-signed-transaction#multisignature-transactions | Creating a Signed Transaction}
     *
     * @param public_keys A list of public keys
     * @param threshold At least "threshold" signatures must be valid
     */
    constructor(public_keys: Seq<Ed25519PublicKey>, threshold: Uint8);
    /**
     * Converts a MultiEd25519PublicKey into bytes with: bytes = p1_bytes | ... | pn_bytes | threshold
     */
    toBytes(): Bytes;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519PublicKey;
}
export declare class MultiEd25519Signature {
    readonly signatures: Seq<Ed25519Signature>;
    readonly bitmap: Uint8Array;
    static BITMAP_LEN: Uint8;
    /**
     * Signature for a K-of-N multisig transaction.
     *
     * @see {@link
     * https://aptos.dev/guides/creating-a-signed-transaction#multisignature-transactions | Creating a Signed Transaction}
     *
     * @param signatures A list of ed25519 signatures
     * @param bitmap 4 bytes, at most 32 signatures are supported. If Nth bit value is `1`, the Nth
     * signature should be provided in `signatures`. Bits are read from left to right
     */
    constructor(signatures: Seq<Ed25519Signature>, bitmap: Uint8Array);
    /**
     * Converts a MultiEd25519Signature into bytes with `bytes = s1_bytes | ... | sn_bytes | bitmap`
     */
    toBytes(): Bytes;
    /**
     * Helper method to create a bitmap out of the specified bit positions
     * @param bits The bitmap positions that should be set. A position starts at index 0.
     * Valid position should range between 0 and 31.
     * @example
     * Here's an example of valid `bits`
     * ```
     * [0, 2, 31]
     * ```
     * `[0, 2, 31]` means the 1st, 3rd and 32nd bits should be set in the bitmap.
     * The result bitmap should be 0b1010000000000000000000000000001
     *
     * @returns bitmap that is 32bit long
     */
    static createBitmap(bits: Seq<Uint8>): Uint8Array;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiEd25519Signature;
}
//# sourceMappingURL=multi_ed25519.d.ts.map