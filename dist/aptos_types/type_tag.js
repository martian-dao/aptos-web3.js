"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeTagParserError = exports.TypeTagParser = exports.objectStructTag = exports.optionStructTag = exports.stringStructTag = exports.StructTag = exports.TypeTagStruct = exports.TypeTagVector = exports.TypeTagSigner = exports.TypeTagAddress = exports.TypeTagU256 = exports.TypeTagU128 = exports.TypeTagU64 = exports.TypeTagU32 = exports.TypeTagU16 = exports.TypeTagU8 = exports.TypeTagBool = exports.TypeTag = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
const account_address_1 = require("./account_address");
const bcs_1 = require("../bcs");
const identifier_1 = require("./identifier");
class TypeTag {
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TypeTagBool.load(deserializer);
            case 1:
                return TypeTagU8.load(deserializer);
            case 2:
                return TypeTagU64.load(deserializer);
            case 3:
                return TypeTagU128.load(deserializer);
            case 4:
                return TypeTagAddress.load(deserializer);
            case 5:
                return TypeTagSigner.load(deserializer);
            case 6:
                return TypeTagVector.load(deserializer);
            case 7:
                return TypeTagStruct.load(deserializer);
            case 8:
                return TypeTagU16.load(deserializer);
            case 9:
                return TypeTagU32.load(deserializer);
            case 10:
                return TypeTagU256.load(deserializer);
            default:
                throw new Error(`Unknown variant index for TypeTag: ${index}`);
        }
    }
}
exports.TypeTag = TypeTag;
class TypeTagBool extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(0);
    }
    static load(_deserializer) {
        return new TypeTagBool();
    }
}
exports.TypeTagBool = TypeTagBool;
class TypeTagU8 extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(1);
    }
    static load(_deserializer) {
        return new TypeTagU8();
    }
}
exports.TypeTagU8 = TypeTagU8;
class TypeTagU16 extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(8);
    }
    static load(_deserializer) {
        return new TypeTagU16();
    }
}
exports.TypeTagU16 = TypeTagU16;
class TypeTagU32 extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(9);
    }
    static load(_deserializer) {
        return new TypeTagU32();
    }
}
exports.TypeTagU32 = TypeTagU32;
class TypeTagU64 extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(2);
    }
    static load(_deserializer) {
        return new TypeTagU64();
    }
}
exports.TypeTagU64 = TypeTagU64;
class TypeTagU128 extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(3);
    }
    static load(_deserializer) {
        return new TypeTagU128();
    }
}
exports.TypeTagU128 = TypeTagU128;
class TypeTagU256 extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(10);
    }
    static load(_deserializer) {
        return new TypeTagU256();
    }
}
exports.TypeTagU256 = TypeTagU256;
class TypeTagAddress extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(4);
    }
    static load(_deserializer) {
        return new TypeTagAddress();
    }
}
exports.TypeTagAddress = TypeTagAddress;
class TypeTagSigner extends TypeTag {
    serialize(serializer) {
        serializer.serializeU32AsUleb128(5);
    }
    static load(_deserializer) {
        return new TypeTagSigner();
    }
}
exports.TypeTagSigner = TypeTagSigner;
class TypeTagVector extends TypeTag {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(6);
        this.value.serialize(serializer);
    }
    static load(deserializer) {
        const value = TypeTag.deserialize(deserializer);
        return new TypeTagVector(value);
    }
}
exports.TypeTagVector = TypeTagVector;
class TypeTagStruct extends TypeTag {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(7);
        this.value.serialize(serializer);
    }
    static load(deserializer) {
        const value = StructTag.deserialize(deserializer);
        return new TypeTagStruct(value);
    }
    isStringTypeTag() {
        if (this.value.module_name.value === "string" &&
            this.value.name.value === "String" &&
            this.value.address.toHexString() === account_address_1.AccountAddress.CORE_CODE_ADDRESS.toHexString()) {
            return true;
        }
        return false;
    }
}
exports.TypeTagStruct = TypeTagStruct;
class StructTag {
    constructor(address, module_name, name, type_args) {
        this.address = address;
        this.module_name = module_name;
        this.name = name;
        this.type_args = type_args;
    }
    /**
     * Converts a string literal to a StructTag
     * @param structTag String literal in format "AcountAddress::module_name::ResourceName",
     *   e.g. "0x1::aptos_coin::AptosCoin"
     * @returns
     */
    static fromString(structTag) {
        // Use the TypeTagParser to parse the string literal into a TypeTagStruct
        const typeTagStruct = new TypeTagParser(structTag).parseTypeTag();
        // Convert and return as a StructTag
        return new StructTag(typeTagStruct.value.address, typeTagStruct.value.module_name, typeTagStruct.value.name, typeTagStruct.value.type_args);
    }
    serialize(serializer) {
        this.address.serialize(serializer);
        this.module_name.serialize(serializer);
        this.name.serialize(serializer);
        (0, bcs_1.serializeVector)(this.type_args, serializer);
    }
    static deserialize(deserializer) {
        const address = account_address_1.AccountAddress.deserialize(deserializer);
        const moduleName = identifier_1.Identifier.deserialize(deserializer);
        const name = identifier_1.Identifier.deserialize(deserializer);
        const typeArgs = (0, bcs_1.deserializeVector)(deserializer, TypeTag);
        return new StructTag(address, moduleName, name, typeArgs);
    }
}
exports.StructTag = StructTag;
exports.stringStructTag = new StructTag(account_address_1.AccountAddress.fromHex("0x1"), new identifier_1.Identifier("string"), new identifier_1.Identifier("String"), []);
function optionStructTag(typeArg) {
    return new StructTag(account_address_1.AccountAddress.fromHex("0x1"), new identifier_1.Identifier("option"), new identifier_1.Identifier("Option"), [typeArg]);
}
exports.optionStructTag = optionStructTag;
function objectStructTag(typeArg) {
    return new StructTag(account_address_1.AccountAddress.fromHex("0x1"), new identifier_1.Identifier("object"), new identifier_1.Identifier("Object"), [typeArg]);
}
exports.objectStructTag = objectStructTag;
function bail(message) {
    throw new TypeTagParserError(message);
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
// Generic format is T<digits> - for example T1, T2, T10
function isGeneric(c) {
    if (c.match(/T\d+/g)) {
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
        if (isGeneric(res)) {
            return [["GENERIC", res], res.length];
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
    constructor(tagStr, typeTags) {
        this.typeTags = [];
        this.tokens = tokenize(tagStr);
        this.typeTags = typeTags || [];
    }
    consume(targetToken) {
        const token = this.tokens.shift();
        if (!token || token[1] !== targetToken) {
            bail("Invalid type tag.");
        }
    }
    /**
     * Consumes all of an unused generic field, mostly applicable to object
     *
     * Note: This is recursive.  it can be problematic if there's bad input
     * @private
     */
    consumeWholeGeneric() {
        this.consume("<");
        while (this.tokens[0][1] !== ">") {
            // If it is nested, we have to consume another nested generic
            if (this.tokens[0][1] === "<") {
                this.consumeWholeGeneric();
            }
            this.tokens.shift();
        }
        this.consume(">");
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
            return new TypeTagU8();
        }
        if (tokenVal === "u16") {
            return new TypeTagU16();
        }
        if (tokenVal === "u32") {
            return new TypeTagU32();
        }
        if (tokenVal === "u64") {
            return new TypeTagU64();
        }
        if (tokenVal === "u128") {
            return new TypeTagU128();
        }
        if (tokenVal === "u256") {
            return new TypeTagU256();
        }
        if (tokenVal === "bool") {
            return new TypeTagBool();
        }
        if (tokenVal === "address") {
            return new TypeTagAddress();
        }
        if (tokenVal === "vector") {
            this.consume("<");
            const res = this.parseTypeTag();
            this.consume(">");
            return new TypeTagVector(res);
        }
        if (tokenVal === "string") {
            return exports.stringStructTag;
        }
        if (tokenTy === "IDENT" && (tokenVal.startsWith("0x") || tokenVal.startsWith("0X"))) {
            const address = account_address_1.AccountAddress.fromHex(tokenVal);
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
            // Objects can contain either concrete types e.g. 0x1::object::ObjectCore or generics e.g. T
            // Neither matter as we can't do type checks, so just the address applies and we consume the entire generic.
            // TODO: Support parsing structs that don't come from core code address
            if (account_address_1.AccountAddress.CORE_CODE_ADDRESS.toHexString() === address.toHexString() &&
                module === "object" &&
                name === "Object") {
                this.consumeWholeGeneric();
                return new TypeTagAddress();
            }
            let tyTags = [];
            // Check if the struct has ty args
            if (this.tokens.length > 0 && this.tokens[0][1] === "<") {
                this.consume("<");
                tyTags = this.parseCommaList(">", true);
                this.consume(">");
            }
            const structTag = new StructTag(address, new identifier_1.Identifier(module), new identifier_1.Identifier(name), tyTags);
            return new TypeTagStruct(structTag);
        }
        if (tokenTy === "GENERIC") {
            if (this.typeTags.length === 0) {
                bail("Can't convert generic type since no typeTags were specified.");
            }
            // a generic tokenVal has the format of `T<digit>`, for example `T1`.
            // The digit (i.e 1) indicates the the index of this type in the typeTags array.
            // For a tokenVal == T1, should be parsed as the type in typeTags[1]
            const idx = parseInt(tokenVal.substring(1), 10);
            return new TypeTagParser(this.typeTags[idx]).parseTypeTag();
        }
        throw new Error("Invalid type tag.");
    }
}
exports.TypeTagParser = TypeTagParser;
class TypeTagParserError extends Error {
    constructor(message) {
        super(message);
        this.name = "TypeTagParserError";
    }
}
exports.TypeTagParserError = TypeTagParserError;
//# sourceMappingURL=type_tag.js.map