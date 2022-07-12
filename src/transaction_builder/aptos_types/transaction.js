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
exports.TransactionArgumentBool = exports.TransactionArgumentU8Vector = exports.TransactionArgumentAddress = exports.TransactionArgumentU128 = exports.TransactionArgumentU64 = exports.TransactionArgumentU8 = exports.TransactionArgument = exports.ChainId = exports.TransactionPayloadScriptFunction = exports.TransactionPayloadModuleBundle = exports.TransactionPayloadScript = exports.TransactionPayloadWriteSet = exports.TransactionPayload = exports.MultiAgentRawTransaction = exports.RawTransactionWithData = exports.SignedTransaction = exports.WriteSet = exports.ChangeSet = exports.ModuleId = exports.ModuleBundle = exports.Module = exports.ScriptFunction = exports.Script = exports.RawTransaction = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
var hex_string_1 = require("../../hex_string");
var bcs_1 = require("../bcs");
var account_address_1 = require("./account_address");
var authenticator_1 = require("./authenticator");
var identifier_1 = require("./identifier");
var type_tag_1 = require("./type_tag");
var RawTransaction = /** @class */ (function () {
    /**
     * RawTransactions contain the metadata and payloads that can be submitted to Aptos chain for execution.
     * RawTransactions must be signed before Aptos chain can execute them.
     *
     * @param sender Account address of the sender.
     * @param sequence_number Sequence number of this transaction. This must match the sequence number stored in
     *   the sender's account at the time the transaction executes.
     * @param payload Instructions for the Aptos Blockchain, including publishing a module,
     *   execute a script function or execute a script payload.
     * @param max_gas_amount Maximum total gas to spend for this transaction. The account must have more
     *   than this gas or the transaction will be discarded during validation.
     * @param gas_unit_price Price to be paid per gas unit.
     * @param expiration_timestamp_secs The blockchain timestamp at which the blockchain would discard this transaction.
     * @param chain_id The chain ID of the blockchain that this transaction is intended to be run on.
     */
    function RawTransaction(sender, sequence_number, payload, max_gas_amount, gas_unit_price, expiration_timestamp_secs, chain_id) {
        this.sender = sender;
        this.sequence_number = sequence_number;
        this.payload = payload;
        this.max_gas_amount = max_gas_amount;
        this.gas_unit_price = gas_unit_price;
        this.expiration_timestamp_secs = expiration_timestamp_secs;
        this.chain_id = chain_id;
    }
    RawTransaction.prototype.serialize = function (serializer) {
        this.sender.serialize(serializer);
        serializer.serializeU64(this.sequence_number);
        this.payload.serialize(serializer);
        serializer.serializeU64(this.max_gas_amount);
        serializer.serializeU64(this.gas_unit_price);
        serializer.serializeU64(this.expiration_timestamp_secs);
        this.chain_id.serialize(serializer);
    };
    RawTransaction.deserialize = function (deserializer) {
        var sender = account_address_1.AccountAddress.deserialize(deserializer);
        var sequence_number = deserializer.deserializeU64();
        var payload = TransactionPayload.deserialize(deserializer);
        var max_gas_amount = deserializer.deserializeU64();
        var gas_unit_price = deserializer.deserializeU64();
        var expiration_timestamp_secs = deserializer.deserializeU64();
        var chain_id = ChainId.deserialize(deserializer);
        return new RawTransaction(sender, sequence_number, payload, max_gas_amount, gas_unit_price, expiration_timestamp_secs, chain_id);
    };
    return RawTransaction;
}());
exports.RawTransaction = RawTransaction;
var Script = /** @class */ (function () {
    /**
     * Scripts contain the Move bytecodes payload that can be submitted to Aptos chain for execution.
     * @param code Move bytecode
     * @param ty_args Type arguments that bytecode requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to bytecode function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    function Script(code, ty_args, args) {
        this.code = code;
        this.ty_args = ty_args;
        this.args = args;
    }
    Script.prototype.serialize = function (serializer) {
        serializer.serializeBytes(this.code);
        (0, bcs_1.serializeVector)(this.ty_args, serializer);
        (0, bcs_1.serializeVector)(this.args, serializer);
    };
    Script.deserialize = function (deserializer) {
        var code = deserializer.deserializeBytes();
        var ty_args = (0, bcs_1.deserializeVector)(deserializer, type_tag_1.TypeTag);
        var args = (0, bcs_1.deserializeVector)(deserializer, TransactionArgument);
        return new Script(code, ty_args, args);
    };
    return Script;
}());
exports.Script = Script;
var ScriptFunction = /** @class */ (function () {
    /**
     * Contains the payload to run a function within a module.
     * @param module_name Fullly qualified module name. ModuleId consists of account address and module name.
     * @param function_name The function to run.
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    function ScriptFunction(module_name, function_name, ty_args, args) {
        this.module_name = module_name;
        this.function_name = function_name;
        this.ty_args = ty_args;
        this.args = args;
    }
    /**
     *
     * @param module Fully qualified module name in format "AccountAddress::ModuleName" e.g. "0x1::Coin"
     * @param func Function name
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @returns
     */
    ScriptFunction.natural = function (module, func, ty_args, args) {
        return new ScriptFunction(ModuleId.fromStr(module), new identifier_1.Identifier(func), ty_args, args);
    };
    /**
     * `natual` is deprecated, please use `natural`
     *
     * @deprecated.
     */
    ScriptFunction.natual = function (module, func, ty_args, args) {
        return ScriptFunction.natural(module, func, ty_args, args);
    };
    ScriptFunction.prototype.serialize = function (serializer) {
        this.module_name.serialize(serializer);
        this.function_name.serialize(serializer);
        (0, bcs_1.serializeVector)(this.ty_args, serializer);
        serializer.serializeU32AsUleb128(this.args.length);
        this.args.forEach(function (item) {
            serializer.serializeBytes(item);
        });
    };
    ScriptFunction.deserialize = function (deserializer) {
        var module_name = ModuleId.deserialize(deserializer);
        var function_name = identifier_1.Identifier.deserialize(deserializer);
        var ty_args = (0, bcs_1.deserializeVector)(deserializer, type_tag_1.TypeTag);
        var length = deserializer.deserializeUleb128AsU32();
        var list = [];
        for (var i = 0; i < length; i += 1) {
            list.push(deserializer.deserializeBytes());
        }
        var args = list;
        return new ScriptFunction(module_name, function_name, ty_args, args);
    };
    return ScriptFunction;
}());
exports.ScriptFunction = ScriptFunction;
var Module = /** @class */ (function () {
    /**
     * Contains the bytecode of a Move module that can be published to the Aptos chain.
     * @param code Move bytecode of a module.
     */
    function Module(code) {
        this.code = code;
    }
    Module.prototype.serialize = function (serializer) {
        serializer.serializeBytes(this.code);
    };
    Module.deserialize = function (deserializer) {
        var code = deserializer.deserializeBytes();
        return new Module(code);
    };
    return Module;
}());
exports.Module = Module;
var ModuleBundle = /** @class */ (function () {
    /**
     * Contains a list of Modules that can be published together.
     * @param codes List of modules.
     */
    function ModuleBundle(codes) {
        this.codes = codes;
    }
    ModuleBundle.prototype.serialize = function (serializer) {
        (0, bcs_1.serializeVector)(this.codes, serializer);
    };
    ModuleBundle.deserialize = function (deserializer) {
        var codes = (0, bcs_1.deserializeVector)(deserializer, Module);
        return new ModuleBundle(codes);
    };
    return ModuleBundle;
}());
exports.ModuleBundle = ModuleBundle;
var ModuleId = /** @class */ (function () {
    /**
     * Full name of a module.
     * @param address The account address.
     * @param name The name of the module under the account at "address".
     */
    function ModuleId(address, name) {
        this.address = address;
        this.name = name;
    }
    /**
     * Converts a string literal to a ModuleId
     * @param moduleId String literal in format "AcountAddress::ModuleName",
     *   e.g. "0x01::Coin"
     * @returns
     */
    ModuleId.fromStr = function (moduleId) {
        var parts = moduleId.split('::');
        if (parts.length !== 2) {
            throw new Error('Invalid module id.');
        }
        return new ModuleId(account_address_1.AccountAddress.fromHex(new hex_string_1.HexString(parts[0])), new identifier_1.Identifier(parts[1]));
    };
    ModuleId.prototype.serialize = function (serializer) {
        this.address.serialize(serializer);
        this.name.serialize(serializer);
    };
    ModuleId.deserialize = function (deserializer) {
        var address = account_address_1.AccountAddress.deserialize(deserializer);
        var name = identifier_1.Identifier.deserialize(deserializer);
        return new ModuleId(address, name);
    };
    return ModuleId;
}());
exports.ModuleId = ModuleId;
var ChangeSet = /** @class */ (function () {
    function ChangeSet() {
    }
    ChangeSet.prototype.serialize = function (serializer) {
        throw new Error('Not implemented.');
    };
    ChangeSet.deserialize = function (deserializer) {
        throw new Error('Not implemented.');
    };
    return ChangeSet;
}());
exports.ChangeSet = ChangeSet;
var WriteSet = /** @class */ (function () {
    function WriteSet() {
    }
    WriteSet.prototype.serialize = function (serializer) {
        throw new Error('Not implmented.');
    };
    WriteSet.deserialize = function (deserializer) {
        throw new Error('Not implmented.');
    };
    return WriteSet;
}());
exports.WriteSet = WriteSet;
var SignedTransaction = /** @class */ (function () {
    /**
     * A SignedTransaction consists of a raw transaction and an authenticator. The authenticator
     * contains a client's public key and the signature of the raw transaction.
     *
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     *
     * @param raw_txn
     * @param authenticator Contains a client's public key and the signature of the raw transaction.
     *   Authenticator has 3 flavors: single signature, multi-signature and multi-agent.
     *   @see authenticator.ts for details.
     */
    function SignedTransaction(raw_txn, authenticator) {
        this.raw_txn = raw_txn;
        this.authenticator = authenticator;
    }
    SignedTransaction.prototype.serialize = function (serializer) {
        this.raw_txn.serialize(serializer);
        this.authenticator.serialize(serializer);
    };
    SignedTransaction.deserialize = function (deserializer) {
        var raw_txn = RawTransaction.deserialize(deserializer);
        var authenticator = authenticator_1.TransactionAuthenticator.deserialize(deserializer);
        return new SignedTransaction(raw_txn, authenticator);
    };
    return SignedTransaction;
}());
exports.SignedTransaction = SignedTransaction;
var RawTransactionWithData = /** @class */ (function () {
    function RawTransactionWithData() {
    }
    RawTransactionWithData.deserialize = function (deserializer) {
        var index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return MultiAgentRawTransaction.load(deserializer);
            default:
                throw new Error("Unknown variant index for RawTransactionWithData: ".concat(index));
        }
    };
    return RawTransactionWithData;
}());
exports.RawTransactionWithData = RawTransactionWithData;
var MultiAgentRawTransaction = /** @class */ (function (_super) {
    __extends(MultiAgentRawTransaction, _super);
    function MultiAgentRawTransaction(raw_txn, secondary_signer_addresses) {
        var _this = _super.call(this) || this;
        _this.raw_txn = raw_txn;
        _this.secondary_signer_addresses = secondary_signer_addresses;
        return _this;
    }
    MultiAgentRawTransaction.prototype.serialize = function (serializer) {
        // enum variant index
        serializer.serializeU32AsUleb128(0);
        this.raw_txn.serialize(serializer);
        (0, bcs_1.serializeVector)(this.secondary_signer_addresses, serializer);
    };
    MultiAgentRawTransaction.load = function (deserializer) {
        var rawTxn = RawTransaction.deserialize(deserializer);
        var secondarySignerAddresses = (0, bcs_1.deserializeVector)(deserializer, account_address_1.AccountAddress);
        return new MultiAgentRawTransaction(rawTxn, secondarySignerAddresses);
    };
    return MultiAgentRawTransaction;
}(RawTransactionWithData));
exports.MultiAgentRawTransaction = MultiAgentRawTransaction;
var TransactionPayload = /** @class */ (function () {
    function TransactionPayload() {
    }
    TransactionPayload.deserialize = function (deserializer) {
        var index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TransactionPayloadWriteSet.load(deserializer);
            case 1:
                return TransactionPayloadScript.load(deserializer);
            case 2:
                return TransactionPayloadModuleBundle.load(deserializer);
            case 3:
                return TransactionPayloadScriptFunction.load(deserializer);
            default:
                throw new Error("Unknown variant index for TransactionPayload: ".concat(index));
        }
    };
    return TransactionPayload;
}());
exports.TransactionPayload = TransactionPayload;
var TransactionPayloadWriteSet = /** @class */ (function (_super) {
    __extends(TransactionPayloadWriteSet, _super);
    function TransactionPayloadWriteSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransactionPayloadWriteSet.prototype.serialize = function (serializer) {
        throw new Error('Not implemented');
    };
    TransactionPayloadWriteSet.load = function (deserializer) {
        throw new Error('Not implemented');
    };
    return TransactionPayloadWriteSet;
}(TransactionPayload));
exports.TransactionPayloadWriteSet = TransactionPayloadWriteSet;
var TransactionPayloadScript = /** @class */ (function (_super) {
    __extends(TransactionPayloadScript, _super);
    function TransactionPayloadScript(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionPayloadScript.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(1);
        this.value.serialize(serializer);
    };
    TransactionPayloadScript.load = function (deserializer) {
        var value = Script.deserialize(deserializer);
        return new TransactionPayloadScript(value);
    };
    return TransactionPayloadScript;
}(TransactionPayload));
exports.TransactionPayloadScript = TransactionPayloadScript;
var TransactionPayloadModuleBundle = /** @class */ (function (_super) {
    __extends(TransactionPayloadModuleBundle, _super);
    function TransactionPayloadModuleBundle(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionPayloadModuleBundle.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(2);
        this.value.serialize(serializer);
    };
    TransactionPayloadModuleBundle.load = function (deserializer) {
        var value = ModuleBundle.deserialize(deserializer);
        return new TransactionPayloadModuleBundle(value);
    };
    return TransactionPayloadModuleBundle;
}(TransactionPayload));
exports.TransactionPayloadModuleBundle = TransactionPayloadModuleBundle;
var TransactionPayloadScriptFunction = /** @class */ (function (_super) {
    __extends(TransactionPayloadScriptFunction, _super);
    function TransactionPayloadScriptFunction(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionPayloadScriptFunction.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(3);
        this.value.serialize(serializer);
    };
    TransactionPayloadScriptFunction.load = function (deserializer) {
        var value = ScriptFunction.deserialize(deserializer);
        return new TransactionPayloadScriptFunction(value);
    };
    return TransactionPayloadScriptFunction;
}(TransactionPayload));
exports.TransactionPayloadScriptFunction = TransactionPayloadScriptFunction;
var ChainId = /** @class */ (function () {
    function ChainId(value) {
        this.value = value;
    }
    ChainId.prototype.serialize = function (serializer) {
        serializer.serializeU8(this.value);
    };
    ChainId.deserialize = function (deserializer) {
        var value = deserializer.deserializeU8();
        return new ChainId(value);
    };
    return ChainId;
}());
exports.ChainId = ChainId;
var TransactionArgument = /** @class */ (function () {
    function TransactionArgument() {
    }
    TransactionArgument.deserialize = function (deserializer) {
        var index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TransactionArgumentU8.load(deserializer);
            case 1:
                return TransactionArgumentU64.load(deserializer);
            case 2:
                return TransactionArgumentU128.load(deserializer);
            case 3:
                return TransactionArgumentAddress.load(deserializer);
            case 4:
                return TransactionArgumentU8Vector.load(deserializer);
            case 5:
                return TransactionArgumentBool.load(deserializer);
            default:
                throw new Error("Unknown variant index for TransactionArgument: ".concat(index));
        }
    };
    return TransactionArgument;
}());
exports.TransactionArgument = TransactionArgument;
var TransactionArgumentU8 = /** @class */ (function (_super) {
    __extends(TransactionArgumentU8, _super);
    function TransactionArgumentU8(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionArgumentU8.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(0);
        serializer.serializeU8(this.value);
    };
    TransactionArgumentU8.load = function (deserializer) {
        var value = deserializer.deserializeU8();
        return new TransactionArgumentU8(value);
    };
    return TransactionArgumentU8;
}(TransactionArgument));
exports.TransactionArgumentU8 = TransactionArgumentU8;
var TransactionArgumentU64 = /** @class */ (function (_super) {
    __extends(TransactionArgumentU64, _super);
    function TransactionArgumentU64(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionArgumentU64.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(1);
        serializer.serializeU64(this.value);
    };
    TransactionArgumentU64.load = function (deserializer) {
        var value = deserializer.deserializeU64();
        return new TransactionArgumentU64(value);
    };
    return TransactionArgumentU64;
}(TransactionArgument));
exports.TransactionArgumentU64 = TransactionArgumentU64;
var TransactionArgumentU128 = /** @class */ (function (_super) {
    __extends(TransactionArgumentU128, _super);
    function TransactionArgumentU128(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionArgumentU128.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(2);
        serializer.serializeU128(this.value);
    };
    TransactionArgumentU128.load = function (deserializer) {
        var value = deserializer.deserializeU128();
        return new TransactionArgumentU128(value);
    };
    return TransactionArgumentU128;
}(TransactionArgument));
exports.TransactionArgumentU128 = TransactionArgumentU128;
var TransactionArgumentAddress = /** @class */ (function (_super) {
    __extends(TransactionArgumentAddress, _super);
    function TransactionArgumentAddress(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionArgumentAddress.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(3);
        this.value.serialize(serializer);
    };
    TransactionArgumentAddress.load = function (deserializer) {
        var value = account_address_1.AccountAddress.deserialize(deserializer);
        return new TransactionArgumentAddress(value);
    };
    return TransactionArgumentAddress;
}(TransactionArgument));
exports.TransactionArgumentAddress = TransactionArgumentAddress;
var TransactionArgumentU8Vector = /** @class */ (function (_super) {
    __extends(TransactionArgumentU8Vector, _super);
    function TransactionArgumentU8Vector(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionArgumentU8Vector.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(4);
        serializer.serializeBytes(this.value);
    };
    TransactionArgumentU8Vector.load = function (deserializer) {
        var value = deserializer.deserializeBytes();
        return new TransactionArgumentU8Vector(value);
    };
    return TransactionArgumentU8Vector;
}(TransactionArgument));
exports.TransactionArgumentU8Vector = TransactionArgumentU8Vector;
var TransactionArgumentBool = /** @class */ (function (_super) {
    __extends(TransactionArgumentBool, _super);
    function TransactionArgumentBool(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TransactionArgumentBool.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(5);
        serializer.serializeBool(this.value);
    };
    TransactionArgumentBool.load = function (deserializer) {
        var value = deserializer.deserializeBool();
        return new TransactionArgumentBool(value);
    };
    return TransactionArgumentBool;
}(TransactionArgument));
exports.TransactionArgumentBool = TransactionArgumentBool;
