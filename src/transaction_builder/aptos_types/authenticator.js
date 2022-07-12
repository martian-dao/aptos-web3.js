"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.AccountAuthenticatorMultiEd25519 = exports.AccountAuthenticatorEd25519 = exports.AccountAuthenticator = exports.TransactionAuthenticatorMultiAgent = exports.TransactionAuthenticatorMultiEd25519 = exports.TransactionAuthenticatorEd25519 = exports.TransactionAuthenticator = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
var bcs_1 = require("../bcs");
var account_address_1 = require("./account_address");
var ed25519_1 = require("./ed25519");
var multi_ed25519_1 = require("./multi_ed25519");
var TransactionAuthenticator = /** @class */ (function () {
    function TransactionAuthenticator() {
    }
    TransactionAuthenticator.deserialize = function (deserializer) {
        var index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TransactionAuthenticatorEd25519.load(deserializer);
            case 1:
                return TransactionAuthenticatorMultiEd25519.load(deserializer);
            case 2:
                return TransactionAuthenticatorMultiAgent.load(deserializer);
            default:
                throw new Error("Unknown variant index for TransactionAuthenticator: ".concat(index));
        }
    };
    return TransactionAuthenticator;
}());
exports.TransactionAuthenticator = TransactionAuthenticator;
var TransactionAuthenticatorEd25519 = /** @class */ (function (_super) {
    __extends(TransactionAuthenticatorEd25519, _super);
    /**
     * An authenticator for single signature.
     *
     * @param public_key Client's public key.
     * @param signature Signature of a raw transaction.
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     * for details about generating a signature.
     */
    function TransactionAuthenticatorEd25519(public_key, signature) {
        var _this = _super.call(this) || this;
        _this.public_key = public_key;
        _this.signature = signature;
        return _this;
    }
    TransactionAuthenticatorEd25519.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(0);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    };
    TransactionAuthenticatorEd25519.load = function (deserializer) {
        var public_key = ed25519_1.Ed25519PublicKey.deserialize(deserializer);
        var signature = ed25519_1.Ed25519Signature.deserialize(deserializer);
        return new TransactionAuthenticatorEd25519(public_key, signature);
    };
    return TransactionAuthenticatorEd25519;
}(TransactionAuthenticator));
exports.TransactionAuthenticatorEd25519 = TransactionAuthenticatorEd25519;
var TransactionAuthenticatorMultiEd25519 = /** @class */ (function (_super) {
    __extends(TransactionAuthenticatorMultiEd25519, _super);
    /**
     * An authenticator for multiple signatures.
     *
     * @param public_key
     * @param signature
     *
     */
    function TransactionAuthenticatorMultiEd25519(public_key, signature) {
        var _this = _super.call(this) || this;
        _this.public_key = public_key;
        _this.signature = signature;
        return _this;
    }
    TransactionAuthenticatorMultiEd25519.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(1);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    };
    TransactionAuthenticatorMultiEd25519.load = function (deserializer) {
        var public_key = multi_ed25519_1.MultiEd25519PublicKey.deserialize(deserializer);
        var signature = multi_ed25519_1.MultiEd25519Signature.deserialize(deserializer);
        return new TransactionAuthenticatorMultiEd25519(public_key, signature);
    };
    return TransactionAuthenticatorMultiEd25519;
}(TransactionAuthenticator));
exports.TransactionAuthenticatorMultiEd25519 = TransactionAuthenticatorMultiEd25519;
var TransactionAuthenticatorMultiAgent = /** @class */ (function (_super) {
    __extends(TransactionAuthenticatorMultiAgent, _super);
    function TransactionAuthenticatorMultiAgent(sender, secondary_signer_addresses, secondary_signers) {
        var _this = _super.call(this) || this;
        _this.sender = sender;
        _this.secondary_signer_addresses = secondary_signer_addresses;
        _this.secondary_signers = secondary_signers;
        return _this;
    }
    TransactionAuthenticatorMultiAgent.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(2);
        this.sender.serialize(serializer);
        (0, bcs_1.serializeVector)(this.secondary_signer_addresses, serializer);
        (0, bcs_1.serializeVector)(this.secondary_signers, serializer);
    };
    TransactionAuthenticatorMultiAgent.load = function (deserializer) {
        var sender = AccountAuthenticator.deserialize(deserializer);
        var secondary_signer_addresses = (0, bcs_1.deserializeVector)(deserializer, account_address_1.AccountAddress);
        var secondary_signers = (0, bcs_1.deserializeVector)(deserializer, AccountAuthenticator);
        return new TransactionAuthenticatorMultiAgent(sender, secondary_signer_addresses, secondary_signers);
    };
    return TransactionAuthenticatorMultiAgent;
}(TransactionAuthenticator));
exports.TransactionAuthenticatorMultiAgent = TransactionAuthenticatorMultiAgent;
var AccountAuthenticator = /** @class */ (function () {
    function AccountAuthenticator() {
    }
    AccountAuthenticator.deserialize = function (deserializer) {
        var index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return AccountAuthenticatorEd25519.load(deserializer);
            case 1:
                return AccountAuthenticatorMultiEd25519.load(deserializer);
            default:
                throw new Error("Unknown variant index for AccountAuthenticator: ".concat(index));
        }
    };
    return AccountAuthenticator;
}());
exports.AccountAuthenticator = AccountAuthenticator;
var AccountAuthenticatorEd25519 = /** @class */ (function (_super) {
    __extends(AccountAuthenticatorEd25519, _super);
    function AccountAuthenticatorEd25519(public_key, signature) {
        var _this = _super.call(this) || this;
        _this.public_key = public_key;
        _this.signature = signature;
        return _this;
    }
    AccountAuthenticatorEd25519.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(0);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    };
    AccountAuthenticatorEd25519.load = function (deserializer) {
        var public_key = ed25519_1.Ed25519PublicKey.deserialize(deserializer);
        var signature = ed25519_1.Ed25519Signature.deserialize(deserializer);
        return new AccountAuthenticatorEd25519(public_key, signature);
    };
    return AccountAuthenticatorEd25519;
}(AccountAuthenticator));
exports.AccountAuthenticatorEd25519 = AccountAuthenticatorEd25519;
var AccountAuthenticatorMultiEd25519 = /** @class */ (function (_super) {
    __extends(AccountAuthenticatorMultiEd25519, _super);
    function AccountAuthenticatorMultiEd25519(public_key, signature) {
        var _this = _super.call(this) || this;
        _this.public_key = public_key;
        _this.signature = signature;
        return _this;
    }
    AccountAuthenticatorMultiEd25519.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(1);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    };
    AccountAuthenticatorMultiEd25519.load = function (deserializer) {
        var public_key = multi_ed25519_1.MultiEd25519PublicKey.deserialize(deserializer);
        var signature = multi_ed25519_1.MultiEd25519Signature.deserialize(deserializer);
        return new AccountAuthenticatorMultiEd25519(public_key, signature);
    };
    return AccountAuthenticatorMultiEd25519;
}(AccountAuthenticator));
exports.AccountAuthenticatorMultiEd25519 = AccountAuthenticatorMultiEd25519;
