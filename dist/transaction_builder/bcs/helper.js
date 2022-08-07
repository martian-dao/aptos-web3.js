"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcsSerializeStr = exports.bcsSerializeUint64 = exports.bcsToBytes = exports.deserializeVector = exports.serializeVector = void 0;
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
function bcsSerializeStr(value) {
    const serializer = new serializer_1.Serializer();
    serializer.serializeStr(value);
    return serializer.getBytes();
}
exports.bcsSerializeStr = bcsSerializeStr;
//# sourceMappingURL=helper.js.map