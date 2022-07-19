"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAuthenticatorMultiEd25519 = exports.AccountAuthenticatorEd25519 = exports.AccountAuthenticator = exports.TransactionAuthenticatorMultiAgent = exports.TransactionAuthenticatorMultiEd25519 = exports.TransactionAuthenticatorEd25519 = exports.TransactionAuthenticator = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const bcs_1 = require("../bcs");
const account_address_1 = require("./account_address");
const ed25519_1 = require("./ed25519");
const multi_ed25519_1 = require("./multi_ed25519");
class TransactionAuthenticator {
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TransactionAuthenticatorEd25519.load(deserializer);
            case 1:
                return TransactionAuthenticatorMultiEd25519.load(deserializer);
            case 2:
                return TransactionAuthenticatorMultiAgent.load(deserializer);
            default:
                throw new Error(`Unknown variant index for TransactionAuthenticator: ${index}`);
        }
    }
}
exports.TransactionAuthenticator = TransactionAuthenticator;
class TransactionAuthenticatorEd25519 extends TransactionAuthenticator {
    /**
     * An authenticator for single signature.
     *
     * @param public_key Client's public key.
     * @param signature Signature of a raw transaction.
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     * for details about generating a signature.
     */
    constructor(public_key, signature) {
        super();
        this.public_key = public_key;
        this.signature = signature;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(0);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    }
    static load(deserializer) {
        const public_key = ed25519_1.Ed25519PublicKey.deserialize(deserializer);
        const signature = ed25519_1.Ed25519Signature.deserialize(deserializer);
        return new TransactionAuthenticatorEd25519(public_key, signature);
    }
}
exports.TransactionAuthenticatorEd25519 = TransactionAuthenticatorEd25519;
class TransactionAuthenticatorMultiEd25519 extends TransactionAuthenticator {
    /**
     * An authenticator for multiple signatures.
     *
     * @param public_key
     * @param signature
     *
     */
    constructor(public_key, signature) {
        super();
        this.public_key = public_key;
        this.signature = signature;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(1);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    }
    static load(deserializer) {
        const public_key = multi_ed25519_1.MultiEd25519PublicKey.deserialize(deserializer);
        const signature = multi_ed25519_1.MultiEd25519Signature.deserialize(deserializer);
        return new TransactionAuthenticatorMultiEd25519(public_key, signature);
    }
}
exports.TransactionAuthenticatorMultiEd25519 = TransactionAuthenticatorMultiEd25519;
class TransactionAuthenticatorMultiAgent extends TransactionAuthenticator {
    constructor(sender, secondary_signer_addresses, secondary_signers) {
        super();
        this.sender = sender;
        this.secondary_signer_addresses = secondary_signer_addresses;
        this.secondary_signers = secondary_signers;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(2);
        this.sender.serialize(serializer);
        (0, bcs_1.serializeVector)(this.secondary_signer_addresses, serializer);
        (0, bcs_1.serializeVector)(this.secondary_signers, serializer);
    }
    static load(deserializer) {
        const sender = AccountAuthenticator.deserialize(deserializer);
        const secondary_signer_addresses = (0, bcs_1.deserializeVector)(deserializer, account_address_1.AccountAddress);
        const secondary_signers = (0, bcs_1.deserializeVector)(deserializer, AccountAuthenticator);
        return new TransactionAuthenticatorMultiAgent(sender, secondary_signer_addresses, secondary_signers);
    }
}
exports.TransactionAuthenticatorMultiAgent = TransactionAuthenticatorMultiAgent;
class AccountAuthenticator {
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return AccountAuthenticatorEd25519.load(deserializer);
            case 1:
                return AccountAuthenticatorMultiEd25519.load(deserializer);
            default:
                throw new Error(`Unknown variant index for AccountAuthenticator: ${index}`);
        }
    }
}
exports.AccountAuthenticator = AccountAuthenticator;
class AccountAuthenticatorEd25519 extends AccountAuthenticator {
    constructor(public_key, signature) {
        super();
        this.public_key = public_key;
        this.signature = signature;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(0);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    }
    static load(deserializer) {
        const public_key = ed25519_1.Ed25519PublicKey.deserialize(deserializer);
        const signature = ed25519_1.Ed25519Signature.deserialize(deserializer);
        return new AccountAuthenticatorEd25519(public_key, signature);
    }
}
exports.AccountAuthenticatorEd25519 = AccountAuthenticatorEd25519;
class AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
    constructor(public_key, signature) {
        super();
        this.public_key = public_key;
        this.signature = signature;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(1);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    }
    static load(deserializer) {
        const public_key = multi_ed25519_1.MultiEd25519PublicKey.deserialize(deserializer);
        const signature = multi_ed25519_1.MultiEd25519Signature.deserialize(deserializer);
        return new AccountAuthenticatorMultiEd25519(public_key, signature);
    }
}
exports.AccountAuthenticatorMultiEd25519 = AccountAuthenticatorMultiEd25519;
//# sourceMappingURL=authenticator.js.map