import { Buffer } from 'buffer/';
import { Types } from './types';
export declare type MaybeHexString = HexString | string | Types.HexEncodedBytes;
/**
 * A util class for working with hex strings.
 * Hex strings are strings that are prefixed with `0x`
 */
export declare class HexString {
    private readonly hexString;
    /**
     * Creates new hex string from Buffer
     * @param buffer A buffer to convert
     * @returns New HexString
     */
    static fromBuffer(buffer: Buffer): HexString;
    /**
     * Creates new hex string from Uint8Array
     * @param arr Uint8Array to convert
     * @returns New HexString
     */
    static fromUint8Array(arr: Uint8Array): HexString;
    /**
     * Ensures `hexString` is instance of `HexString` class
     * @param hexString String to check
     * @returns New HexString if `hexString` is regular string or `hexString` if it is HexString instance
     * @example
     * ```
     *  const regularString = "string";
     *  const hexString = new HexString("string"); // "0xstring"
     *  HexString.ensure(regularString); // "0xstring"
     *  HexString.ensure(hexString); // "0xstring"
     * ```
     */
    static ensure(hexString: MaybeHexString): HexString;
    /**
     * Creates new HexString instance from regular string. If specified string already starts with "0x" prefix,
     * it will not add another one
     * @param hexString String to convert
     * @example
     * ```
     *  const string = "string";
     *  new HexString(string); // "0xstring"
     * ```
     */
    constructor(hexString: string | Types.HexEncodedBytes);
    /**
     * Getter for inner hexString
     * @returns Inner hex string
     */
    hex(): string;
    /**
     * Getter for inner hexString without prefix
     * @returns Inner hex string without prefix
     * @example
     * ```
     *  const hexString = new HexString("string"); // "0xstring"
     *  hexString.noPrefix(); // "string"
     * ```
     */
    noPrefix(): string;
    /**
     * Overrides default `toString` method
     * @returns Inner hex string
     */
    toString(): string;
    /**
     * Trimmes extra zeroes in the begining of a string
     * @returns Inner hexString without leading zeroes
     * @example
     * ```
     *  new HexString("0x000000string").toShortString(); // result = "0xstring"
     * ```
     */
    toShortString(): string;
    /**
     * Converts hex string to a Buffer in hex encoding
     * @returns Buffer from inner hexString without prefix
     */
    toBuffer(): Buffer;
    /**
     * Converts hex string to a Uint8Array
     * @returns Uint8Array from inner hexString without prefix
     */
    toUint8Array(): Uint8Array;
}
//# sourceMappingURL=hex_string.d.ts.map