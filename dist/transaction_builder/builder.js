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
exports.TransactionBuilderMultiEd25519 = exports.TransactionBuilderEd25519 = exports.TransactionBuilder = void 0;
const SHA3 = __importStar(require("js-sha3"));
const buffer_1 = require("buffer/");
const aptos_types_1 = require("./aptos_types");
const bcs_1 = require("./bcs");
const RAW_TRANSACTION_SALT = 'APTOS::RawTransaction';
const RAW_TRANSACTION_WITH_DATA_SALT = 'APTOS::RawTransactionWithData';
class TransactionBuilder {
    constructor(signingFunction) {
        this.signingFunction = signingFunction;
    }
    /** Generates a Signing Message out of a raw transaction. */
    static getSigningMessage(rawTxn) {
        const hash = SHA3.sha3_256.create();
        if (rawTxn instanceof aptos_types_1.RawTransaction) {
            hash.update(buffer_1.Buffer.from(RAW_TRANSACTION_SALT));
        }
        else if (rawTxn instanceof aptos_types_1.MultiAgentRawTransaction) {
            hash.update(buffer_1.Buffer.from(RAW_TRANSACTION_WITH_DATA_SALT));
        }
        else {
            throw new Error('Unknown transaction type.');
        }
        const prefix = new Uint8Array(hash.arrayBuffer());
        return buffer_1.Buffer.from([...prefix, ...(0, bcs_1.bcsToBytes)(rawTxn)]);
    }
}
exports.TransactionBuilder = TransactionBuilder;
/**
 * Provides signing method for signing a raw transaction with single public key.
 */
class TransactionBuilderEd25519 extends TransactionBuilder {
    constructor(signingFunction, publicKey) {
        super(signingFunction);
        this.publicKey = publicKey;
    }
    signInternal(rawTxn) {
        const signingMessage = TransactionBuilder.getSigningMessage(rawTxn);
        const signature = this.signingFunction(signingMessage);
        const authenticator = new aptos_types_1.TransactionAuthenticatorEd25519(new aptos_types_1.Ed25519PublicKey(this.publicKey), signature);
        return new aptos_types_1.SignedTransaction(rawTxn, authenticator);
    }
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn) {
        return (0, bcs_1.bcsToBytes)(this.signInternal(rawTxn));
    }
}
exports.TransactionBuilderEd25519 = TransactionBuilderEd25519;
/**
 * Provides signing method for signing a raw transaction with multisig public key.
 */
class TransactionBuilderMultiEd25519 extends TransactionBuilder {
    constructor(signingFunction, publicKey) {
        super(signingFunction);
        this.publicKey = publicKey;
    }
    signInternal(rawTxn) {
        const signingMessage = TransactionBuilder.getSigningMessage(rawTxn);
        const signature = this.signingFunction(signingMessage);
        const authenticator = new aptos_types_1.TransactionAuthenticatorMultiEd25519(this.publicKey, signature);
        return new aptos_types_1.SignedTransaction(rawTxn, authenticator);
    }
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn) {
        return (0, bcs_1.bcsToBytes)(this.signInternal(rawTxn));
    }
}
exports.TransactionBuilderMultiEd25519 = TransactionBuilderMultiEd25519;
//# sourceMappingURL=builder.js.map