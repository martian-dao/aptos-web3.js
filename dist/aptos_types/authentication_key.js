"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationKey = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const utils_1 = require("../utils");
/**
 * Each account stores an authentication key. Authentication key enables account owners to rotate
 * their private key(s) associated with the account without changing the address that hosts their account.
 * @see {@link * https://aptos.dev/concepts/accounts | Account Basics}
 *
 * Account addresses can be derived from AuthenticationKey
 */
class AuthenticationKey {
    constructor(bytes) {
        if (bytes.length !== AuthenticationKey.LENGTH) {
            throw new Error("Expected a byte array of length 32");
        }
        this.bytes = bytes;
    }
    /**
     * Converts a K-of-N MultiEd25519PublicKey to AuthenticationKey with:
     * `auth_key = sha3-256(p_1 | … | p_n | K | 0x01)`. `K` represents the K-of-N required for
     * authenticating the transaction. `0x01` is the 1-byte scheme for multisig.
     */
    static fromMultiEd25519PublicKey(publicKey) {
        const pubKeyBytes = publicKey.toBytes();
        const bytes = new Uint8Array(pubKeyBytes.length + 1);
        bytes.set(pubKeyBytes);
        bytes.set([AuthenticationKey.MULTI_ED25519_SCHEME], pubKeyBytes.length);
        const hash = sha3_1.sha3_256.create();
        hash.update(bytes);
        return new AuthenticationKey(hash.digest());
    }
    static fromEd25519PublicKey(publicKey) {
        const pubKeyBytes = publicKey.value;
        const bytes = new Uint8Array(pubKeyBytes.length + 1);
        bytes.set(pubKeyBytes);
        bytes.set([AuthenticationKey.ED25519_SCHEME], pubKeyBytes.length);
        const hash = sha3_1.sha3_256.create();
        hash.update(bytes);
        return new AuthenticationKey(hash.digest());
    }
    /**
     * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
     * AuthenticationKey bytes are directly translated to AccountAddress.
     */
    derivedAddress() {
        return utils_1.HexString.fromUint8Array(this.bytes);
    }
}
exports.AuthenticationKey = AuthenticationKey;
AuthenticationKey.LENGTH = 32;
AuthenticationKey.MULTI_ED25519_SCHEME = 1;
AuthenticationKey.ED25519_SCHEME = 0;
AuthenticationKey.DERIVE_RESOURCE_ACCOUNT_SCHEME = 255;
//# sourceMappingURL=authentication_key.js.map