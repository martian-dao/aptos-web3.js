"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const deserializer_1 = require("../../bcs/deserializer");
describe("BCS Deserializer", () => {
    it("deserializes a non-empty string", () => {
        const deserializer = new deserializer_1.Deserializer(new Uint8Array([
            24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e, 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88,
            0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab,
        ]));
        expect(deserializer.deserializeStr()).toBe("çå∞≠¢õß∂ƒ∫");
    });
    it("deserializes an empty string", () => {
        const deserializer = new deserializer_1.Deserializer(new Uint8Array([0]));
        expect(deserializer.deserializeStr()).toBe("");
    });
    it("deserializes dynamic length bytes", () => {
        const deserializer = new deserializer_1.Deserializer(new Uint8Array([5, 0x41, 0x70, 0x74, 0x6f, 0x73]));
        expect(deserializer.deserializeBytes()).toEqual(new Uint8Array([0x41, 0x70, 0x74, 0x6f, 0x73]));
    });
    it("deserializes dynamic length bytes with zero elements", () => {
        const deserializer = new deserializer_1.Deserializer(new Uint8Array([0]));
        expect(deserializer.deserializeBytes()).toEqual(new Uint8Array([]));
    });
    it("deserializes fixed length bytes", () => {
        const deserializer = new deserializer_1.Deserializer(new Uint8Array([0x41, 0x70, 0x74, 0x6f, 0x73]));
        expect(deserializer.deserializeFixedBytes(5)).toEqual(new Uint8Array([0x41, 0x70, 0x74, 0x6f, 0x73]));
    });
    it("deserializes fixed length bytes with zero element", () => {
        const deserializer = new deserializer_1.Deserializer(new Uint8Array([]));
        expect(deserializer.deserializeFixedBytes(0)).toEqual(new Uint8Array([]));
    });
    it("deserializes a boolean value", () => {
        let deserializer = new deserializer_1.Deserializer(new Uint8Array([0x01]));
        expect(deserializer.deserializeBool()).toEqual(true);
        deserializer = new deserializer_1.Deserializer(new Uint8Array([0x00]));
        expect(deserializer.deserializeBool()).toEqual(false);
    });
    it("throws when dserializing a boolean with disallowed values", () => {
        expect(() => {
            const deserializer = new deserializer_1.Deserializer(new Uint8Array([0x12]));
            deserializer.deserializeBool();
        }).toThrow("Invalid boolean value");
    });
    it("deserializes a uint8", () => {
        const deserializer = new deserializer_1.Deserializer(new Uint8Array([0xff]));
        expect(deserializer.deserializeU8()).toEqual(255);
    });
    it("deserializes a uint16", () => {
        let deserializer = new deserializer_1.Deserializer(new Uint8Array([0xff, 0xff]));
        expect(deserializer.deserializeU16()).toEqual(65535);
        deserializer = new deserializer_1.Deserializer(new Uint8Array([0x34, 0x12]));
        expect(deserializer.deserializeU16()).toEqual(4660);
    });
    it("deserializes a uint32", () => {
        let deserializer = new deserializer_1.Deserializer(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
        expect(deserializer.deserializeU32()).toEqual(4294967295);
        deserializer = new deserializer_1.Deserializer(new Uint8Array([0x78, 0x56, 0x34, 0x12]));
        expect(deserializer.deserializeU32()).toEqual(305419896);
    });
    it("deserializes a uint64", () => {
        let deserializer = new deserializer_1.Deserializer(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
        expect(deserializer.deserializeU64()).toEqual(BigInt("18446744073709551615"));
        deserializer = new deserializer_1.Deserializer(new Uint8Array([0x00, 0xef, 0xcd, 0xab, 0x78, 0x56, 0x34, 0x12]));
        expect(deserializer.deserializeU64()).toEqual(BigInt("1311768467750121216"));
    });
    it("deserializes a uint128", () => {
        let deserializer = new deserializer_1.Deserializer(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
        expect(deserializer.deserializeU128()).toEqual(BigInt("340282366920938463463374607431768211455"));
        deserializer = new deserializer_1.Deserializer(new Uint8Array([0x00, 0xef, 0xcd, 0xab, 0x78, 0x56, 0x34, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
        expect(deserializer.deserializeU128()).toEqual(BigInt("1311768467750121216"));
    });
    it("deserializes a uint256", () => {
        let deserializer = new deserializer_1.Deserializer(new Uint8Array([
            0x31, 0x30, 0x29, 0x28, 0x27, 0x26, 0x25, 0x24, 0x23, 0x22, 0x21, 0x20, 0x19, 0x18, 0x17, 0x16, 0x15, 0x14,
            0x13, 0x12, 0x11, 0x10, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00,
        ]));
        expect(deserializer.deserializeU256()).toEqual(BigInt("0x0001020304050607080910111213141516171819202122232425262728293031"));
    });
    it("deserializes a uleb128", () => {
        let deserializer = new deserializer_1.Deserializer(new Uint8Array([0xcd, 0xea, 0xec, 0x31]));
        expect(deserializer.deserializeUleb128AsU32()).toEqual(104543565);
        deserializer = new deserializer_1.Deserializer(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x0f]));
        expect(deserializer.deserializeUleb128AsU32()).toEqual(4294967295);
    });
    it("throws when deserializing a uleb128 with out ranged value", () => {
        expect(() => {
            const deserializer = new deserializer_1.Deserializer(new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x10]));
            deserializer.deserializeUleb128AsU32();
        }).toThrow("Overflow while parsing uleb128-encoded uint32 value");
    });
    it("throws when deserializing against buffer that has been drained", () => {
        expect(() => {
            const deserializer = new deserializer_1.Deserializer(new Uint8Array([
                24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e, 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2,
                0x88, 0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab,
            ]));
            deserializer.deserializeStr();
            deserializer.deserializeStr();
        }).toThrow("Reached to the end of buffer");
    });
});
//# sourceMappingURL=deserializer.test.js.map