"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationKey = void 0;
const SHA3 = __importStar(require("js-sha3"));
const hex_string_1 = require("../../hex_string");
/**
 * Each account stores an authentication key. Authentication key enables account owners to rotate
 * their private key(s) associated with the account without changing the address that hosts their account.
 * @see {@link * https://aptos.dev/basics/basics-accounts | Account Basics}
 *
 * Account addresses can be derived from AuthenticationKey
 */
class AuthenticationKey {
    constructor(bytes) {
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
    static fromMultiEd25519PublicKey(publicKey) {
        const bytes = new Uint8Array([...publicKey.toBytes(), AuthenticationKey.MULTI_ED25519_SCHEME]);
        const hash = SHA3.sha3_256.create();
        hash.update(Buffer.from(bytes));
        return new AuthenticationKey(new Uint8Array(hash.arrayBuffer()));
    }
    /**
     * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
     * AuthenticationKey bytes are directly translated to AccountAddress.
     */
    derivedAddress() {
        return hex_string_1.HexString.fromUint8Array(this.bytes);
    }
}
exports.AuthenticationKey = AuthenticationKey;
AuthenticationKey.LENGTH = 32;
AuthenticationKey.MULTI_ED25519_SCHEME = 1;
//# sourceMappingURL=authentication_key.js.map