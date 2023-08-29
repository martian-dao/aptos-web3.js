"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryFunctionABI = exports.TransactionScriptABI = exports.ScriptABI = exports.ArgumentABI = exports.TypeArgumentABI = void 0;
const bcs_1 = require("../bcs");
const transaction_1 = require("./transaction");
const type_tag_1 = require("./type_tag");
class TypeArgumentABI {
    /**
     * Constructs a TypeArgumentABI instance.
     * @param name
     */
    constructor(name) {
        this.name = name;
    }
    serialize(serializer) {
        serializer.serializeStr(this.name);
    }
    static deserialize(deserializer) {
        const name = deserializer.deserializeStr();
        return new TypeArgumentABI(name);
    }
}
exports.TypeArgumentABI = TypeArgumentABI;
class ArgumentABI {
    /**
     * Constructs an ArgumentABI instance.
     * @param name
     * @param type_tag
     */
    constructor(name, type_tag) {
        this.name = name;
        this.type_tag = type_tag;
    }
    serialize(serializer) {
        serializer.serializeStr(this.name);
        this.type_tag.serialize(serializer);
    }
    static deserialize(deserializer) {
        const name = deserializer.deserializeStr();
        const typeTag = type_tag_1.TypeTag.deserialize(deserializer);
        return new ArgumentABI(name, typeTag);
    }
}
exports.ArgumentABI = ArgumentABI;
class ScriptABI {
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TransactionScriptABI.load(deserializer);
            case 1:
                return EntryFunctionABI.load(deserializer);
            default:
                throw new Error(`Unknown variant index for TransactionPayload: ${index}`);
        }
    }
}
exports.ScriptABI = ScriptABI;
class TransactionScriptABI extends ScriptABI {
    /**
     * Constructs a TransactionScriptABI instance.
     * @param name Entry function name
     * @param doc
     * @param code
     * @param ty_args
     * @param args
     */
    constructor(name, doc, code, ty_args, args) {
        super();
        this.name = name;
        this.doc = doc;
        this.code = code;
        this.ty_args = ty_args;
        this.args = args;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(0);
        serializer.serializeStr(this.name);
        serializer.serializeStr(this.doc);
        serializer.serializeBytes(this.code);
        (0, bcs_1.serializeVector)(this.ty_args, serializer);
        (0, bcs_1.serializeVector)(this.args, serializer);
    }
    static load(deserializer) {
        const name = deserializer.deserializeStr();
        const doc = deserializer.deserializeStr();
        const code = deserializer.deserializeBytes();
        const tyArgs = (0, bcs_1.deserializeVector)(deserializer, TypeArgumentABI);
        const args = (0, bcs_1.deserializeVector)(deserializer, ArgumentABI);
        return new TransactionScriptABI(name, doc, code, tyArgs, args);
    }
}
exports.TransactionScriptABI = TransactionScriptABI;
class EntryFunctionABI extends ScriptABI {
    /**
     * Constructs a EntryFunctionABI instance
     * @param name
     * @param module_name Fully qualified module id
     * @param doc
     * @param ty_args
     * @param args
     */
    constructor(name, module_name, doc, ty_args, args) {
        super();
        this.name = name;
        this.module_name = module_name;
        this.doc = doc;
        this.ty_args = ty_args;
        this.args = args;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(1);
        serializer.serializeStr(this.name);
        this.module_name.serialize(serializer);
        serializer.serializeStr(this.doc);
        (0, bcs_1.serializeVector)(this.ty_args, serializer);
        (0, bcs_1.serializeVector)(this.args, serializer);
    }
    static load(deserializer) {
        const name = deserializer.deserializeStr();
        const moduleName = transaction_1.ModuleId.deserialize(deserializer);
        const doc = deserializer.deserializeStr();
        const tyArgs = (0, bcs_1.deserializeVector)(deserializer, TypeArgumentABI);
        const args = (0, bcs_1.deserializeVector)(deserializer, ArgumentABI);
        return new EntryFunctionABI(name, moduleName, doc, tyArgs, args);
    }
}
exports.EntryFunctionABI = EntryFunctionABI;
//# sourceMappingURL=abi.js.map