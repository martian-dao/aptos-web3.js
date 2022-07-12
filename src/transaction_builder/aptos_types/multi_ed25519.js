"use strict";
exports.__esModule = true;
exports.MultiEd25519Signature = exports.MultiEd25519PublicKey = void 0;
var ed25519_1 = require("./ed25519");
/**
 * MultiEd25519 currently supports at most 32 signatures.
 */
var MAX_SIGNATURES_SUPPORTED = 32;
var MultiEd25519PublicKey = /** @class */ (function () {
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
    function MultiEd25519PublicKey(public_keys, threshold) {
        this.public_keys = public_keys;
        this.threshold = threshold;
        if (threshold > MAX_SIGNATURES_SUPPORTED) {
            throw new Error("\"threshold\" cannot be larger than ".concat(MAX_SIGNATURES_SUPPORTED));
        }
    }
    /**
     * Converts a MultiEd25519PublicKey into bytes with: bytes = p1_bytes | ... | pn_bytes | threshold
     */
    MultiEd25519PublicKey.prototype.toBytes = function () {
        var bytes = new Uint8Array(this.public_keys.length * ed25519_1.Ed25519PublicKey.LENGTH + 1);
        this.public_keys.forEach(function (k, i) {
            bytes.set(k.value, i * ed25519_1.Ed25519PublicKey.LENGTH);
        });
        bytes[this.public_keys.length * ed25519_1.Ed25519PublicKey.LENGTH] = this.threshold;
        return bytes;
    };
    MultiEd25519PublicKey.prototype.serialize = function (serializer) {
        serializer.serializeBytes(this.toBytes());
    };
    MultiEd25519PublicKey.deserialize = function (deserializer) {
        var bytes = deserializer.deserializeBytes();
        var threshold = bytes[bytes.length - 1];
        var keys = [];
        for (var i = 0; i < bytes.length; i += ed25519_1.Ed25519PublicKey.LENGTH) {
            var begin = i * ed25519_1.Ed25519PublicKey.LENGTH;
            keys.push(new ed25519_1.Ed25519PublicKey(bytes.subarray(begin, begin + ed25519_1.Ed25519PublicKey.LENGTH)));
        }
        return new MultiEd25519PublicKey(keys, threshold);
    };
    return MultiEd25519PublicKey;
}());
exports.MultiEd25519PublicKey = MultiEd25519PublicKey;
var MultiEd25519Signature = /** @class */ (function () {
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
    function MultiEd25519Signature(signatures, bitmap) {
        this.signatures = signatures;
        this.bitmap = bitmap;
        if (bitmap.length !== MultiEd25519Signature.BITMAP_LEN) {
            throw new Error("\"bitmap\" length should be ".concat(MultiEd25519Signature.BITMAP_LEN));
        }
    }
    /**
     * Converts a MultiEd25519Signature into bytes with `bytes = s1_bytes | ... | sn_bytes | bitmap`
     */
    MultiEd25519Signature.prototype.toBytes = function () {
        var bytes = new Uint8Array(this.signatures.length * ed25519_1.Ed25519Signature.LENGTH + MultiEd25519Signature.BITMAP_LEN);
        this.signatures.forEach(function (k, i) {
            bytes.set(k.value, i * ed25519_1.Ed25519Signature.LENGTH);
        });
        bytes.set(this.bitmap, this.signatures.length * ed25519_1.Ed25519Signature.LENGTH);
        return bytes;
    };
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
    MultiEd25519Signature.createBitmap = function (bits) {
        // Bits are read from left to right. e.g. 0b10000000 represents the first bit is set in one byte.
        // The decimal value of 0b10000000 is 128.
        var firstBitInByte = 128;
        var bitmap = new Uint8Array([0, 0, 0, 0]);
        // Check if duplicates exist in bits
        var dupCheckSet = new Set();
        bits.forEach(function (bit) {
            if (bit >= MAX_SIGNATURES_SUPPORTED) {
                throw new Error("Invalid bit value ".concat(bit, "."));
            }
            if (dupCheckSet.has(bit)) {
                throw new Error('Duplicated bits detected.');
            }
            dupCheckSet.add(bit);
            var byteOffset = Math.floor(bit / 8);
            var byte = bitmap[byteOffset];
            byte |= firstBitInByte >> bit % 8;
            bitmap[byteOffset] = byte;
        });
        return bitmap;
    };
    MultiEd25519Signature.prototype.serialize = function (serializer) {
        serializer.serializeBytes(this.toBytes());
    };
    MultiEd25519Signature.deserialize = function (deserializer) {
        var bytes = deserializer.deserializeBytes();
        var bitmap = bytes.subarray(bytes.length - 4);
        var sigs = [];
        for (var i = 0; i < bytes.length; i += ed25519_1.Ed25519Signature.LENGTH) {
            var begin = i * ed25519_1.Ed25519Signature.LENGTH;
            sigs.push(new ed25519_1.Ed25519Signature(bytes.subarray(begin, begin + ed25519_1.Ed25519Signature.LENGTH)));
        }
        return new MultiEd25519Signature(sigs, bitmap);
    };
    MultiEd25519Signature.BITMAP_LEN = 4;
    return MultiEd25519Signature;
}());
exports.MultiEd25519Signature = MultiEd25519Signature;
