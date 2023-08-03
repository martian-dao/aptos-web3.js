"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.argToTransactionArgument = exports.serializeArg = exports.ensureBigInt = exports.ensureNumber = exports.ensureBoolean = void 0;
const utils_1 = require("../utils");
const aptos_types_1 = require("../aptos_types");
function assertType(val, types, message) {
    if (!types?.includes(typeof val)) {
        throw new Error(message ||
            `Invalid arg: ${val} type should be ${types instanceof Array ? types.join(" or ") : types}`);
    }
}
function ensureBoolean(val) {
    assertType(val, ["boolean", "string"]);
    if (typeof val === "boolean") {
        return val;
    }
    if (val === "true") {
        return true;
    }
    if (val === "false") {
        return false;
    }
    throw new Error("Invalid boolean string.");
}
exports.ensureBoolean = ensureBoolean;
function ensureNumber(val) {
    assertType(val, ["number", "string"]);
    if (typeof val === "number") {
        return val;
    }
    const res = Number.parseInt(val, 10);
    if (Number.isNaN(res)) {
        throw new Error("Invalid number string.");
    }
    return res;
}
exports.ensureNumber = ensureNumber;
function ensureBigInt(val) {
    assertType(val, ["number", "bigint", "string"]);
    return BigInt(val);
}
exports.ensureBigInt = ensureBigInt;
function serializeArg(argVal, argType, serializer) {
    serializeArgInner(argVal, argType, serializer, 0);
}
exports.serializeArg = serializeArg;
function serializeArgInner(argVal, argType, serializer, depth) {
    if (argType instanceof aptos_types_1.TypeTagBool) {
        serializer.serializeBool(ensureBoolean(argVal));
    }
    else if (argType instanceof aptos_types_1.TypeTagU8) {
        serializer.serializeU8(ensureNumber(argVal));
    }
    else if (argType instanceof aptos_types_1.TypeTagU16) {
        serializer.serializeU16(ensureNumber(argVal));
    }
    else if (argType instanceof aptos_types_1.TypeTagU32) {
        serializer.serializeU32(ensureNumber(argVal));
    }
    else if (argType instanceof aptos_types_1.TypeTagU64) {
        serializer.serializeU64(ensureBigInt(argVal));
    }
    else if (argType instanceof aptos_types_1.TypeTagU128) {
        serializer.serializeU128(ensureBigInt(argVal));
    }
    else if (argType instanceof aptos_types_1.TypeTagU256) {
        serializer.serializeU256(ensureBigInt(argVal));
    }
    else if (argType instanceof aptos_types_1.TypeTagAddress) {
        serializeAddress(argVal, serializer);
    }
    else if (argType instanceof aptos_types_1.TypeTagVector) {
        serializeVector(argVal, argType, serializer, depth);
    }
    else if (argType instanceof aptos_types_1.TypeTagStruct) {
        serializeStruct(argVal, argType, serializer, depth);
    }
    else {
        throw new Error("Unsupported arg type.");
    }
}
function serializeAddress(argVal, serializer) {
    let addr;
    if (typeof argVal === "string" || argVal instanceof utils_1.HexString) {
        addr = aptos_types_1.AccountAddress.fromHex(argVal);
    }
    else if (argVal instanceof aptos_types_1.AccountAddress) {
        addr = argVal;
    }
    else {
        throw new Error("Invalid account address.");
    }
    addr.serialize(serializer);
}
function serializeVector(argVal, argType, serializer, depth) {
    // We are serializing a vector<u8>
    if (argType.value instanceof aptos_types_1.TypeTagU8) {
        if (argVal instanceof Uint8Array) {
            serializer.serializeBytes(argVal);
            return;
        }
        if (argVal instanceof utils_1.HexString) {
            serializer.serializeBytes(argVal.toUint8Array());
            return;
        }
        if (typeof argVal === "string") {
            serializer.serializeStr(argVal);
            return;
        }
        // If it isn't any of those types, then it must just be an actual array of numbers
    }
    if (!Array.isArray(argVal)) {
        throw new Error("Invalid vector args.");
    }
    serializer.serializeU32AsUleb128(argVal.length);
    argVal.forEach((arg) => serializeArgInner(arg, argType.value, serializer, depth + 1));
}
function serializeStruct(argVal, argType, serializer, depth) {
    const { address, module_name: moduleName, name, type_args: typeArgs, } = argType.value;
    const structType = `${utils_1.HexString.fromUint8Array(address.address).toShortString()}::${moduleName.value}::${name.value}`;
    if (structType === "0x1::string::String") {
        assertType(argVal, ["string"]);
        serializer.serializeStr(argVal);
    }
    else if (structType === "0x1::object::Object") {
        serializeAddress(argVal, serializer);
    }
    else if (structType === "0x1::option::Option") {
        if (typeArgs.length !== 1) {
            throw new Error(`Option has the wrong number of type arguments ${typeArgs.length}`);
        }
        serializeOption(argVal, typeArgs[0], serializer, depth);
    }
    else {
        throw new Error("Unsupported struct type in function argument");
    }
}
function serializeOption(argVal, argType, serializer, depth) {
    // For option, we determine if it's empty or not empty first
    // empty option is nothing, we specifically check for undefined to prevent fuzzy matching
    if (argVal === undefined || argVal === null) {
        serializer.serializeU32AsUleb128(0);
    }
    else {
        // Something means we need an array of 1
        serializer.serializeU32AsUleb128(1);
        // Serialize the inner type arg, ensuring that depth is tracked
        serializeArgInner(argVal, argType, serializer, depth + 1);
    }
}
function argToTransactionArgument(argVal, argType) {
    if (argType instanceof aptos_types_1.TypeTagBool) {
        return new aptos_types_1.TransactionArgumentBool(ensureBoolean(argVal));
    }
    if (argType instanceof aptos_types_1.TypeTagU8) {
        return new aptos_types_1.TransactionArgumentU8(ensureNumber(argVal));
    }
    if (argType instanceof aptos_types_1.TypeTagU16) {
        return new aptos_types_1.TransactionArgumentU16(ensureNumber(argVal));
    }
    if (argType instanceof aptos_types_1.TypeTagU32) {
        return new aptos_types_1.TransactionArgumentU32(ensureNumber(argVal));
    }
    if (argType instanceof aptos_types_1.TypeTagU64) {
        return new aptos_types_1.TransactionArgumentU64(ensureBigInt(argVal));
    }
    if (argType instanceof aptos_types_1.TypeTagU128) {
        return new aptos_types_1.TransactionArgumentU128(ensureBigInt(argVal));
    }
    if (argType instanceof aptos_types_1.TypeTagU256) {
        return new aptos_types_1.TransactionArgumentU256(ensureBigInt(argVal));
    }
    if (argType instanceof aptos_types_1.TypeTagAddress) {
        let addr;
        if (typeof argVal === "string" || argVal instanceof utils_1.HexString) {
            addr = aptos_types_1.AccountAddress.fromHex(argVal);
        }
        else if (argVal instanceof aptos_types_1.AccountAddress) {
            addr = argVal;
        }
        else {
            throw new Error("Invalid account address.");
        }
        return new aptos_types_1.TransactionArgumentAddress(addr);
    }
    if (argType instanceof aptos_types_1.TypeTagVector && argType.value instanceof aptos_types_1.TypeTagU8) {
        if (!(argVal instanceof Uint8Array)) {
            throw new Error(`${argVal} should be an instance of Uint8Array`);
        }
        return new aptos_types_1.TransactionArgumentU8Vector(argVal);
    }
    throw new Error("Unknown type for TransactionArgument.");
}
exports.argToTransactionArgument = argToTransactionArgument;
//# sourceMappingURL=builder_utils.js.map