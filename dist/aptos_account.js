"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosAccount = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const sha3_1 = require("@noble/hashes/sha3");
const bip39 = __importStar(require("@scure/bip39"));
const hd_key_1 = require("./utils/hd-key");
const hex_string_1 = require("./hex_string");
const utils_1 = require("./utils");
/**
 * Class for creating and managing Aptos account
 */
class AptosAccount {
    /**
     * Creates new account instance. Constructor allows passing in an address,
     * to handle account key rotation, where auth_key != public_key
     * @param privateKeyBytes  Private key from which account key pair will be generated.
     * If not specified, new key pair is going to be created.
     * @param address Account address (e.g. 0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591).
     * If not specified, a new one will be generated from public key
     */
    constructor(privateKeyBytes, address) {
        if (privateKeyBytes) {
            this.signingKey = tweetnacl_1.default.sign.keyPair.fromSeed(privateKeyBytes.slice(0, 32));
        }
        else {
            this.signingKey = tweetnacl_1.default.sign.keyPair();
        }
        this.accountAddress = hex_string_1.HexString.ensure(address || this.authKey().hex());
    }
    static fromAptosAccountObject(obj) {
        return new AptosAccount(hex_string_1.HexString.ensure(obj.privateKeyHex).toUint8Array(), obj.address);
    }
    /**
     * Creates new account with bip44 path and mnemonics,
     * @param path. (e.g. m/44'/637'/0'/0'/0')
     * Detailed description: {@link https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki}
     * @param mnemonics.
     * @returns AptosAccount
     */
    static fromDerivePath(path, mnemonics, address) {
        if (!AptosAccount.isValidPath(path)) {
            throw new Error("Invalid derivation path");
        }
        const normalizeMnemonics = mnemonics
            .trim()
            .split(/\s+/)
            .map((part) => part.toLowerCase())
            .join(" ");
        const { key } = (0, hd_key_1.derivePath)(path, Buffer.from(bip39.mnemonicToSeedSync(normalizeMnemonics)).toString("hex"));
        return new AptosAccount(new Uint8Array(key), address);
    }
    /**
     * This is the key by which Aptos account is referenced.
     * It is the 32-byte of the SHA-3 256 cryptographic hash
     * of the public key(s) concatenated with a signature scheme identifier byte
     * @returns Address associated with the given account
     */
    address() {
        return this.accountAddress;
    }
    /**
     * This key enables account owners to rotate their private key(s)
     * associated with the account without changing the address that hosts their account.
     * See here for more info: {@link https://aptos.dev/basics/basics-accounts#single-signer-authentication}
     * @returns Authentication key for the associated account
     */
    authKey() {
        const hash = sha3_1.sha3_256.create();
        hash.update(this.signingKey.publicKey);
        hash.update("\x00");
        return hex_string_1.HexString.fromUint8Array(hash.digest());
    }
    /**
     * This key is generated with Ed25519 scheme.
     * Public key is used to check a signature of transaction, signed by given account
     * @returns The public key for the associated account
     */
    pubKey() {
        return hex_string_1.HexString.fromUint8Array(this.signingKey.publicKey);
    }
    /**
     * Signs specified `buffer` with account's private key
     * @param buffer A buffer to sign
     * @returns A signature HexString
     */
    signBuffer(buffer) {
        const signature = tweetnacl_1.default.sign(buffer, this.signingKey.secretKey);
        return hex_string_1.HexString.fromUint8Array(signature.slice(0, 64));
    }
    /**
     * Signs specified `hexString` with account's private key
     * @param hexString A regular string or HexString to sign
     * @returns A signature HexString
     */
    signHexString(hexString) {
        const toSign = hex_string_1.HexString.ensure(hexString).toUint8Array();
        return this.signBuffer(toSign);
    }
    /**
     * Derives account address, public key and private key
     * @returns AptosAccountObject instance.
     * @example An example of the returned AptosAccountObject object
     * ```
     * {
     *    address: "0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591",
     *    publicKeyHex: "0xf56d8524faf79fbc0f48c13aeed3b0ce5dd376b4db93b8130a107c0a5e04ba04",
     *    privateKeyHex: `0x009c9f7c992a06cfafe916f125d8adb7a395fca243e264a8e56a4b3e6accf940
     *      d2b11e9ece3049ce60e3c7b4a1c58aebfa9298e29a30a58a67f1998646135204`
     * }
     * ```
     */
    toPrivateKeyObject() {
        return {
            address: this.address().hex(),
            publicKeyHex: this.pubKey().hex(),
            privateKeyHex: hex_string_1.HexString.fromUint8Array(this.signingKey.secretKey.slice(0, 32)).hex(),
        };
    }
}
/**
 * Test derive path
 */
AptosAccount.isValidPath = (path) => {
    if (!/^m\/44'\/637'\/[0-9]+'\/[0-9]+'\/[0-9]+'+$/.test(path)) {
        return false;
    }
    return true;
};
__decorate([
    (0, utils_1.Memoize)()
], AptosAccount.prototype, "authKey", null);
exports.AptosAccount = AptosAccount;
//# sourceMappingURL=aptos_account.js.map