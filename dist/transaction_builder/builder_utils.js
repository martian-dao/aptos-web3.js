"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.argToTransactionArgument = exports.serializeArg = exports.TypeTagParser = void 0;
const hex_string_1 = require("../hex_string");
const aptos_types_1 = require("./aptos_types");
function assertType(val, types, message) {
    if (!types?.includes(typeof val)) {
        throw new Error(message || `Invalid arg: ${val} type should be ${types instanceof Array ? types.join(" or ") : types}`);
    }
}
function bail(message) {
    throw new Error(message);
}
function isWhiteSpace(c) {
    if (c.match(/\s/)) {
        return true;
    }
    return false;
}
function isValidAlphabetic(c) {
    if (c.match(/[_A-Za-z0-9]/g)) {
        return true;
    }
    return false;
}
// Returns Token and Token byte size
function nextToken(tagStr, pos) {
    const c = tagStr[pos];
    if (c === ":") {
        if (tagStr.slice(pos, pos + 2) === "::") {
            return [["COLON", "::"], 2];
        }
        bail("Unrecognized token.");
    }
    else if (c === "<") {
        return [["LT", "<"], 1];
    }
    else if (c === ">") {
        return [["GT", ">"], 1];
    }
    else if (c === ",") {
        return [["COMMA", ","], 1];
    }
    else if (isWhiteSpace(c)) {
        let res = "";
        for (let i = pos; i < tagStr.length; i += 1) {
            const char = tagStr[i];
            if (isWhiteSpace(char)) {
                res = `${res}${char}`;
            }
            else {
                break;
            }
        }
        return [["SPACE", res], res.length];
    }
    else if (isValidAlphabetic(c)) {
        let res = "";
        for (let i = pos; i < tagStr.length; i += 1) {
            const char = tagStr[i];
            if (isValidAlphabetic(char)) {
                res = `${res}${char}`;
            }
            else {
                break;
            }
        }
        return [["IDENT", res], res.length];
    }
    throw new Error("Unrecognized token.");
}
function tokenize(tagStr) {
    let pos = 0;
    const tokens = [];
    while (pos < tagStr.length) {
        const [token, size] = nextToken(tagStr, pos);
        if (token[0] !== "SPACE") {
            tokens.push(token);
        }
        pos += size;
    }
    return tokens;
}
/**
 * Parser to parse a type tag string
 */
class TypeTagParser {
    constructor(tagStr) {
        this.tokens = tokenize(tagStr);
    }
    consume(targetToken) {
        const token = this.tokens.shift();
        if (!token || token[1] !== targetToken) {
            bail("Invalid type tag.");
        }
    }
    parseCommaList(endToken, allowTraillingComma) {
        const res = [];
        if (this.tokens.length <= 0) {
            bail("Invalid type tag.");
        }
        while (this.tokens[0][1] !== endToken) {
            res.push(this.parseTypeTag());
            if (this.tokens.length > 0 && this.tokens[0][1] === endToken) {
                break;
            }
            this.consume(",");
            if (this.tokens.length > 0 && this.tokens[0][1] === endToken && allowTraillingComma) {
                break;
            }
            if (this.tokens.length <= 0) {
                bail("Invalid type tag.");
            }
        }
        return res;
    }
    parseTypeTag() {
        if (this.tokens.length === 0) {
            bail("Invalid type tag.");
        }
        // Pop left most element out
        const [tokenTy, tokenVal] = this.tokens.shift();
        if (tokenVal === "u8") {
            return new aptos_types_1.TypeTagU8();
        }
        if (tokenVal === "u64") {
            return new aptos_types_1.TypeTagU64();
        }
        if (tokenVal === "u128") {
            return new aptos_types_1.TypeTagU128();
        }
        if (tokenVal === "bool") {
            return new aptos_types_1.TypeTagBool();
        }
        if (tokenVal === "address") {
            return new aptos_types_1.TypeTagAddress();
        }
        if (tokenVal === "vector") {
            this.consume("<");
            const res = this.parseTypeTag();
            this.consume(">");
            return new aptos_types_1.TypeTagVector(res);
        }
        if (tokenTy === "IDENT" && (tokenVal.startsWith("0x") || tokenVal.startsWith("0X"))) {
            const address = tokenVal;
            this.consume("::");
            const [moduleTokenTy, module] = this.tokens.shift();
            if (moduleTokenTy !== "IDENT") {
                bail("Invalid type tag.");
            }
            this.consume("::");
            const [nameTokenTy, name] = this.tokens.shift();
            if (nameTokenTy !== "IDENT") {
                bail("Invalid type tag.");
            }
            let tyTags = [];
            // Check if the struct has ty args
            if (this.tokens.length > 0 && this.tokens[0][1] === "<") {
                this.consume("<");
                tyTags = this.parseCommaList(">", true);
                this.consume(">");
            }
            const structTag = new aptos_types_1.StructTag(aptos_types_1.AccountAddress.fromHex(address), new aptos_types_1.Identifier(module), new aptos_types_1.Identifier(name), tyTags);
            return new aptos_types_1.TypeTagStruct(structTag);
        }
        throw new Error("Invalid type tag.");
    }
}
exports.TypeTagParser = TypeTagParser;
function serializeArg(argVal, argType, serializer) {
    if (argType instanceof aptos_types_1.TypeTagBool) {
        assertType(argVal, "boolean");
        serializer.serializeBool(argVal);
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU8) {
        assertType(argVal, "number");
        serializer.serializeU8(argVal);
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU64) {
        assertType(argVal, ["number", "bigint"]);
        serializer.serializeU64(argVal);
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagU128) {
        assertType(argVal, ["number", "bigint"]);
        serializer.serializeU128(argVal);
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagAddress) {
        let addr;
        if (typeof argVal === "string" || argVal instanceof hex_string_1.HexString) {
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
        if (!(argVal instanceof Array)) {
            throw new Error("Invalid vector args.");
        }
        serializer.serializeU32AsUleb128(argVal.length);
        argVal.forEach((arg) => serializeArg(arg, argType.value, serializer));
        return;
    }
    if (argType instanceof aptos_types_1.TypeTagStruct) {
        const { address, module_name: moduleName, name } = argType.value;
        if (`${hex_string_1.HexString.fromUint8Array(address.address).toShortString()}::${moduleName.value}::${name.value}` !==
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
        assertType(argVal, "boolean");
        return new aptos_types_1.TransactionArgumentBool(argVal);
    }
    if (argType instanceof aptos_types_1.TypeTagU8) {
        assertType(argVal, "number");
        return new aptos_types_1.TransactionArgumentU8(argVal);
    }
    if (argType instanceof aptos_types_1.TypeTagU64) {
        assertType(argVal, ["number", "bigint"]);
        return new aptos_types_1.TransactionArgumentU64(argVal);
    }
    if (argType instanceof aptos_types_1.TypeTagU128) {
        assertType(argVal, ["number", "bigint"]);
        return new aptos_types_1.TransactionArgumentU128(argVal);
    }
    if (argType instanceof aptos_types_1.TypeTagAddress) {
        let addr;
        if (typeof argVal === "string") {
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