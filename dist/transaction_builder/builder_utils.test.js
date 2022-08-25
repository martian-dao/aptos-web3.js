"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const hex_string_1 = require("../hex_string");
const aptos_types_1 = require("./aptos_types");
const bcs_1 = require("./bcs");
const builder_utils_1 = require("./builder_utils");
describe("BuilderUtils", () => {
    it("parses a bool TypeTag", async () => {
        expect(new builder_utils_1.TypeTagParser("bool").parseTypeTag() instanceof aptos_types_1.TypeTagBool).toBeTruthy();
    });
    it("parses a u8 TypeTag", async () => {
        expect(new builder_utils_1.TypeTagParser("u8").parseTypeTag() instanceof aptos_types_1.TypeTagU8).toBeTruthy();
    });
    it("parses a u64 TypeTag", async () => {
        expect(new builder_utils_1.TypeTagParser("u64").parseTypeTag() instanceof aptos_types_1.TypeTagU64).toBeTruthy();
    });
    it("parses a u128 TypeTag", async () => {
        expect(new builder_utils_1.TypeTagParser("u128").parseTypeTag() instanceof aptos_types_1.TypeTagU128).toBeTruthy();
    });
    it("parses a address TypeTag", async () => {
        expect(new builder_utils_1.TypeTagParser("address").parseTypeTag() instanceof aptos_types_1.TypeTagAddress).toBeTruthy();
    });
    it("parses a vector TypeTag", async () => {
        const vectorAddress = new builder_utils_1.TypeTagParser("vector<address>").parseTypeTag();
        expect(vectorAddress instanceof aptos_types_1.TypeTagVector).toBeTruthy();
        expect(vectorAddress.value instanceof aptos_types_1.TypeTagAddress).toBeTruthy();
        const vectorU64 = new builder_utils_1.TypeTagParser(" vector < u64 > ").parseTypeTag();
        expect(vectorU64 instanceof aptos_types_1.TypeTagVector).toBeTruthy();
        expect(vectorU64.value instanceof aptos_types_1.TypeTagU64).toBeTruthy();
    });
    it("parses a sturct TypeTag", async () => {
        const assertStruct = (struct, accountAddress, moduleName, structName) => {
            expect(hex_string_1.HexString.fromUint8Array(struct.value.address.address).toShortString()).toBe(accountAddress);
            expect(struct.value.module_name.value).toBe(moduleName);
            expect(struct.value.name.value).toBe(structName);
        };
        const coin = new builder_utils_1.TypeTagParser("0x1::test_coin::Coin").parseTypeTag();
        expect(coin instanceof aptos_types_1.TypeTagStruct).toBeTruthy();
        assertStruct(coin, "0x1", "test_coin", "Coin");
        const aptosCoin = new builder_utils_1.TypeTagParser("0x1::coin::CoinStore < 0x1::test_coin::AptosCoin1 ,  0x1::test_coin::AptosCoin2 > ").parseTypeTag();
        expect(aptosCoin instanceof aptos_types_1.TypeTagStruct).toBeTruthy();
        assertStruct(aptosCoin, "0x1", "coin", "CoinStore");
        const aptosCoinTrailingComma = new builder_utils_1.TypeTagParser("0x1::coin::CoinStore < 0x1::test_coin::AptosCoin1 ,  0x1::test_coin::AptosCoin2, > ").parseTypeTag();
        expect(aptosCoinTrailingComma instanceof aptos_types_1.TypeTagStruct).toBeTruthy();
        assertStruct(aptosCoinTrailingComma, "0x1", "coin", "CoinStore");
        const structTypeTags = aptosCoin.value.type_args;
        expect(structTypeTags.length).toBe(2);
        const structTypeTag1 = structTypeTags[0];
        assertStruct(structTypeTag1, "0x1", "test_coin", "AptosCoin1");
        const structTypeTag2 = structTypeTags[1];
        assertStruct(structTypeTag2, "0x1", "test_coin", "AptosCoin2");
        const coinComplex = new builder_utils_1.TypeTagParser(
        // eslint-disable-next-line max-len
        "0x1::coin::CoinStore < 0x2::coin::LPCoin < 0x1::test_coin::AptosCoin1 <u8>, vector<0x1::test_coin::AptosCoin2 > > >").parseTypeTag();
        expect(coinComplex instanceof aptos_types_1.TypeTagStruct).toBeTruthy();
        assertStruct(coinComplex, "0x1", "coin", "CoinStore");
        const coinComplexTypeTag = coinComplex.value.type_args[0];
        assertStruct(coinComplexTypeTag, "0x2", "coin", "LPCoin");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x1::test_coin").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x1::test_coin::CoinStore<0x1::test_coin::AptosCoin").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x1::test_coin::CoinStore<0x1::test_coin>").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x1:test_coin::AptosCoin").parseTypeTag();
        }).toThrow("Unrecognized token.");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x!::test_coin::AptosCoin").parseTypeTag();
        }).toThrow("Unrecognized token.");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x1::test_coin::AptosCoin<").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x1::test_coin::CoinStore<0x1::test_coin::AptosCoin,").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new builder_utils_1.TypeTagParser("").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x1::<::CoinStore<0x1::test_coin::AptosCoin,").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new builder_utils_1.TypeTagParser("0x1::test_coin::><0x1::test_coin::AptosCoin,").parseTypeTag();
        }).toThrow("Invalid type tag.");
        expect(() => {
            new builder_utils_1.TypeTagParser("u32").parseTypeTag();
        }).toThrow("Invalid type tag.");
    });
    it("serializes a boolean arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(true, new aptos_types_1.TypeTagBool(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x01]));
        serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)(123, new aptos_types_1.TypeTagBool(), serializer);
        }).toThrow(/Invalid arg/);
    });
    it("serializes a u8 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(255, new aptos_types_1.TypeTagU8(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0xff]));
        serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u8", new aptos_types_1.TypeTagU8(), serializer);
        }).toThrow(/Invalid arg/);
    });
    it("serializes a u64 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(18446744073709551615n, new aptos_types_1.TypeTagU64(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
        serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u64", new aptos_types_1.TypeTagU64(), serializer);
        }).toThrow(/Invalid arg/);
    });
    it("serializes a u128 arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(340282366920938463463374607431768211455n, new aptos_types_1.TypeTagU128(), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
        serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("u128", new aptos_types_1.TypeTagU128(), serializer);
        }).toThrow(/Invalid arg/);
    });
    it("serializes an AccountAddress arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("0x1", new aptos_types_1.TypeTagAddress(), serializer);
        expect(hex_string_1.HexString.fromUint8Array(serializer.getBytes()).toShortString()).toEqual("0x1");
        serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(aptos_types_1.AccountAddress.fromHex("0x1"), new aptos_types_1.TypeTagAddress(), serializer);
        expect(hex_string_1.HexString.fromUint8Array(serializer.getBytes()).toShortString()).toEqual("0x1");
        serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)(123456, new aptos_types_1.TypeTagAddress(), serializer);
        }).toThrow("Invalid account address.");
    });
    it("serializes a vector arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)([255], new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x1, 0xff]));
        serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("abc", new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x3, 0x61, 0x62, 0x63]));
        serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)(new Uint8Array([0x61, 0x62, 0x63]), new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x3, 0x61, 0x62, 0x63]));
        serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)(123456, new aptos_types_1.TypeTagVector(new aptos_types_1.TypeTagU8()), serializer);
        }).toThrow("Invalid vector args.");
    });
    it("serializes a struct arg", async () => {
        let serializer = new bcs_1.Serializer();
        (0, builder_utils_1.serializeArg)("abc", new aptos_types_1.TypeTagStruct(new aptos_types_1.StructTag(aptos_types_1.AccountAddress.fromHex("0x1"), new aptos_types_1.Identifier("string"), new aptos_types_1.Identifier("String"), [])), serializer);
        expect(serializer.getBytes()).toEqual(new Uint8Array([0x3, 0x61, 0x62, 0x63]));
        serializer = new bcs_1.Serializer();
        expect(() => {
            (0, builder_utils_1.serializeArg)("abc", new aptos_types_1.TypeTagStruct(new aptos_types_1.StructTag(aptos_types_1.AccountAddress.fromHex("0x3"), new aptos_types_1.Identifier("token"), new aptos_types_1.Identifier("Token"), [])), serializer);
        }).toThrow("The only supported struct arg is of type 0x1::string::String");
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
        }).toThrow(/Invalid arg/);
    });
    it("converts a u64 TransactionArgument", async () => {
        const res = (0, builder_utils_1.argToTransactionArgument)(123, new aptos_types_1.TypeTagU64());
        expect(res.value).toEqual(123);
        expect(() => {
            (0, builder_utils_1.argToTransactionArgument)("u64", new aptos_types_1.TypeTagU64());
        }).toThrow(/Invalid arg/);
    });
    it("converts a u128 TransactionArgument", async () => {
        const res = (0, builder_utils_1.argToTransactionArgument)(123, new aptos_types_1.TypeTagU128());
        expect(res.value).toEqual(123);
        expect(() => {
            (0, builder_utils_1.argToTransactionArgument)("u128", new aptos_types_1.TypeTagU128());
        }).toThrow(/Invalid arg/);
    });
    it("converts an AccountAddress TransactionArgument", async () => {
        let res = (0, builder_utils_1.argToTransactionArgument)("0x1", new aptos_types_1.TypeTagAddress());
        expect(hex_string_1.HexString.fromUint8Array(res.value.address).toShortString()).toEqual("0x1");
        res = (0, builder_utils_1.argToTransactionArgument)(aptos_types_1.AccountAddress.fromHex("0x2"), new aptos_types_1.TypeTagAddress());
        expect(hex_string_1.HexString.fromUint8Array(res.value.address).toShortString()).toEqual("0x2");
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
});
//# sourceMappingURL=builder_utils.test.js.map