"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.AuthenticationKey = void 0;
var SHA3 = require("js-sha3");
var hex_string_1 = require("../../hex_string");
/**
 * Each account stores an authentication key. Authentication key enables account owners to rotate
 * their private key(s) associated with the account without changing the address that hosts their account.
 * @see {@link * https://aptos.dev/basics/basics-accounts | Account Basics}
 *
 * Account addresses can be derived from AuthenticationKey
 */
var AuthenticationKey = /** @class */ (function () {
    function AuthenticationKey(bytes) {
        if (bytes.length !== AuthenticationKey.LENGTH) {
            throw new Error('Expected a byte array of length 32');
        }
        this.bytes = bytes;
    }
    /**
     * Converts a K-of-N MultiEd25519PublicKey to AuthenticationKey with:
     * `auth_key = sha3-256(p_1 | … | p_n | K | 0x01)`. `K` represents the K-of-N required for
     * authenticating the transaction. `0x01` is the 1-byte scheme for multisig.
     */
    AuthenticationKey.fromMultiEd25519PublicKey = function (publicKey) {
        var bytes = new Uint8Array(__spreadArray(__spreadArray([], publicKey.toBytes(), true), [AuthenticationKey.MULTI_ED25519_SCHEME], false));
        var hash = SHA3.sha3_256.create();
        hash.update(Buffer.from(bytes));
        return new AuthenticationKey(new Uint8Array(hash.arrayBuffer()));
    };
    /**
     * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
     * AuthenticationKey bytes are directly translated to AccountAddress.
     */
    AuthenticationKey.prototype.derivedAddress = function () {
        return hex_string_1.HexString.fromUint8Array(this.bytes);
    };
    AuthenticationKey.LENGTH = 32;
    AuthenticationKey.MULTI_ED25519_SCHEME = 1;
    return AuthenticationKey;
}());
exports.AuthenticationKey = AuthenticationKey;
