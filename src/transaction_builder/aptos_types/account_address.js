"use strict";
exports.__esModule = true;
exports.AccountAddress = void 0;
var hex_string_1 = require("../../hex_string");
var AccountAddress = /** @class */ (function () {
    function AccountAddress(address) {
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
    AccountAddress.fromHex = function (addr) {
        var address = hex_string_1.HexString.ensure(addr);
        // If an address hex has odd number of digits, padd the hex string with 0
        // e.g. '1aa' would become '01aa'.
        if (address.noPrefix().length % 2 !== 0) {
            address = new hex_string_1.HexString("0".concat(address.noPrefix()));
        }
        var addressBytes = address.toUint8Array();
        if (addressBytes.length > AccountAddress.LENGTH) {
            // eslint-disable-next-line quotes
            throw new Error("Hex string is too long. Address's length is 32 bytes.");
        }
        else if (addressBytes.length === AccountAddress.LENGTH) {
            return new AccountAddress(addressBytes);
        }
        var res = new Uint8Array(AccountAddress.LENGTH);
        res.set(addressBytes, AccountAddress.LENGTH - addressBytes.length);
        return new AccountAddress(res);
    };
    AccountAddress.prototype.serialize = function (serializer) {
        serializer.serializeFixedBytes(this.address);
    };
    AccountAddress.deserialize = function (deserializer) {
        return new AccountAddress(deserializer.deserializeFixedBytes(AccountAddress.LENGTH));
    };
    AccountAddress.LENGTH = 32;
    return AccountAddress;
}());
exports.AccountAddress = AccountAddress;
