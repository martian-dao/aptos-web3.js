import { AnyNumber, Bytes, Uint16, Uint32, Uint8 } from './types';
export declare class Serializer {
    private buffer;
    private offset;
    constructor();
    private ensureBufferWillHandleSize;
    protected serialize(values: Bytes): void;
    private serializeWithFunction;
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
    serializeStr(value: string): void;
    /**
     * Serializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    serializeBytes(value: Bytes): void;
    /**
     * Serializes an array of bytes with known length. Therefore length doesn't need to be
     * serialized to help deserialization.  When deserializing, the number of
     * bytes to deserialize needs to be passed in.
     */
    serializeFixedBytes(value: Bytes): void;
    /**
     * Serializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    serializeBool(value: boolean): void;
    /**
     * Serializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    serializeU8(value: Uint8): void;
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
    serializeU16(value: Uint16): void;
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
    serializeU32(value: Uint32): void;
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
    serializeU64(value: AnyNumber): void;
    /**
     * Serializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    serializeU128(value: AnyNumber): void;
    /**
     * Serializes a uint32 number with uleb128.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    serializeU32AsUleb128(val: Uint32): void;
    /**
     * Returns the buffered bytes
     */
    getBytes(): Bytes;
}
//# sourceMappingURL=serializer.d.ts.map