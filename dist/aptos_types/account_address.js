"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAddress = void 0;
const utils_1 = require("../utils");
class AccountAddress {
    constructor(address) {
        if (address.length !== AccountAddress.LENGTH) {
            throw new Error("Expected address of length 32");
        }
        this.address = address;
    }
    /**
     * Creates AccountAddress from a hex string.
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static fromHex(addr) {
        let address = utils_1.HexString.ensure(addr);
        // If an address hex has odd number of digits, padd the hex string with 0
        // e.g. '1aa' would become '01aa'.
        if (address.noPrefix().length % 2 !== 0) {
            address = new utils_1.HexString(`0${address.noPrefix()}`);
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
    /**
     * Checks if the string is a valid AccountAddress
     * @param addr Hex string can be with a prefix or without a prefix,
     *   e.g. '0x1aa' or '1aa'. Hex string will be left padded with 0s if too short.
     */
    static isValid(addr) {
        // At least one zero is required
        if (addr === "") {
            return false;
        }
        let address = utils_1.HexString.ensure(addr);
        // If an address hex has odd number of digits, padd the hex string with 0
        // e.g. '1aa' would become '01aa'.
        if (address.noPrefix().length % 2 !== 0) {
            address = new utils_1.HexString(`0${address.noPrefix()}`);
        }
        const addressBytes = address.toUint8Array();
        return addressBytes.length <= AccountAddress.LENGTH;
    }
    /**
     * Return a hex string from account Address.
     */
    toHexString() {
        return utils_1.HexString.fromUint8Array(this.address).hex();
    }
    serialize(serializer) {
        serializer.serializeFixedBytes(this.address);
    }
    static deserialize(deserializer) {
        return new AccountAddress(deserializer.deserializeFixedBytes(AccountAddress.LENGTH));
    }
    /**
     * Standardizes an address to the format "0x" followed by 64 lowercase hexadecimal digits.
     */
    static standardizeAddress(address) {
        // Convert the address to lowercase
        const lowercaseAddress = address.toLowerCase();
        // Remove the "0x" prefix if present
        const addressWithoutPrefix = lowercaseAddress.startsWith("0x") ? lowercaseAddress.slice(2) : lowercaseAddress;
        // Pad the address with leading zeros if necessary
        // to ensure it has exactly 64 characters (excluding the "0x" prefix)
        const addressWithPadding = addressWithoutPrefix.padStart(64, "0");
        // Return the standardized address with the "0x" prefix
        return `0x${addressWithPadding}`;
    }
}
exports.AccountAddress = AccountAddress;
AccountAddress.LENGTH = 32;
AccountAddress.CORE_CODE_ADDRESS = AccountAddress.fromHex("0x1");
//# sourceMappingURL=account_address.js.map