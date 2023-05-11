"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const bcs_1 = require("../../bcs");
const abi_1 = require("../../aptos_types/abi");
const aptos_types_1 = require("../../aptos_types");
const aptos_types_2 = require("../../aptos_types");
// eslint-disable-next-line operator-linebreak
const SCRIPT_FUNCTION_ABI = 
// eslint-disable-next-line max-len
"010E6372656174655F6163636F756E740000000000000000000000000000000000000000000000000000000000000001074163636F756E7420204261736963206163636F756E74206372656174696F6E206D6574686F64732E000108617574685F6B657904";
// eslint-disable-next-line operator-linebreak
const TRANSACTION_SCRIPT_ABI = 
// eslint-disable-next-line max-len
"00046D61696E0F20412074657374207363726970742E8B01A11CEB0B050000000501000403040A050E0B071924083D200000000101020301000003010400020C0301050001060C0101074163636F756E74065369676E65720A616464726573735F6F66096578697374735F617400000000000000000000000000000000000000000000000000000000000000010000010A0E0011000C020B021101030705090B0127020001016902";
describe("ABI", () => {
    it("parses create_account successfully", async () => {
        const name = "create_account";
        const doc = " Basic account creation methods.";
        const typeArgABIs = [new abi_1.ArgumentABI("auth_key", new aptos_types_1.TypeTagAddress())];
        const abi = new abi_1.EntryFunctionABI(name, aptos_types_2.ModuleId.fromStr("0x1::Account"), doc, [], typeArgABIs);
        const serializer = new bcs_1.Serializer();
        abi.serialize(serializer);
        expect(utils_1.HexString.fromUint8Array(serializer.getBytes()).noPrefix()).toBe(SCRIPT_FUNCTION_ABI.toLowerCase());
        const deserializer = new bcs_1.Deserializer(new utils_1.HexString(SCRIPT_FUNCTION_ABI).toUint8Array());
        const entryFunctionABI = abi_1.ScriptABI.deserialize(deserializer);
        const { address: moduleAddress, name: moduleName } = entryFunctionABI.module_name;
        expect(entryFunctionABI.name).toBe("create_account");
        expect(utils_1.HexString.fromUint8Array(moduleAddress.address).toShortString()).toBe("0x1");
        expect(moduleName.value).toBe("Account");
        expect(entryFunctionABI.doc.trim()).toBe("Basic account creation methods.");
        const arg = entryFunctionABI.args[0];
        expect(arg.name).toBe("auth_key");
        expect(arg.type_tag instanceof aptos_types_1.TypeTagAddress).toBeTruthy();
    });
    it("parses script abi successfully", async () => {
        const name = "main";
        // eslint-disable-next-line max-len
        const code = "0xa11ceb0b050000000501000403040a050e0b071924083d200000000101020301000003010400020c0301050001060c0101074163636f756e74065369676e65720a616464726573735f6f66096578697374735f617400000000000000000000000000000000000000000000000000000000000000010000010a0e0011000c020b021101030705090b012702";
        const doc = " A test script.";
        const typeArgABIs = [new abi_1.ArgumentABI("i", new aptos_types_1.TypeTagU64())];
        const abi = new abi_1.TransactionScriptABI(name, doc, utils_1.HexString.ensure(code).toUint8Array(), [], typeArgABIs);
        const serializer = new bcs_1.Serializer();
        abi.serialize(serializer);
        expect(utils_1.HexString.fromUint8Array(serializer.getBytes()).noPrefix()).toBe(TRANSACTION_SCRIPT_ABI.toLowerCase());
        const deserializer = new bcs_1.Deserializer(new utils_1.HexString(TRANSACTION_SCRIPT_ABI).toUint8Array());
        const transactionScriptABI = abi_1.ScriptABI.deserialize(deserializer);
        expect(transactionScriptABI.name).toBe("main");
        expect(transactionScriptABI.doc.trim()).toBe("A test script.");
        expect(utils_1.HexString.fromUint8Array(transactionScriptABI.code).hex()).toBe(code);
        const arg = transactionScriptABI.args[0];
        expect(arg.name).toBe("i");
        expect(arg.type_tag instanceof aptos_types_1.TypeTagU64).toBeTruthy();
    });
});
//# sourceMappingURL=abi.test.js.map