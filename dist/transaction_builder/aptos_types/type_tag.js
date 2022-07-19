"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructTag = exports.TypeTagStruct = exports.TypeTagVector = exports.TypeTagSigner = exports.TypeTagAddress = exports.TypeTagU128 = exports.TypeTagU64 = exports.TypeTagU8 = exports.TypeTagBool = exports.TypeTag = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
const bcs_1 = require("../bcs");
const account_address_1 = require("./account_address");
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
    static load(deserializer) {
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
     * @param structTag String literal in format "AcountAddress::ModuleName::ResourceName",
     *   e.g. "0x01::TestCoin::TestCoin"
     * @returns
     */
    static fromString(structTag) {
        // Type args are not supported in string literal
        if (structTag.includes('<')) {
            throw new Error('Not implemented');
        }
        const parts = structTag.split('::');
        if (parts.length !== 3) {
            throw new Error('Invalid struct tag string literal.');
        }
        return new StructTag(account_address_1.AccountAddress.fromHex(parts[0]), new identifier_1.Identifier(parts[1]), new identifier_1.Identifier(parts[2]), []);
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
//# sourceMappingURL=type_tag.js.map