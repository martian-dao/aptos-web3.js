import { Bytes, Uint128, Uint16, Uint32, Uint64, Uint8 } from './types';
export declare class Deserializer {
    private buffer;
    private offset;
    constructor(data: Bytes);
    private read;
    /**
     * Deserializes a string. UTF8 string is supported. Reads the string's bytes length "l" first,
     * and then reads "l" bytes of content. Decodes the byte array into a string.
     *
     * BCS layout for "string": string_length | string_content. string_length is the bytes length of
     * the string that is uleb128 encoded. string_length is a u32 integer.
     *
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e,
     * 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab]));
     * assert(deserializer.deserializeStr() === "çå∞≠¢õß∂ƒ∫");
     * ```
     */
    deserializeStr(): string;
    /**
     * Deserializes an array of bytes.
     *
     * BCS layout for "bytes": bytes_length | bytes. bytes_length is the length of the bytes array that is
     * uleb128 encoded. bytes_length is a u32 integer.
     */
    deserializeBytes(): Bytes;
    /**
     * Deserializes an array of bytes. The number of bytes to read is already known.
     *
     */
    deserializeFixedBytes(len: number): Bytes;
    /**
     * Deserializes a boolean value.
     *
     * BCS layout for "boolean": One byte. "0x01" for True and "0x00" for False.
     */
    deserializeBool(): boolean;
    /**
     * Deserializes a uint8 number.
     *
     * BCS layout for "uint8": One byte. Binary format in little-endian representation.
     */
    deserializeU8(): Uint8;
    /**
     * Deserializes a uint16 number.
     *
     * BCS layout for "uint16": Two bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x34, 0x12]));
     * assert(deserializer.deserializeU16() === 4660);
     * ```
     */
    deserializeU16(): Uint16;
    /**
     * Deserializes a uint32 number.
     *
     * BCS layout for "uint32": Four bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU32() === 305419896);
     * ```
     */
    deserializeU32(): Uint32;
    /**
     * Deserializes a uint64 number.
     *
     * BCS layout for "uint64": Eight bytes. Binary format in little-endian representation.
     * @example
     * ```ts
     * const deserializer = new Deserializer(new Uint8Array([0x00, 0xEF, 0xCD, 0xAB, 0x78, 0x56, 0x34, 0x12]));
     * assert(deserializer.deserializeU64() === 1311768467750121216);
     * ```
     */
    deserializeU64(): Uint64;
    /**
     * Deserializes a uint128 number.
     *
     * BCS layout for "uint128": Sixteen bytes. Binary format in little-endian representation.
     */
    deserializeU128(): Uint128;
    /**
     * Deserializes a uleb128 encoded uint32 number.
     *
     * BCS use uleb128 encoding in two cases: (1) lengths of variable-length sequences and (2) tags of enum values
     */
    deserializeUleb128AsU32(): Uint32;
}
//# sourceMappingURL=deserializer.d.ts.map