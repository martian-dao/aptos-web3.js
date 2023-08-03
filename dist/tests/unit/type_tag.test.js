"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_tag_1 = require("../../aptos_types/type_tag");
const bcs_1 = require("../../bcs");
const expectedTypeTag = {
    string: "0x0000000000000000000000000000000000000000000000000000000000000001::some_module::SomeResource",
    address: "0x0000000000000000000000000000000000000000000000000000000000000001",
    module_name: "some_module",
    name: "SomeResource",
};
describe("StructTag", () => {
    test("make sure StructTag.fromString works with un-nested type tag", () => {
        const structTag = type_tag_1.StructTag.fromString(expectedTypeTag.string);
        expect(structTag.address.toHexString()).toEqual(expectedTypeTag.address);
        expect(structTag.module_name.value).toEqual(expectedTypeTag.module_name);
        expect(structTag.name.value).toEqual(expectedTypeTag.name);
        expect(structTag.type_args.length).toEqual(0);
    });
    test("make sure StructTag.fromString works with nested type tag", () => {
        const structTag = type_tag_1.StructTag.fromString(`${expectedTypeTag.string}<${expectedTypeTag.string}, ${expectedTypeTag.string}>`);
        expect(structTag.address.toHexString()).toEqual(expectedTypeTag.address);
        expect(structTag.module_name.value).toEqual(expectedTypeTag.module_name);
        expect(structTag.name.value).toEqual(expectedTypeTag.name);
        expect(structTag.type_args.length).toEqual(2);
        // make sure the nested type tag is correct
        for (const typeArg of structTag.type_args) {
            const nestedTypeTag = typeArg;
            expect(nestedTypeTag.value.address.toHexString()).toEqual(expectedTypeTag.address);
            expect(nestedTypeTag.value.module_name.value).toEqual(expectedTypeTag.module_name);
            expect(nestedTypeTag.value.name.value).toEqual(expectedTypeTag.name);
            expect(nestedTypeTag.value.type_args.length).toEqual(0);
        }
    });
});
describe("TypeTagParser", () => {
    test("make sure parseTypeTag throws TypeTagParserError 'Invalid type tag' if invalid format", () => {
        let typeTag = "0x000";
        let parser = new type_tag_1.TypeTagParser(typeTag);
        try {
            parser.parseTypeTag();
        }
        catch (error) {
            expect(error).toBeInstanceOf(type_tag_1.TypeTagParserError);
            const typeTagError = error;
            expect(typeTagError.message).toEqual("Invalid type tag.");
        }
        typeTag = "0x1::some_module::SomeResource<0x1>";
        parser = new type_tag_1.TypeTagParser(typeTag);
        expect(() => parser.parseTypeTag()).toThrowError("Invalid type tag.");
    });
    test("make sure parseTypeTag works with un-nested type tag", () => {
        const parser = new type_tag_1.TypeTagParser(expectedTypeTag.string);
        const result = parser.parseTypeTag();
        expect(result.value.address.toHexString()).toEqual(expectedTypeTag.address);
        expect(result.value.module_name.value).toEqual(expectedTypeTag.module_name);
        expect(result.value.name.value).toEqual(expectedTypeTag.name);
        expect(result.value.type_args.length).toEqual(0);
    });
    test("make sure parseTypeTag works with nested type tag", () => {
        const typeTag = "0x1::some_module::SomeResource<0x1::some_module::SomeResource, 0x1::some_module::SomeResource>";
        const parser = new type_tag_1.TypeTagParser(typeTag);
        const result = parser.parseTypeTag();
        expect(result.value.address.toHexString()).toEqual(expectedTypeTag.address);
        expect(result.value.module_name.value).toEqual(expectedTypeTag.module_name);
        expect(result.value.name.value).toEqual(expectedTypeTag.name);
        expect(result.value.type_args.length).toEqual(2);
        // make sure the nested type tag is correct
        for (const typeArg of result.value.type_args) {
            const nestedTypeTag = typeArg;
            expect(nestedTypeTag.value.address.toHexString()).toEqual(expectedTypeTag.address);
            expect(nestedTypeTag.value.module_name.value).toEqual(expectedTypeTag.module_name);
            expect(nestedTypeTag.value.name.value).toEqual(expectedTypeTag.name);
            expect(nestedTypeTag.value.type_args.length).toEqual(0);
        }
    });
    describe("parse Object type", () => {
        test("TypeTagParser successfully parses an Object type", () => {
            const typeTag = "0x1::object::Object<T>";
            const parser = new type_tag_1.TypeTagParser(typeTag);
            const result = parser.parseTypeTag();
            expect(result instanceof type_tag_1.TypeTagAddress).toBeTruthy();
        });
        test("TypeTagParser successfully parses complex Object types", () => {
            const typeTag = "0x1::object::Object<T>";
            const parser = new type_tag_1.TypeTagParser(typeTag);
            const result = parser.parseTypeTag();
            expect(result instanceof type_tag_1.TypeTagAddress).toBeTruthy();
            const typeTag2 = "0x1::object::Object<0x1::coin::Fun<A, B<C>>>";
            const parser2 = new type_tag_1.TypeTagParser(typeTag);
            const result2 = parser2.parseTypeTag();
            expect(result2 instanceof type_tag_1.TypeTagAddress).toBeTruthy();
        });
        test("TypeTagParser does not parse unofficial objects", () => {
            const typeTag = "0x12345::object::Object<T>";
            const parser = new type_tag_1.TypeTagParser(typeTag);
            expect(() => parser.parseTypeTag()).toThrowError("Invalid type tag.");
        });
        test("TypeTagParser successfully parses an Option type", () => {
            const typeTag = "0x1::option::Option<u8>";
            const parser = new type_tag_1.TypeTagParser(typeTag);
            const result = parser.parseTypeTag();
            if (result instanceof type_tag_1.TypeTagStruct) {
                expect(result.value === (0, type_tag_1.objectStructTag)(new type_tag_1.TypeTagU8()));
            }
            else {
                fail(`Not an option ${result}`);
            }
        });
        test("TypeTagParser successfully parses a strcut with a nested Object type", () => {
            const typeTag = "0x1::some_module::SomeResource<0x1::object::Object<T>>";
            const parser = new type_tag_1.TypeTagParser(typeTag);
            const result = parser.parseTypeTag();
            expect(result.value.address.toHexString()).toEqual(expectedTypeTag.address);
            expect(result.value.module_name.value).toEqual("some_module");
            expect(result.value.name.value).toEqual("SomeResource");
            expect(result.value.type_args[0] instanceof type_tag_1.TypeTagAddress).toBeTruthy();
        });
        test("TypeTagParser successfully parses a struct with a nested Object and Struct types", () => {
            const typeTag = "0x1::some_module::SomeResource<0x1::object::Object<T>, 0x1::some_module::SomeResource>";
            const parser = new type_tag_1.TypeTagParser(typeTag);
            const result = parser.parseTypeTag();
            expect(result.value.address.toHexString()).toEqual(expectedTypeTag.address);
            expect(result.value.module_name.value).toEqual("some_module");
            expect(result.value.name.value).toEqual("SomeResource");
            expect(result.value.type_args.length).toEqual(2);
            expect(result.value.type_args[0] instanceof type_tag_1.TypeTagAddress).toBeTruthy();
            expect(result.value.type_args[1] instanceof type_tag_1.TypeTagStruct).toBeTruthy();
        });
    });
    describe("supports generic types", () => {
        test("throws an error when the type to use is not provided", () => {
            const typeTag = "T0";
            const parser = new type_tag_1.TypeTagParser(typeTag);
            expect(() => {
                parser.parseTypeTag();
            }).toThrow("Can't convert generic type since no typeTags were specified.");
        });
        test("successfully parses a generic type tag to the provided type", () => {
            const typeTag = "T0";
            const parser = new type_tag_1.TypeTagParser(typeTag, ["bool"]);
            const result = parser.parseTypeTag();
            expect(result instanceof type_tag_1.TypeTagBool).toBeTruthy();
        });
    });
});
describe("Deserialize TypeTags", () => {
    test("deserializes a TypeTagBool correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagBool();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagBool);
    });
    test("deserializes a TypeTagU8 correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagU8();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagU8);
    });
    test("deserializes a TypeTagU16 correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagU16();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagU16);
    });
    test("deserializes a TypeTagU32 correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagU32();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagU32);
    });
    test("deserializes a TypeTagU64 correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagU64();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagU64);
    });
    test("deserializes a TypeTagU128 correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagU128();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagU128);
    });
    test("deserializes a TypeTagU256 correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagU256();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagU256);
    });
    test("deserializes a TypeTagAddress correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagAddress();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagAddress);
    });
    test("deserializes a TypeTagSigner correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagSigner();
        tag.serialize(serializer);
        expect(type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()))).toBeInstanceOf(type_tag_1.TypeTagSigner);
    });
    test("deserializes a TypeTagVector correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagVector(new type_tag_1.TypeTagU32());
        tag.serialize(serializer);
        const deserialized = type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()));
        expect(deserialized).toBeInstanceOf(type_tag_1.TypeTagVector);
        expect(deserialized.value).toBeInstanceOf(type_tag_1.TypeTagU32);
    });
    test("deserializes a TypeTagStruct correctly", () => {
        const serializer = new bcs_1.Serializer();
        const tag = new type_tag_1.TypeTagStruct(type_tag_1.StructTag.fromString(expectedTypeTag.string));
        tag.serialize(serializer);
        const deserialized = type_tag_1.TypeTag.deserialize(new bcs_1.Deserializer(serializer.getBytes()));
        expect(deserialized).toBeInstanceOf(type_tag_1.TypeTagStruct);
        expect(deserialized.value).toBeInstanceOf(type_tag_1.StructTag);
        expect(deserialized.value.address.toHexString()).toEqual(expectedTypeTag.address);
        expect(deserialized.value.module_name.value).toEqual("some_module");
        expect(deserialized.value.name.value).toEqual("SomeResource");
        expect(deserialized.value.type_args.length).toEqual(0);
    });
});
//# sourceMappingURL=type_tag.test.js.map