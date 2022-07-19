"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAddress = void 0;
const hex_string_1 = require("../../hex_string");
class AccountAddress {
    constructor(address) {
        if (address.length !== AccountAddress.LENGTH) {
            throw new Error('Expected address of length 32');
        }
        this.address = address;
    }
    /**
     * Creates AccountAddress from a hex string.
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static fromHex(addr) {
        let address = hex_string_1.HexString.ensure(addr);
        // If an address hex has odd number of digits, padd the hex string with 0
        // e.g. '1aa' would become '01aa'.
        if (address.noPrefix().length % 2 !== 0) {
            address = new hex_string_1.HexString(`0${address.noPrefix()}`);
        }
        const addressBytes = address.toUint8Array();
        if (addressBytes.length > AccountAddress.LENGTH) {
            // eslint-disable-next-line quotes
            throw new Error("Hex string is too long. Address's length is 32 bytes.");
        }
        else if (addressBytes.length === AccountAddress.LENGTH) {
            return new AccountAddress(addressBytes);
        }
        const res = new Uint8Array(AccountAddress.LENGTH);
        res.set(addressBytes, AccountAddress.LENGTH - addressBytes.length);
        return new AccountAddress(res);
    }
    serialize(serializer) {
        serializer.serializeFixedBytes(this.address);
    }
    static deserialize(deserializer) {
        return new AccountAddress(deserializer.deserializeFixedBytes(AccountAddress.LENGTH));
    }
}
exports.AccountAddress = AccountAddress;
AccountAddress.LENGTH = 32;
//# sourceMappingURL=account_address.js.map