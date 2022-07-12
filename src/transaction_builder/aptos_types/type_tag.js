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
exports.StructTag = exports.TypeTagStruct = exports.TypeTagVector = exports.TypeTagSigner = exports.TypeTagAddress = exports.TypeTagU128 = exports.TypeTagU64 = exports.TypeTagU8 = exports.TypeTagBool = exports.TypeTag = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
var bcs_1 = require("../bcs");
var account_address_1 = require("./account_address");
var identifier_1 = require("./identifier");
var TypeTag = /** @class */ (function () {
    function TypeTag() {
    }
    TypeTag.deserialize = function (deserializer) {
        var index = deserializer.deserializeUleb128AsU32();
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
                throw new Error("Unknown variant index for TypeTag: ".concat(index));
        }
    };
    return TypeTag;
}());
exports.TypeTag = TypeTag;
var TypeTagBool = /** @class */ (function (_super) {
    __extends(TypeTagBool, _super);
    function TypeTagBool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeTagBool.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(0);
    };
    TypeTagBool.load = function (deserializer) {
        return new TypeTagBool();
    };
    return TypeTagBool;
}(TypeTag));
exports.TypeTagBool = TypeTagBool;
var TypeTagU8 = /** @class */ (function (_super) {
    __extends(TypeTagU8, _super);
    function TypeTagU8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeTagU8.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(1);
    };
    TypeTagU8.load = function (_deserializer) {
        return new TypeTagU8();
    };
    return TypeTagU8;
}(TypeTag));
exports.TypeTagU8 = TypeTagU8;
var TypeTagU64 = /** @class */ (function (_super) {
    __extends(TypeTagU64, _super);
    function TypeTagU64() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeTagU64.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(2);
    };
    TypeTagU64.load = function (_deserializer) {
        return new TypeTagU64();
    };
    return TypeTagU64;
}(TypeTag));
exports.TypeTagU64 = TypeTagU64;
var TypeTagU128 = /** @class */ (function (_super) {
    __extends(TypeTagU128, _super);
    function TypeTagU128() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeTagU128.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(3);
    };
    TypeTagU128.load = function (_deserializer) {
        return new TypeTagU128();
    };
    return TypeTagU128;
}(TypeTag));
exports.TypeTagU128 = TypeTagU128;
var TypeTagAddress = /** @class */ (function (_super) {
    __extends(TypeTagAddress, _super);
    function TypeTagAddress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeTagAddress.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(4);
    };
    TypeTagAddress.load = function (_deserializer) {
        return new TypeTagAddress();
    };
    return TypeTagAddress;
}(TypeTag));
exports.TypeTagAddress = TypeTagAddress;
var TypeTagSigner = /** @class */ (function (_super) {
    __extends(TypeTagSigner, _super);
    function TypeTagSigner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypeTagSigner.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(5);
    };
    TypeTagSigner.load = function (_deserializer) {
        return new TypeTagSigner();
    };
    return TypeTagSigner;
}(TypeTag));
exports.TypeTagSigner = TypeTagSigner;
var TypeTagVector = /** @class */ (function (_super) {
    __extends(TypeTagVector, _super);
    function TypeTagVector(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TypeTagVector.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(6);
        this.value.serialize(serializer);
    };
    TypeTagVector.load = function (deserializer) {
        var value = TypeTag.deserialize(deserializer);
        return new TypeTagVector(value);
    };
    return TypeTagVector;
}(TypeTag));
exports.TypeTagVector = TypeTagVector;
var TypeTagStruct = /** @class */ (function (_super) {
    __extends(TypeTagStruct, _super);
    function TypeTagStruct(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    TypeTagStruct.prototype.serialize = function (serializer) {
        serializer.serializeU32AsUleb128(7);
        this.value.serialize(serializer);
    };
    TypeTagStruct.load = function (deserializer) {
        var value = StructTag.deserialize(deserializer);
        return new TypeTagStruct(value);
    };
    return TypeTagStruct;
}(TypeTag));
exports.TypeTagStruct = TypeTagStruct;
var StructTag = /** @class */ (function () {
    function StructTag(address, module_name, name, type_args) {
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
    StructTag.fromString = function (structTag) {
        // Type args are not supported in string literal
        if (structTag.includes('<')) {
            throw new Error('Not implemented');
        }
        var parts = structTag.split('::');
        if (parts.length !== 3) {
            throw new Error('Invalid struct tag string literal.');
        }
        return new StructTag(account_address_1.AccountAddress.fromHex(parts[0]), new identifier_1.Identifier(parts[1]), new identifier_1.Identifier(parts[2]), []);
    };
    StructTag.prototype.serialize = function (serializer) {
        this.address.serialize(serializer);
        this.module_name.serialize(serializer);
        this.name.serialize(serializer);
        (0, bcs_1.serializeVector)(this.type_args, serializer);
    };
    StructTag.deserialize = function (deserializer) {
        var address = account_address_1.AccountAddress.deserialize(deserializer);
        var moduleName = identifier_1.Identifier.deserialize(deserializer);
        var name = identifier_1.Identifier.deserialize(deserializer);
        var typeArgs = (0, bcs_1.deserializeVector)(deserializer, TypeTag);
        return new StructTag(address, moduleName, name, typeArgs);
    };
    return StructTag;
}());
exports.StructTag = StructTag;
