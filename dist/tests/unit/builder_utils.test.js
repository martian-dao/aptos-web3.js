"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const aptos_types_1 = require("../../aptos_types");
const bcs_1 = require("../../bcs");
const builder_utils_1 = require("../../transaction_builder/builder_utils");
const type_tag_1 = require("../../aptos_types/type_tag");
describe("BuilderUtils", () => {
    it("parses a bool TypeTag", async () => {
        expect(new aptos_types_1.TypeTagParser("bool").parseTypeTag() instanceof aptos_types_1.TypeTagBool).toBeTruthy();
    });
    it("parses a u8 TypeTag", async () => {
        expect(new aptos_types_1.TypeTagParser("u8").parseTypeTag() instanceof aptos_types_1.TypeTagU8).toBeTruthy();
    });
    it("parses a u16 TypeTag", async () => {
        expect(new aptos_types_1.TypeTagParser("u16").parseTypeTag() instanceof aptos_types_1.TypeTagU16).toBeTruthy();
    });
    it("parses a u32 TypeTag", async () => {
        expect(new aptos_types_1.TypeTagParser("u32").parseTypeTag() instanceof aptos_types_1.TypeTagU32).toBeTruthy();
    });
    it("parses a u64 TypeTag", async () => {
        expect(new aptos_types_1.TypeTagParser("u64").parseTypeTag() instanceof aptos_types_1.TypeTagU64).toBeTruthy();
    });
    it("parses a u128 TypeTag", async () => {
        expect(new aptos_types_1.TypeTagParser("u128").parseTypeTag() instanceof aptos_types_1.TypeTagU128).toBeTruthy();
    });
    it("parses a u256 TypeTag", async () => {
        expect(new aptos_types_1.TypeTagParser("u256").parseTypeTag() instanceof aptos_types_1.TypeTagU256).toBeTruthy();
    });
    it("parses a address TypeTag", async () => {
        expect(new aptos_types_1.TypeTagParser("address").parseTypeTag() instanceof aptos_types_1.TypeTagAddress).toBeTruthy();
    });
    it("parses a vector TypeTag", async () => {
        const vectorAddress = new aptos_types_1.TypeTagParser("vector<address>").parseTypeTag();
        expect(vectorAddress instanceof aptos_types_1.TypeTagVector).toBeTruthy();
        expect(vectorAddress.value instanceof aptos_types_1.TypeTagAddress).toBeTruthy();
        const vectorU64 = new aptos_types_1.TypeTagParser(" vector < u64 > ").parseTypeTag();
        expect(vectorU64 instanceof aptos_types_1.TypeTagVector).toBeTruthy();
        expect(vectorU64.value instanceof aptos_types_1.TypeTagU64).toBeTruthy();
    });
    it("parses a struct TypeTag", async () => {
        const assertStruct = (struct, accountAddress, moduleName, structName) => {
            expect(utils_1.HexString.fromUint8Array(struct.value.address.address).toShortString()).toBe(accountAddress);
            expect(struct.value.module_name.value).toBe(moduleName);
            expect(struct.value.name.value).toBe(structName);
        };
        const coin = new aptos_types_1.TypeTagParser("0x1::test_coin::Coin").parseTypeTag();
        expect(coin instanceof aptos_types_1.TypeTagStruct).toBeTruthy();
        assertStruct(coin, "0x1", "test_coin", "Coin");
        const aptosCoin = new aptos_types_1.TypeTagParser("0x1::coin::CoinStore < 0x1::test_coin::AptosCoin1 ,  0x1::test_coin::AptosCoin2 > ").parseTypeTag();
        expect(aptosCoin instanceof aptos_types_1.TypeTagStruct).toBeTruthy();
        assertStruct(aptosCoin, "0x1", "coin", "CoinStore");
        const aptosCoinTrailingComma = new aptos_types_1.TypeTagParser("0x1::coin::CoinStore < 0x1::test_coin::AptosCoin1 ,  0x1::test_coin::AptosCoin2, > ").parseTypeTag();
        expect(aptosCoinTrailingComma instanceof aptos_types_1.TypeTagStruct).toBeTruthy();
        assertStruct(aptosCoinTrailingComma, "0x1", "coin", "CoinStore");
        const structTypeTags = aptosCoin.value.type_args;
        expect(structTypeTags.length).toBe(2);
        const structTypeTag1 = structTypeTags[0];
        assertStruct(structTypeTag1, "0x1", "test_coin", "AptosCoin1");
        const structTypeTag2 = structTypeTags[1];
        assertStruct(structTypeTag2, "0x1", "test_coin", "AptosCoin2");
        const coinComplex = new aptos_types_1.TypeTagParser(
        // eslint-disable-next-line max-len
        "0x1::coin::CoinStore < 0x2::coin::LPCoin < 0x1::test_coin::AptosCoin1 <u8>, vector<0x1::test_coin::AptosCoin2 > > >").parseTypeTag();
        expect(coinComplex instanceof aptos_types_1.TypeTagStruct).toBeTruthy();
        assertStruct(coinComplex, "0x1", "coin", "CoinStore");
        const coinComplexTypeTag = coinComplex.value.type_args[0];
        assertStruct(coinComplexTypeTag, "0x2", "coin", "LPCoin");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x1::test_coin").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x1::test_coin::CoinStore<0x1::test_coin::AptosCoin").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x1::test_coin::CoinStore<0x1::test_coin>").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x1:test_coin::AptosCoin").parseTypeTag();
        }).toThrow("Unrecognized token.");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x!::test_coin::AptosCoin").parseTypeTag();
        }).toThrow("Unrecognized token.");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x1::test_coin::AptosCoin<").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x1::test_coin::CoinStore<0x1::test_coin::AptosCoin,").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new aptos_types_1.TypeTagParser("").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x1::<::CoinStore<0x1::test_coin::AptosCoin,").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new aptos_types_1.TypeTagParser("0x1::test_coin::><0x1::test_coin::AptosCoin,").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new aptos_types_1.TypeTagParser("u3").parseTypeTag();
        }).toThrow("Invalid type tag.");
    });
    it("serializes a boolean arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(true, new aptos_types_1.TypeTagBool(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x01]));
    });
    it("throws on serializing an invalid boolean arg", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)(123, new aptos_types_1.TypeTagBool(), serializer);
        }).toThrow(/Invalid arg/);
    });
    it("serializes a u8 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(255, new aptos_types_1.TypeTagU8(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0xff]));
    });
    it("throws on serializing an invalid u8 arg", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u8", new aptos_types_1.TypeTagU8(), serializer);
        }).toThrow(/Invalid number string/);
    });
    it("serializes a u16 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(0x7fff, new aptos_types_1.TypeTagU16(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0xff, 0x7f]));
    });
    it("throws on serializing an invalid u16 arg", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u16", new aptos_types_1.TypeTagU16(), serializer);
        }).toThrow(/Invalid number string/);
    });
    it("serializes a u32 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(0x01020304, new aptos_types_1.TypeTagU32(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x04, 0x03, 0x02, 0x01]));
    });
    it("throws on serializing an invalid u32 arg", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u32", new aptos_types_1.TypeTagU32(), serializer);
        }).toThrow(/Invalid number string/);
    });
    it("serializes a u64 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(BigInt("18446744073709551615"), new aptos_types_1.TypeTagU64(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
    });
    it("throws on serializing an invalid u64 arg", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u64", new aptos_types_1.TypeTagU64(), serializer);
        }).toThrow(/^Cannot convert/);
    });
    it("serializes a u128 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(BigInt("340282366920938463463374607431768211455"), new aptos_types_1.TypeTagU128(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
    });
    it("throws on serializing an invalid u128 arg", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u128", new aptos_types_1.TypeTagU128(), serializer);
        }).toThrow(/^Cannot convert/);
    });
    it("serializes a u256 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(BigInt("0x0001020304050607080910111213141516171819202122232425262728293031"), new aptos_types_1.TypeTagU256(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([
            0x31, 0x30, 0x29, 0x28, 0x27, 0x26, 0x25, 0x24, 0x23, 0x22, 0x21, 0x20, 0x19, 0x18, 0x17, 0x16, 0x15, 0x14,
            0x13, 0x12, 0x11, 0x10, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00,
        ]));
    });
    it("throws on serializing an invalid u256 arg", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u256", new aptos_types_1.TypeTagU256(), serializer);
        }).toThrow(/^Cannot convert/);
    });
    it("serializes an AccountAddress arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("0x1", new aptos_types_1.TypeTagAddress(), serializer);
        expect(utils_1.HexString.fromUint8Array(serializer.getBytes()).toShortString()).toEqual("0x1");
        serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(utils_1.HexString.ensure("0x1"), new aptos_types_1.TypeTagAddress(), serializer);
        expect(utils_1.HexString.fromUint8Array(serializer.getBytes()).toShortString()).toEqual("0x1");
        serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(aptos_types_1.AccountAddress.fromHex("0x1"), new aptos_types_1.TypeTagAddress(), serializer);
        expect(utils_1.HexString.fromUint8Array(serializer.getBytes()).toShortString()).toEqual("0x1");
    });
    it("throws on serializing an invalid AccountAddress arg", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)(123456, new aptos_types_1.TypeTagAddress(), serializer);
        }).toThrow("Invalid account address.");
    });
    it("serializes a vector arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)([255], new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x1, 0xff]));
    });
    it("serializes a vector u8 arg from string characters", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("abc", new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x3, 0x61, 0x62, 0x63]));
    });
    it("serializes a vector u8 arg from a hex string", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(utils_1.HexString.ensure("0x010203"), new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x3, 0x01, 0x02, 0x03]));
    });
    it("serializes a vector u8 arg from a uint8array", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(new Uint8Array([0x61, 0x62, 0x63]), new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x3, 0x61, 0x62, 0x63]));
    });
    it("serializes a vector of Objects", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(["0xbeef"], new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagStruct((0, aptos_types_1.objectStructTag)(new aptos_types_1.TypeTagU8()))), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([
            0x1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xbe, 0xef,
        ]));
    });
    it("throws error when serializing a mismatched type", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)(123456, new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        }).toThrow("Invalid vector args.");
    });
    it("serializes a string arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("abc", new aptos_types_1.TypeTagStruct(type_tag_1.stringStructTag), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x3, 0x61, 0x62, 0x63]));
    });
    it("serializes an empty option arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(undefined, new aptos_types_1.TypeTagStruct((0, aptos_types_1.optionStructTag)(new aptos_types_1.TypeTagU8())), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x0]));
        let serializer2 = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(null, new aptos_types_1.TypeTagStruct((0, aptos_types_1.optionStructTag)(new aptos_types_1.TypeTagU8())), serializer2);
        expect(serializer2.getBytes()).toEqual(new Uint8Array([0x0]));
    });
    it("serializes an option num arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("1", new aptos_types_1.TypeTagStruct((0, aptos_types_1.optionStructTag)(new aptos_types_1.TypeTagU8())), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x1, 0x1]));
    });
    it("serializes an option string arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("abc", new aptos_types_1.TypeTagStruct((0, aptos_types_1.optionStructTag)(new aptos_types_1.TypeTagStruct(type_tag_1.stringStructTag))), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x1, 0x3, 0x61, 0x62, 0x63]));
    });
    it("serializes a optional Object", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("0x01", new aptos_types_1.TypeTagStruct((0, aptos_types_1.optionStructTag)(new aptos_types_1.TypeTagStruct((0, aptos_types_1.objectStructTag)(new aptos_types_1.TypeTagU8())))), serializer);
        //00 00 00 00 00000000 00000000 00000000 00000000 00000000 00000000 00000000
        expect(serializer.getBytes()).toEqual(new Uint8Array([
            0x1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        ]));
    });
    it("throws when unsupported struct type", async () => {
        let serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("abc", new aptos_types_1.TypeTagStruct(new aptos_types_1.StructTag(aptos_types_1.AccountAddress.fromHex("0x3"), new aptos_types_1.Identifier("token"), new aptos_types_1.Identifier("Token"), [])), serializer);
        }).toThrow("Unsupported struct type in function argument");
    });
    it("throws at unrecognized arg types", async () => {
        const serializer = new bcs_1.Serializer();
        expect(() => {
            // @ts-ignore
            (0, builder_utils_1.serializeArg)(123456, "unknown_type", serializer);
        }).toThrow("Unsupported arg type.");
    });
    it("converts a boolean TransactionArgument", async () => {
        const res = (0, builder_utils_1.argToTransactionArgument)(true, new aptos_types_1.TypeTagBool());
        expect(res.value).toEqual(true);
        expect(() => {
            (0, builder_utils_1.argToTransactionArgument)(123, new aptos_types_1.TypeTagBool());
        }).toThrow(/Invalid arg/);
    });
    it("converts a u8 TransactionArgument", async () => {
        const res = (0, builder_utils_1.argToTransactionArgument)(123, new aptos_types_1.TypeTagU8());
        expect(res.value).toEqual(123);
        expect(() => {
            (0, builder_utils_1.argToTransactionArgument)("u8", new aptos_types_1.TypeTagBool());
        }).toThrow(/Invalid boolean string/);
    });
    it("converts a u64 TransactionArgument", async () => {
        const res = (0, builder_utils_1.argToTransactionArgument)(123, new aptos_types_1.TypeTagU64());
        expect(res.value).toEqual(BigInt(123));
        expect(() => {
            (0, builder_utils_1.argToTransactionArgument)("u64", new aptos_types_1.TypeTagU64());
        }).toThrow(/Cannot convert/);
    });
    it("converts a u128 TransactionArgument", async () => {
        const res = (0, builder_utils_1.argToTransactionArgument)(123, new aptos_types_1.TypeTagU128());
        expect(res.value).toEqual(BigInt(123));
        expect(() => {
            (0, builder_utils_1.argToTransactionArgument)("u128", new aptos_types_1.TypeTagU128());
        }).toThrow(/Cannot convert/);
    });
    it("converts an AccountAddress TransactionArgument", async () => {
        let res = (0, builder_utils_1.argToTransactionArgument)("0x1", new aptos_types_1.TypeTagAddress());
        expect(utils_1.HexString.fromUint8Array(res.value.address).toShortString()).toEqual("0x1");
        res = (0, builder_utils_1.argToTransactionArgument)(aptos_types_1.AccountAddress.fromHex("0x2"), new aptos_types_1.TypeTagAddress());
        expect(utils_1.HexString.fromUint8Array(res.value.address).toShortString()).toEqual("0x2");
        expect(() => {
            (0, builder_utils_1.argToTransactionArgument)(123456, new aptos_types_1.TypeTagAddress());
        }).toThrow("Invalid account address.");
    });
    it("converts a vector TransactionArgument", async () => {
        const res = (0, builder_utils_1.argToTransactionArgument)(new Uint8Array([0x1]), new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()));
        expect(res.value).toEqual(new Uint8Array([0x1]));
        expect(() => {
            (0, builder_utils_1.argToTransactionArgument)(123456, new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()));
        }).toThrow(/.*should be an instance of Uint8Array$/);
    });
    it("throws at unrecognized TransactionArgument types", async () => {
        expect(() => {
            // @ts-ignore
            (0, builder_utils_1.argToTransactionArgument)(123456, "unknown_type");
        }).toThrow("Unknown type for TransactionArgument.");
    });
    it("ensures a boolean", async () => {
        expect((0, builder_utils_1.ensureBoolean)(false)).toBe(false);
        expect((0, builder_utils_1.ensureBoolean)(true)).toBe(true);
        expect((0, builder_utils_1.ensureBoolean)("true")).toBe(true);
        expect((0, builder_utils_1.ensureBoolean)("false")).toBe(false);
        expect(() => (0, builder_utils_1.ensureBoolean)("True")).toThrow("Invalid boolean string.");
    });
    it("ensures a number", async () => {
        expect((0, builder_utils_1.ensureNumber)(10)).toBe(10);
        expect((0, builder_utils_1.ensureNumber)("123")).toBe(123);
        expect(() => (0, builder_utils_1.ensureNumber)("True")).toThrow("Invalid number string.");
    });
    it("ensures a bigint", async () => {
        expect((0, builder_utils_1.ensureBigInt)(10)).toBe(BigInt(10));
        expect((0, builder_utils_1.ensureBigInt)("123")).toBe(BigInt(123));
        expect(() => (0, builder_utils_1.ensureBigInt)("True")).toThrow(/^Cannot convert/);
    });
});
//# sourceMappingURL=builder_utils.test.js.map