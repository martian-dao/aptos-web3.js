"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ed25519Signature = exports.Ed25519PublicKey = void 0;
class Ed25519PublicKey {
    constructor(value) {
        if (value.length !== Ed25519PublicKey.LENGTH) {
            throw new Error(`Ed25519PublicKey length should be ${Ed25519PublicKey.LENGTH}`);
        }
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeBytes(this.value);
    }
    static deserialize(deserializer) {
        const value = deserializer.deserializeBytes();
        return new Ed25519PublicKey(value);
    }
}
exports.Ed25519PublicKey = Ed25519PublicKey;
Ed25519PublicKey.LENGTH = 32;
class Ed25519Signature {
    constructor(value) {
        this.value = value;
        if (value.length !== Ed25519Signature.LENGTH) {
            throw new Error(`Ed25519Signature length should be ${Ed25519Signature.LENGTH}`);
        }
    }
    serialize(serializer) {
        serializer.serializeBytes(this.value);
    }
    static deserialize(deserializer) {
        const value = deserializer.deserializeBytes();
        return new Ed25519Signature(value);
    }
}
exports.Ed25519Signature = Ed25519Signature;
Ed25519Signature.LENGTH = 64;
//# sourceMappingURL=ed25519.js.map