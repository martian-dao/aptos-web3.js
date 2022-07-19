import { MaybeHexString } from '../../hex_string';
import { Serializer, Deserializer, Bytes } from '../bcs';
export declare class AccountAddress {
    static readonly LENGTH: number;
    readonly address: Bytes;
    constructor(address: Bytes);
    /**
     * Creates AccountAddress from a hex string.
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static fromHex(addr: MaybeHexString): AccountAddress;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAddress;
}
//# sourceMappingURL=account_address.d.ts.map