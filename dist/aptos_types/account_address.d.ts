import { MaybeHexString } from "../utils";
import { Serializer, Deserializer, Bytes } from "../bcs";
export declare class AccountAddress {
    static readonly LENGTH: number;
    readonly address: Bytes;
    static CORE_CODE_ADDRESS: AccountAddress;
    constructor(address: Bytes);
    /**
     * Creates AccountAddress from a hex string.
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static fromHex(addr: MaybeHexString): AccountAddress;
    /**
     * Checks if the string is a valid AccountAddress
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static isValid(addr: MaybeHexString): boolean;
    /**
     * Return a hex string from account Address.
     */
    toHexString(): MaybeHexString;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAddress;
    /**
     * Standardizes an address to the format "0x" followed by 64 lowercase hexadecimal digits.
     */
    static standardizeAddress(address: string): string;
}
//# sourceMappingURL=account_address.d.ts.map