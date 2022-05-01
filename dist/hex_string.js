"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexString = void 0;
const buffer_1 = require("buffer/"); // the trailing slash is important!
class HexString {
    constructor(hexString) {
        if (hexString.startsWith("0x")) {
            this.hexString = hexString;
        }
        else {
            this.hexString = `0x${hexString}`;
        }
    }
    static fromBuffer(buffer) {
        return new HexString(buffer.toString("hex"));
    }
    static fromUint8Array(arr) {
        return HexString.fromBuffer(buffer_1.Buffer.from(arr));
    }
    static ensure(hexString) {
        if (typeof hexString === "string") {
            return new HexString(hexString);
        }
        return hexString;
    }
    hex() {
        return this.hexString;
    }
    noPrefix() {
        return this.hexString.slice(2);
    }
    toString() {
        return this.hex();
    }
    toShortString() {
        const trimmed = this.hexString.replace(/^0x0*/, "");
        return `0x${trimmed}`;
    }
    toBuffer() {
        return buffer_1.Buffer.from(this.noPrefix(), "hex");
    }
    toUint8Array() {
        return Uint8Array.from(this.toBuffer());
    }
}
exports.HexString = HexString;
//# sourceMappingURL=hex_string.js.map