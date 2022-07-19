"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiEd25519Signature = exports.MultiEd25519PublicKey = void 0;
const ed25519_1 = require("./ed25519");
/**
 * MultiEd25519 currently supports at most 32 signatures.
 */
const MAX_SIGNATURES_SUPPORTED = 32;
class MultiEd25519PublicKey {
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
    constructor(public_keys, threshold) {
        this.public_keys = public_keys;
        this.threshold = threshold;
        if (threshold > MAX_SIGNATURES_SUPPORTED) {
            throw new Error(`"threshold" cannot be larger than ${MAX_SIGNATURES_SUPPORTED}`);
        }
    }
    /**
     * Converts a MultiEd25519PublicKey into bytes with: bytes = p1_bytes | ... | pn_bytes | threshold
     */
    toBytes() {
        const bytes = new Uint8Array(this.public_keys.length * ed25519_1.Ed25519PublicKey.LENGTH + 1);
        this.public_keys.forEach((k, i) => {
            bytes.set(k.value, i * ed25519_1.Ed25519PublicKey.LENGTH);
        });
        bytes[this.public_keys.length * ed25519_1.Ed25519PublicKey.LENGTH] = this.threshold;
        return bytes;
    }
    serialize(serializer) {
        serializer.serializeBytes(this.toBytes());
    }
    static deserialize(deserializer) {
        const bytes = deserializer.deserializeBytes();
        const threshold = bytes[bytes.length - 1];
        const keys = [];
        for (let i = 0; i < bytes.length; i += ed25519_1.Ed25519PublicKey.LENGTH) {
            const begin = i * ed25519_1.Ed25519PublicKey.LENGTH;
            keys.push(new ed25519_1.Ed25519PublicKey(bytes.subarray(begin, begin + ed25519_1.Ed25519PublicKey.LENGTH)));
        }
        return new MultiEd25519PublicKey(keys, threshold);
    }
}
exports.MultiEd25519PublicKey = MultiEd25519PublicKey;
class MultiEd25519Signature {
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
    constructor(signatures, bitmap) {
        this.signatures = signatures;
        this.bitmap = bitmap;
        if (bitmap.length !== MultiEd25519Signature.BITMAP_LEN) {
            throw new Error(`"bitmap" length should be ${MultiEd25519Signature.BITMAP_LEN}`);
        }
    }
    /**
     * Converts a MultiEd25519Signature into bytes with `bytes = s1_bytes | ... | sn_bytes | bitmap`
     */
    toBytes() {
        const bytes = new Uint8Array(this.signatures.length * ed25519_1.Ed25519Signature.LENGTH + MultiEd25519Signature.BITMAP_LEN);
        this.signatures.forEach((k, i) => {
            bytes.set(k.value, i * ed25519_1.Ed25519Signature.LENGTH);
        });
        bytes.set(this.bitmap, this.signatures.length * ed25519_1.Ed25519Signature.LENGTH);
        return bytes;
    }
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
    static createBitmap(bits) {
        // Bits are read from left to right. e.g. 0b10000000 represents the first bit is set in one byte.
        // The decimal value of 0b10000000 is 128.
        const firstBitInByte = 128;
        const bitmap = new Uint8Array([0, 0, 0, 0]);
        // Check if duplicates exist in bits
        const dupCheckSet = new Set();
        bits.forEach((bit) => {
            if (bit >= MAX_SIGNATURES_SUPPORTED) {
                throw new Error(`Invalid bit value ${bit}.`);
            }
            if (dupCheckSet.has(bit)) {
                throw new Error('Duplicated bits detected.');
            }
            dupCheckSet.add(bit);
            const byteOffset = Math.floor(bit / 8);
            let byte = bitmap[byteOffset];
            byte |= firstBitInByte >> bit % 8;
            bitmap[byteOffset] = byte;
        });
        return bitmap;
    }
    serialize(serializer) {
        serializer.serializeBytes(this.toBytes());
    }
    static deserialize(deserializer) {
        const bytes = deserializer.deserializeBytes();
        const bitmap = bytes.subarray(bytes.length - 4);
        const sigs = [];
        for (let i = 0; i < bytes.length; i += ed25519_1.Ed25519Signature.LENGTH) {
            const begin = i * ed25519_1.Ed25519Signature.LENGTH;
            sigs.push(new ed25519_1.Ed25519Signature(bytes.subarray(begin, begin + ed25519_1.Ed25519Signature.LENGTH)));
        }
        return new MultiEd25519Signature(sigs, bitmap);
    }
}
exports.MultiEd25519Signature = MultiEd25519Signature;
MultiEd25519Signature.BITMAP_LEN = 4;
//# sourceMappingURL=multi_ed25519.js.map