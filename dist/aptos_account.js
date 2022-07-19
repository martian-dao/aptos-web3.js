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
exports.AptosAccount = void 0;
const Nacl = __importStar(require("tweetnacl"));
const SHA3 = __importStar(require("js-sha3"));
const buffer_1 = require("buffer/"); // the trailing slash is important!
const hex_string_1 = require("./hex_string");
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
            this.signingKey = Nacl.sign.keyPair.fromSeed(privateKeyBytes.slice(0, 32));
        }
        else {
            this.signingKey = Nacl.sign.keyPair();
        }
        this.accountAddress = hex_string_1.HexString.ensure(address || this.authKey().hex());
    }
    static fromAptosAccountObject(obj) {
        return new AptosAccount(hex_string_1.HexString.ensure(obj.privateKeyHex).toUint8Array(), obj.address);
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
        if (!this.authKeyCached) {
            const hash = SHA3.sha3_256.create();
            hash.update(buffer_1.Buffer.from(this.signingKey.publicKey));
            hash.update('\x00');
            this.authKeyCached = new hex_string_1.HexString(hash.hex());
        }
        return this.authKeyCached;
    }
    /**
     * This key is generated with Ed25519 scheme.
     * Public key is used to check a signature of transaction, signed by given account
     * @returns The public key for the associated account
     */
    pubKey() {
        return hex_string_1.HexString.ensure(buffer_1.Buffer.from(this.signingKey.publicKey).toString('hex'));
    }
    /**
     * Signs specified `buffer` with account's private key
     * @param buffer A buffer to sign
     * @returns A signature HexString
     */
    signBuffer(buffer) {
        const signature = Nacl.sign(buffer, this.signingKey.secretKey);
        return hex_string_1.HexString.ensure(buffer_1.Buffer.from(signature).toString('hex').slice(0, 128));
    }
    /**
     * Signs specified `hexString` with account's private key
     * @param hexString A regular string or HexString to sign
     * @returns A signature HexString
     */
    signHexString(hexString) {
        const toSign = hex_string_1.HexString.ensure(hexString).toBuffer();
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
exports.AptosAccount = AptosAccount;
//# sourceMappingURL=aptos_account.js.map