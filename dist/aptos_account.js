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
class AptosAccount {
    /** This class allows passing in an address, to handle account key rotation, where auth_key != public_key */
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
    /** Returns the address associated with the given account */
    address() {
        return this.accountAddress;
    }
    /** Returns the authKey for the associated account
     * See here for more info: https://aptos.dev/basics/basics-accounts#single-signer-authentication */
    authKey() {
        if (!this.authKeyCached) {
            const hash = SHA3.sha3_256.create();
            hash.update(buffer_1.Buffer.from(this.signingKey.publicKey));
            hash.update("\x00");
            this.authKeyCached = new hex_string_1.HexString(hash.hex());
        }
        return this.authKeyCached;
    }
    /** Returns the public key for the associated account */
    pubKey() {
        return hex_string_1.HexString.ensure(buffer_1.Buffer.from(this.signingKey.publicKey).toString("hex"));
    }
    signBuffer(buffer) {
        const signature = Nacl.sign(buffer, this.signingKey.secretKey);
        return hex_string_1.HexString.ensure(buffer_1.Buffer.from(signature).toString("hex").slice(0, 128));
    }
    signHexString(hexString) {
        const toSign = hex_string_1.HexString.ensure(hexString).toBuffer();
        return this.signBuffer(toSign);
    }
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