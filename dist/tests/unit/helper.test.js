"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_types_1 = require("../../aptos_types");
const deserializer_1 = require("../../bcs/deserializer");
const helper_1 = require("../../bcs/helper");
const serializer_1 = require("../../bcs/serializer");
test("serializes and deserializes a vector of serializables", () => {
    const address0 = aptos_types_1.AccountAddress.fromHex("0x1");
    const address1 = aptos_types_1.AccountAddress.fromHex("0x2");
    const serializer = new serializer_1.Serializer();
    (0, helper_1.serializeVector)([address0, address1], serializer);
    const addresses = (0, helper_1.deserializeVector)(new deserializer_1.Deserializer(serializer.getBytes()), aptos_types_1.AccountAddress);
    expect(addresses[0].address).toEqual(address0.address);
    expect(addresses[1].address).toEqual(address1.address);
});
test("bcsToBytes", () => {
    const address = aptos_types_1.AccountAddress.fromHex("0x1");
    (0, helper_1.bcsToBytes)(address);
    expect((0, helper_1.bcsToBytes)(address)).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]));
});
test("bcsSerializeU8", () => {
    expect((0, helper_1.bcsSerializeU8)(255)).toEqual(new Uint8Array([0xff]));
});
test("bcsSerializeU16", () => {
    expect((0, helper_1.bcsSerializeU16)(65535)).toEqual(new Uint8Array([0xff, 0xff]));
});
test("bcsSerializeU32", () => {
    expect((0, helper_1.bcsSerializeU32)(4294967295)).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
});
test("bcsSerializeU64", () => {
    expect((0, helper_1.bcsSerializeUint64)(BigInt("18446744073709551615"))).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
});
test("bcsSerializeU128", () => {
    expect((0, helper_1.bcsSerializeU128)(BigInt("340282366920938463463374607431768211455"))).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
});
test("bcsSerializeBool", () => {
    expect((0, helper_1.bcsSerializeBool)(true)).toEqual(new Uint8Array([0x01]));
});
test("bcsSerializeStr", () => {
    expect((0, helper_1.bcsSerializeStr)("çå∞≠¢õß∂ƒ∫")).toEqual(new Uint8Array([
        24, 0xc3, 0xa7, 0xc3, 0xa5, 0xe2, 0x88, 0x9e, 0xe2, 0x89, 0xa0, 0xc2, 0xa2, 0xc3, 0xb5, 0xc3, 0x9f, 0xe2, 0x88,
        0x82, 0xc6, 0x92, 0xe2, 0x88, 0xab,
    ]));
});
test("bcsSerializeBytes", () => {
    expect((0, helper_1.bcsSerializeBytes)(new Uint8Array([0x41, 0x70, 0x74, 0x6f, 0x73]))).toEqual(new Uint8Array([5, 0x41, 0x70, 0x74, 0x6f, 0x73]));
});
test("bcsSerializeFixedBytes", () => {
    expect((0, helper_1.bcsSerializeFixedBytes)(new Uint8Array([0x41, 0x70, 0x74, 0x6f, 0x73]))).toEqual(new Uint8Array([0x41, 0x70, 0x74, 0x6f, 0x73]));
});
test("serializeVectorWithFunc", () => {
    expect((0, helper_1.serializeVectorWithFunc)([false, true], "serializeBool")).toEqual(new Uint8Array([0x2, 0x0, 0x1]));
});
//# sourceMappingURL=helper.test.js.map