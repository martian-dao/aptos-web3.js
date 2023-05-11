"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_tag_1 = require("../../aptos_types/type_tag");
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
        test("TypeTagParser successfully parses a strcut with a nested Object type", () => {
            const typeTag = "0x1::some_module::SomeResource<0x1::object::Object<T>>";
            const parser = new type_tag_1.TypeTagParser(typeTag);
            const result = parser.parseTypeTag();
            expect(result.value.address.toHexString()).toEqual(expectedTypeTag.address);
            expect(result.value.module_name.value).toEqual("some_module");
            expect(result.value.name.value).toEqual("SomeResource");
            expect(result.value.type_args[0] instanceof type_tag_1.TypeTagAddress).toBeTruthy();
        });
        test("TypeTagParser successfully parses a strcut with a nested Object and Struct types", () => {
            const typeTag = "0x1::some_module::SomeResource<0x4::object::Object<T>, 0x1::some_module::SomeResource>";
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
//# sourceMappingURL=type_tag.test.js.map