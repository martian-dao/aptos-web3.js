"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexString = void 0;
const buffer_1 = require("buffer/"); // the trailing slash is important!
/**
 * A util class for working with hex strings.
 * Hex strings are strings that are prefixed with `0x`
 */
class HexString {
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
    constructor(hexString) {
        if (hexString.startsWith('0x')) {
            this.hexString = hexString;
        }
        else {
            this.hexString = `0x${hexString}`;
        }
    }
    /**
     * Creates new hex string from Buffer
     * @param buffer A buffer to convert
     * @returns New HexString
     */
    static fromBuffer(buffer) {
        return new HexString(buffer.toString('hex'));
    }
    /**
     * Creates new hex string from Uint8Array
     * @param arr Uint8Array to convert
     * @returns New HexString
     */
    static fromUint8Array(arr) {
        return HexString.fromBuffer(buffer_1.Buffer.from(arr));
    }
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
    static ensure(hexString) {
        if (typeof hexString === 'string') {
            return new HexString(hexString);
        }
        return hexString;
    }
    /**
     * Getter for inner hexString
     * @returns Inner hex string
     */
    hex() {
        return this.hexString;
    }
    /**
     * Getter for inner hexString without prefix
     * @returns Inner hex string without prefix
     * @example
     * ```
     *  const hexString = new HexString("string"); // "0xstring"
     *  hexString.noPrefix(); // "string"
     * ```
     */
    noPrefix() {
        return this.hexString.slice(2);
    }
    /**
     * Overrides default `toString` method
     * @returns Inner hex string
     */
    toString() {
        return this.hex();
    }
    /**
     * Trimmes extra zeroes in the begining of a string
     * @returns Inner hexString without leading zeroes
     * @example
     * ```
     *  new HexString("0x000000string").toShortString(); // result = "0xstring"
     * ```
     */
    toShortString() {
        const trimmed = this.hexString.replace(/^0x0*/, '');
        return `0x${trimmed}`;
    }
    /**
     * Converts hex string to a Buffer in hex encoding
     * @returns Buffer from inner hexString without prefix
     */
    toBuffer() {
        return buffer_1.Buffer.from(this.noPrefix(), 'hex');
    }
    /**
     * Converts hex string to a Uint8Array
     * @returns Uint8Array from inner hexString without prefix
     */
    toUint8Array() {
        return Uint8Array.from(this.toBuffer());
    }
}
exports.HexString = HexString;
//# sourceMappingURL=hex_string.js.map