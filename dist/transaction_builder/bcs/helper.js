"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcsSerializeFixedBytes = exports.bcsSerializeBytes = exports.bcsSerializeStr = exports.bcsSerializeBool = exports.bcsSerializeU128 = exports.bcsSerializeU32 = exports.bcsSerializeU16 = exports.bcsSerializeU8 = exports.bcsSerializeUint64 = exports.bcsToBytes = exports.deserializeVector = exports.serializeVectorWithFunc = exports.serializeVector = void 0;
const serializer_1 = require("./serializer");
/**
 * Serializes a vector values that are "Serializable".
 */
function serializeVector(value, serializer) {
    serializer.serializeU32AsUleb128(value.length);
    value.forEach((item) => {
        item.serialize(serializer);
    });
}
exports.serializeVector = serializeVector;
/**
 * Serializes a vector with specified item serializaiton function.
 * Very dynamic function and bypasses static typechecking.
 */
function serializeVectorWithFunc(value, func) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeU32AsUleb128(value.length);
    const f = serializer[func];
    value.forEach((item) => {
        f.call(serializer, item);
    });
    return serializer.getBytes();
}
exports.serializeVectorWithFunc = serializeVectorWithFunc;
/**
 * Deserializes a vector of values.
 */
function deserializeVector(deserializer, cls) {
    const length = deserializer.deserializeUleb128AsU32();
    const list = [];
    for (let i = 0; i < length; i += 1) {
        list.push(cls.deserialize(deserializer));
    }
    return list;
}
exports.deserializeVector = deserializeVector;
function bcsToBytes(value) {
    const serializer = new serializer_1.Serializer();
    value.serialize(serializer);
    return serializer.getBytes();
}
exports.bcsToBytes = bcsToBytes;
function bcsSerializeUint64(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeU64(value);
    return serializer.getBytes();
}
exports.bcsSerializeUint64 = bcsSerializeUint64;
function bcsSerializeU8(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeU8(value);
    return serializer.getBytes();
}
exports.bcsSerializeU8 = bcsSerializeU8;
function bcsSerializeU16(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeU16(value);
    return serializer.getBytes();
}
exports.bcsSerializeU16 = bcsSerializeU16;
function bcsSerializeU32(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeU32(value);
    return serializer.getBytes();
}
exports.bcsSerializeU32 = bcsSerializeU32;
function bcsSerializeU128(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeU128(value);
    return serializer.getBytes();
}
exports.bcsSerializeU128 = bcsSerializeU128;
function bcsSerializeBool(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeBool(value);
    return serializer.getBytes();
}
exports.bcsSerializeBool = bcsSerializeBool;
function bcsSerializeStr(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeStr(value);
    return serializer.getBytes();
}
exports.bcsSerializeStr = bcsSerializeStr;
function bcsSerializeBytes(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeBytes(value);
    return serializer.getBytes();
}
exports.bcsSerializeBytes = bcsSerializeBytes;
function bcsSerializeFixedBytes(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeFixedBytes(value);
    return serializer.getBytes();
}
exports.bcsSerializeFixedBytes = bcsSerializeFixedBytes;
//# sourceMappingURL=helper.js.map