"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const utils_1 = require("@noble/hashes/utils");
const bcs_1 = require("../../bcs");
const utils_2 = require("../../utils");
const index_1 = require("../../transaction_builder/index");
const aptos_types_1 = require("../../aptos_types");
const ADDRESS_1 = "0x1222";
const ADDRESS_2 = "0xdd";
const ADDRESS_3 = "0x0a550c18";
const ADDRESS_4 = "0x01";
const PRIVATE_KEY = "9bf49a6a0755f953811fce125f2683d50429c3bb49e074147e0089a52eae155f";
const TXN_EXPIRE = "18446744073709551615";
function hexSignedTxn(signedTxn) {
    return (0, utils_1.bytesToHex)(signedTxn);
}
function sign(rawTxn) {
    const privateKeyBytes = new utils_2.HexString(PRIVATE_KEY).toUint8Array();
    const signingKey = tweetnacl_1.default.sign.keyPair.fromSeed(privateKeyBytes.slice(0, 32));
    const { publicKey } = signingKey;
    const txnBuilder = new index_1.TransactionBuilderEd25519((signingMessage) => new aptos_types_1.Ed25519Signature(tweetnacl_1.default.sign(signingMessage, signingKey.secretKey).slice(0, 64)), publicKey);
    return txnBuilder.sign(rawTxn);
}
test("throws when preparing signing message with invalid payload", () => {
    expect(() => {
        // @ts-ignore
        index_1.TransactionBuilder.getSigningMessage("invalid");
    }).toThrow("Unknown transaction type.");
});
test("gets the signing message", () => {
    const entryFunctionPayload = new aptos_types_1.TransactionPayloadEntryFunction(aptos_types_1.EntryFunction.natural(`${ADDRESS_1}::aptos_coin`, "transfer", [], [(0, bcs_1.bcsToBytes)(aptos_types_1.AccountAddress.fromHex(ADDRESS_2)), (0, bcs_1.bcsSerializeUint64)(1)]));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(new utils_2.HexString(ADDRESS_3)), BigInt(0), entryFunctionPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const message = index_1.TransactionBuilder.getSigningMessage(rawTxn);
    expect(message instanceof Uint8Array).toBeTruthy();
    expect(utils_2.HexString.fromUint8Array(message).hex()).toBe("0xb5e97db07fa0bd0e5598aa3643a9bc6f6693bddc1a9fec9e674a461eaa00b193000000000000000000000000000000000000000000000000000000000a550c1800000000000000000200000000000000000000000000000000000000000000000000000000000012220a6170746f735f636f696e087472616e7366657200022000000000000000000000000000000000000000000000000000000000000000dd080100000000000000d0070000000000000000000000000000ffffffffffffffff04");
});
test("serialize entry function payload with no type args", () => {
    const entryFunctionPayload = new aptos_types_1.TransactionPayloadEntryFunction(aptos_types_1.EntryFunction.natural(`${ADDRESS_1}::aptos_coin`, "transfer", [], [(0, bcs_1.bcsToBytes)(aptos_types_1.AccountAddress.fromHex(ADDRESS_2)), (0, bcs_1.bcsSerializeUint64)(1)]));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(new utils_2.HexString(ADDRESS_3)), BigInt(0), entryFunctionPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c1800000000000000000200000000000000000000000000000000000000000000000000000000000012220a6170746f735f636f696e087472616e7366657200022000000000000000000000000000000000000000000000000000000000000000dd080100000000000000d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a49200409c570996380897f38b8d7008d726fb45d6ded0689216e56b73f523492cba92deb6671c27e9a44d2a6fdfdb497420d00c621297a23d6d0298895e0d58cff6060c");
});
test("serialize entry function payload with type args", () => {
    const token = new aptos_types_1.TypeTagStruct(aptos_types_1.StructTag.fromString(`${ADDRESS_4}::aptos_coin::AptosCoin`));
    const entryFunctionPayload = new aptos_types_1.TransactionPayloadEntryFunction(aptos_types_1.EntryFunction.natural(`${ADDRESS_1}::coin`, "transfer", [token], [(0, bcs_1.bcsToBytes)(aptos_types_1.AccountAddress.fromHex(ADDRESS_2)), (0, bcs_1.bcsSerializeUint64)(1)]));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(ADDRESS_3), BigInt(0), entryFunctionPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c18000000000000000002000000000000000000000000000000000000000000000000000000000000122204636f696e087472616e73666572010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e00022000000000000000000000000000000000000000000000000000000000000000dd080100000000000000d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a4920040112162f543ca92b4f14c1b09b7f52894a127f5428b0d407c09c8efb3a136cff50e550aea7da1226f02571d79230b80bd79096ea0d796789ad594b8fbde695404");
});
test("serialize entry function payload with type args but no function args", () => {
    const token = new aptos_types_1.TypeTagStruct(aptos_types_1.StructTag.fromString(`${ADDRESS_4}::aptos_coin::AptosCoin`));
    const entryFunctionPayload = new aptos_types_1.TransactionPayloadEntryFunction(aptos_types_1.EntryFunction.natural(`${ADDRESS_1}::coin`, "fake_func", [token], []));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(ADDRESS_3), BigInt(0), entryFunctionPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c18000000000000000002000000000000000000000000000000000000000000000000000000000000122204636f696e0966616b655f66756e63010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e0000d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a49200400e2d1cc4a27893cbae36d8b6a7150977c7620e065f359840413c5478a25f20a383250a9cdcb4fd71f7d171856f38972da30a9d10072e164614d96379004aa500");
});
test("serialize entry function payload with generic type args and function args", () => {
    const token = new aptos_types_1.TypeTagStruct(aptos_types_1.StructTag.fromString(`0x14::token::Token`));
    const entryFunctionPayload = new aptos_types_1.TransactionPayloadEntryFunction(aptos_types_1.EntryFunction.natural(`${ADDRESS_1}::aptos_token`, "fake_typed_func", [token, new aptos_types_1.TypeTagBool()], [(0, bcs_1.bcsToBytes)(aptos_types_1.AccountAddress.fromHex(ADDRESS_2)), (0, bcs_1.bcsSerializeBool)(true)]));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(ADDRESS_3), BigInt(0), entryFunctionPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c1800000000000000000200000000000000000000000000000000000000000000000000000000000012220b6170746f735f746f6b656e0f66616b655f74797065645f66756e630207000000000000000000000000000000000000000000000000000000000000001405746f6b656e05546f6b656e0000022000000000000000000000000000000000000000000000000000000000000000dd0101d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a4920040367085186aeef58a0256fc64ecb86b88a86f8a8e42151e0e9aae1ab6d426c4968f2cab664261ea6bb868869154fe6e946c082774741d5143e57a1d802fd1b700");
});
test("serialize script payload with no type args and no function args", () => {
    const script = (0, utils_1.hexToBytes)("a11ceb0b030000000105000100000000050601000000000000000600000000000000001a0102");
    const scriptPayload = new aptos_types_1.TransactionPayloadScript(new aptos_types_1.Script(script, [], []));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(ADDRESS_3), BigInt(0), scriptPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c1800000000000000000026a11ceb0b030000000105000100000000050601000000000000000600000000000000001a01020000d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a4920040266935990105df40f3a82a3f41ad9ceb4b79451495403dd976191382bb07f8c9b401702968a64b5176762e62036f75c6fc2b770a0988716e41d469fff2349a08");
});
test("serialize script payload with type args but no function args", () => {
    const token = new aptos_types_1.TypeTagStruct(aptos_types_1.StructTag.fromString(`${ADDRESS_4}::aptos_coin::AptosCoin`));
    const script = (0, utils_1.hexToBytes)("a11ceb0b030000000105000100000000050601000000000000000600000000000000001a0102");
    const scriptPayload = new aptos_types_1.TransactionPayloadScript(new aptos_types_1.Script(script, [token], []));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(ADDRESS_3), BigInt(0), scriptPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c1800000000000000000026a11ceb0b030000000105000100000000050601000000000000000600000000000000001a0102010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e0000d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a4920040bd241a6f31dfdfca0031ca5874fbf81800b5f632642321a11c41b4fead4b41d808617e91dd655fde7e9f263127f07bb5d56c7c925fe797728dcc9b55be120604");
});
test("serialize script payload with type arg and function arg", () => {
    const token = new aptos_types_1.TypeTagStruct(aptos_types_1.StructTag.fromString(`${ADDRESS_4}::aptos_coin::AptosCoin`));
    const argU8 = new aptos_types_1.TransactionArgumentU8(2);
    const script = (0, utils_1.hexToBytes)("a11ceb0b030000000105000100000000050601000000000000000600000000000000001a0102");
    const scriptPayload = new aptos_types_1.TransactionPayloadScript(new aptos_types_1.Script(script, [token], [argU8]));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(ADDRESS_3), BigInt(0), scriptPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c1800000000000000000026a11ceb0b030000000105000100000000050601000000000000000600000000000000001a0102010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e00010002d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a49200409936b8d22cec685e720761f6c6135e020911f1a26e220e2a0f3317f5a68942531987259ac9e8688158c77df3e7136637056047d9524edad88ee45d61a9346602");
});
test("serialize script payload with one type arg and two function args", () => {
    const token = new aptos_types_1.TypeTagStruct(aptos_types_1.StructTag.fromString(`${ADDRESS_4}::aptos_coin::AptosCoin`));
    const argU8Vec = new aptos_types_1.TransactionArgumentU8Vector((0, bcs_1.bcsSerializeUint64)(1));
    const argAddress = new aptos_types_1.TransactionArgumentAddress(aptos_types_1.AccountAddress.fromHex("0x01"));
    const script = (0, utils_1.hexToBytes)("a11ceb0b030000000105000100000000050601000000000000000600000000000000001a0102");
    const scriptPayload = new aptos_types_1.TransactionPayloadScript(new aptos_types_1.Script(script, [token], [argU8Vec, argAddress]));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(ADDRESS_3), BigInt(0), scriptPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c1800000000000000000026a11ceb0b030000000105000100000000050601000000000000000600000000000000001a0102010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e000204080100000000000000030000000000000000000000000000000000000000000000000000000000000001d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a492004055c7499795ea68d7acfa64a58f19efa2ba3b977fa58ae93ae8c0732c0f6d6dd084d92bbe4edc2a0d687031cae90da117abfac16ebd902e764bdc38a2154a2102");
});
test("serialize script payload with new integer types (u16, u32, u256) as args", () => {
    const argU16 = new aptos_types_1.TransactionArgumentU16(0xf111);
    const argU32 = new aptos_types_1.TransactionArgumentU32(0xf1111111);
    const argU256 = new aptos_types_1.TransactionArgumentU256(BigInt("0xf111111111111111111111111111111111111111111111111111111111111111"));
    const script = (0, utils_1.hexToBytes)("");
    const scriptPayload = new aptos_types_1.TransactionPayloadScript(new aptos_types_1.Script(script, [], [argU16, argU32, argU256]));
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(ADDRESS_3), BigInt(0), scriptPayload, BigInt(2000), BigInt(0), BigInt(TXN_EXPIRE), new aptos_types_1.ChainId(4));
    const signedTxn = sign(rawTxn);
    expect(hexSignedTxn(signedTxn)).toBe("000000000000000000000000000000000000000000000000000000000a550c180000000000000000000000030611f107111111f10811111111111111111111111111111111111111111111111111111111111111f1d0070000000000000000000000000000ffffffffffffffff040020b9c6ee1630ef3e711144a648db06bbb2284f7274cfbee53ffcee503cc1a49200409402b773f66cf5444efe4de38a026cf9b34e0327798ea01f0695db8e8e0888e20387b08f504b620dcffbc382e3ac141c0ec9a820c5f58b5da2eec589a9e86b0b");
});
//# sourceMappingURL=transaction_builder.test.js.map