"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = void 0;
/* eslint-disable no-bitwise */
const consts_1 = require("./consts");
class Serializer {
    constructor() {
        this.buffer = new ArrayBuffer(64);
        this.offset = 0;
    }
    ensureBufferWillHandleSize(bytes) {
        while (this.buffer.byteLength < this.offset + bytes) {
            const newBuffer = new ArrayBuffer(this.buffer.byteLength * 2);
            new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
            this.buffer = newBuffer;
        }
    }
    serialize(values) {
        this.ensureBufferWillHandleSize(values.length);
        new Uint8Array(this.buffer, this.offset).set(values);
        this.offset += values.length;
    }
    serializeWithFunction(fn, bytesLength, value) {
        this.ensureBufferWillHandleSize(bytesLength);
        const dv = new DataView(this.buffer, this.offset);
        fn.apply(dv, [0, value, true]);
        this.offset += bytesLength;
    }
    /**
     * Serializes a string. UTF8 string is supported. Serializes the string's bytes length "l" first,
     * and then serializes "l" bytes of the string content.
     *
     * BCS layout for "string": string_length | string_content. string_length is the bytes length of
     * the string that is uleb128 encoded. string_length is a u32 integer.
     *
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeStr("çå∞≠¢õß∂ƒ∫");
     * assert(serializer.getBytes() === new Uint8Array([24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e,
     * 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab]));
     * ```
     */
    serializeStr(value) {
        const textEncoder = new TextEncoder();
        this.serializeBytes(textEncoder.encode(value));
    }
    /**
     * Serializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    serializeBytes(value) {
        this.serializeU32AsUleb128(value.length);
        this.serialize(value);
    }
    /**
     * Serializes an array of bytes with known length. Therefore length doesn't need to be
     * serialized to help deserialization.  When deserializing, the number of
     * bytes to deserialize needs to be passed in.
     */
    serializeFixedBytes(value) {
        this.serialize(value);
    }
    /**
     * Serializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    serializeBool(value) {
        if (typeof value !== 'boolean') {
            throw new Error('Value needs to be a boolean');
        }
        const byteValue = value ? 1 : 0;
        this.serialize(new Uint8Array([byteValue]));
    }
    /**
     * Serializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    serializeU8(value) {
        this.serialize(new Uint8Array([value]));
    }
    /**
     * Serializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU16(4660);
     * assert(serializer.getBytes() === new Uint8Array([0x34, 0x12]));
     * ```
     */
    serializeU16(value) {
        this.serializeWithFunction(DataView.prototype.setUint16, 2, value);
    }
    /**
     * Serializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU32(305419896);
     * assert(serializer.getBytes() === new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU32(value) {
        this.serializeWithFunction(DataView.prototype.setUint32, 4, value);
    }
    /**
     * Serializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const serializer = new Serializer();
     * serializer.serializeU64(1311768467750121216);
     * assert(serializer.getBytes() === new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * ```
     */
    serializeU64(value) {
        const low = BigInt(value.toString()) & BigInt(consts_1.MAX_U32_NUMBER);
        const high = BigInt(value.toString()) >> BigInt(32);
        // write little endian number
        this.serializeU32(Number(low));
        this.serializeU32(Number(high));
    }
    /**
     * Serializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU128(value) {
        const low = BigInt(value.toString()) & consts_1.MAX_U64_BIG_INT;
        const high = BigInt(value.toString()) >> BigInt(64);
        // write little endian number
        this.serializeU64(low);
        this.serializeU64(high);
    }
    /**
     * Serializes a uint32 number with uleb128.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    serializeU32AsUleb128(val) {
        let value = val;
        const valueArray = [];
        while (value >>> 7 !== 0) {
            valueArray.push((value & 0x7f) | 0x80);
            value >>>= 7;
        }
        valueArray.push(value);
        this.serialize(new Uint8Array(valueArray));
    }
    /**
     * Returns the buffered bytes
     */
    getBytes() {
        return new Uint8Array(this.buffer).slice(0, this.offset);
    }
}
__decorate([
    checkNumberRange(0, consts_1.MAX_U8_NUMBER)
], Serializer.prototype, "serializeU8", null);
__decorate([
    checkNumberRange(0, consts_1.MAX_U16_NUMBER)
], Serializer.prototype, "serializeU16", null);
__decorate([
    checkNumberRange(0, consts_1.MAX_U32_NUMBER)
], Serializer.prototype, "serializeU32", null);
__decorate([
    checkNumberRange(0n, consts_1.MAX_U64_BIG_INT)
], Serializer.prototype, "serializeU64", null);
__decorate([
    checkNumberRange(0n, consts_1.MAX_U128_BIG_INT)
], Serializer.prototype, "serializeU128", null);
__decorate([
    checkNumberRange(0, consts_1.MAX_U32_NUMBER)
], Serializer.prototype, "serializeU32AsUleb128", null);
exports.Serializer = Serializer;
/**
 * Creates a decorator to make sure the arg value of the decorated function is within a range.
 * @param minValue The arg value of decorated function must >= minValue
 * @param maxValue The arg value of decorated function must <= maxValue
 * @param message Error message
 */
function checkNumberRange(minValue, maxValue, message) {
    return (target, propertyKey, descriptor) => {
        const childFunction = descriptor.value;
        // eslint-disable-next-line no-param-reassign
        descriptor.value = function deco(value) {
            const valueBigInt = BigInt(value.toString());
            if (valueBigInt > BigInt(maxValue.toString()) || valueBigInt < BigInt(minValue.toString())) {
                throw new Error(message || 'Value is out of range');
            }
            childFunction.apply(this, [value]);
        };
        return descriptor;
    };
}
//# sourceMappingURL=serializer.js.map