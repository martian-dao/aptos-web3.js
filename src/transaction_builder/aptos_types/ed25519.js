"use strict";
exports.__esModule = true;
exports.Ed25519Signature = exports.Ed25519PublicKey = void 0;
var Ed25519PublicKey = /** @class */ (function () {
    function Ed25519PublicKey(value) {
        if (value.length !== Ed25519PublicKey.LENGTH) {
            throw new Error("Ed25519PublicKey length should be ".concat(Ed25519PublicKey.LENGTH));
        }
        this.value = value;
    }
    Ed25519PublicKey.prototype.serialize = function (serializer) {
        serializer.serializeBytes(this.value);
    };
    Ed25519PublicKey.deserialize = function (deserializer) {
        var value = deserializer.deserializeBytes();
        return new Ed25519PublicKey(value);
    };
    Ed25519PublicKey.LENGTH = 32;
    return Ed25519PublicKey;
}());
exports.Ed25519PublicKey = Ed25519PublicKey;
var Ed25519Signature = /** @class */ (function () {
    function Ed25519Signature(value) {
        this.value = value;
        if (value.length !== Ed25519Signature.LENGTH) {
            throw new Error("Ed25519Signature length should be ".concat(Ed25519Signature.LENGTH));
        }
    }
    Ed25519Signature.prototype.serialize = function (serializer) {
        serializer.serializeBytes(this.value);
    };
    Ed25519Signature.deserialize = function (deserializer) {
        var value = deserializer.deserializeBytes();
        return new Ed25519Signature(value);
    };
    Ed25519Signature.LENGTH = 64;
    return Ed25519Signature;
}());
exports.Ed25519Signature = Ed25519Signature;
