import { Buffer } from "buffer/";
import { Types } from "./types";
export declare type MaybeHexString = HexString | string | Types.HexEncodedBytes;
export declare class HexString {
    private readonly hexString;
    static fromBuffer(buffer: Buffer): HexString;
    static fromUint8Array(arr: Uint8Array): HexString;
    static ensure(hexString: MaybeHexString): HexString;
    constructor(hexString: string | Types.HexEncodedBytes);
    hex(): string;
    noPrefix(): string;
    toString(): string;
    toShortString(): string;
    toBuffer(): Buffer;
    toUint8Array(): Uint8Array;
}
//# sourceMappingURL=hex_string.d.ts.map