"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.argToTransactionArgument = exports.serializeArg = exports.ensureBigInt = exports.ensureNumber = exports.ensureBoolean = void 0;
const utils_1 = require("../utils");
const aptos_types_1 = require("../aptos_types");
function assertType(val, types, message) {
    if (!types?.includes(typeof val)) {
        throw new Error(message || `Invalid arg: ${val} type should be ${types instanceof Array ? types.join(" or ") : types}`);
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
    if (argType instanceof aptos_types_1.TypeTagBool) {
        serializer.serializeBool(ensureBoolean(argVal));
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU8) {
        serializer.serializeU8(ensureNumber(argVal));
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU16) {
        serializer.serializeU16(ensureNumber(argVal));
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU32) {
        serializer.serializeU32(ensureNumber(argVal));
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU64) {
        serializer.serializeU64(ensureBigInt(argVal));
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU128) {
        serializer.serializeU128(ensureBigInt(argVal));
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU256) {
        serializer.serializeU256(ensureBigInt(argVal));
        return;
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
        addr.serialize(serializer);
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagVector) {
        // We are serializing a vector<u8>
        if (argType.value instanceof aptos_types_1.TypeTagU8) {
            if (argVal instanceof Uint8Array) {
                serializer.serializeBytes(argVal);
                return;
            }
            if (typeof argVal === "string") {
                serializer.serializeStr(argVal);
                return;
            }
        }
        if (!Array.isArray(argVal)) {
            throw new Error("Invalid vector args.");
        }
        serializer.serializeU32AsUleb128(argVal.length);
        argVal.forEach((arg) => serializeArg(arg, argType.value, serializer));
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagStruct) {
        const { address, module_name: moduleName, name } = argType.value;
        if (`${utils_1.HexString.fromUint8Array(address.address).toShortString()}::${moduleName.value}::${name.value}` !==
            "0x1::string::String") {
            throw new Error("The only supported struct arg is of type 0x1::string::String");
        }
        assertType(argVal, ["string"]);
        serializer.serializeStr(argVal);
        return;
    }
    throw new Error("Unsupported arg type.");
}
exports.serializeArg = serializeArg;
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