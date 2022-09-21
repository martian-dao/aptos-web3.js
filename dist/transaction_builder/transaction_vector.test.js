"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Do fuzzing tests with test vectors. The test vectors are produced by the same code
 * used by the Aptos Blockchain. The test vectors are arrays of JSON objects.
 * Each JSON object contains randomized inputs to Transaction Builder and BCS and
 * the expected outputs.
 */
const path_1 = __importDefault(require("path"));
const Nacl = __importStar(require("tweetnacl"));
const fs_1 = __importDefault(require("fs"));
const aptos_types_1 = require("./aptos_types");
const hex_string_1 = require("../hex_string");
const builder_1 = require("./builder");
// eslint-disable-next-line operator-linebreak
const VECTOR_FILES_ROOT_DIR = process.env.VECTOR_FILES_ROOT_DIR || path_1.default.resolve(__dirname, "..", "..", "..", "..", "..", "api", "goldens");
const ENTRY_FUNCTION_VECTOR = path_1.default.join(VECTOR_FILES_ROOT_DIR, "aptos_api__tests__transaction_vector_test__test_entry_function_payload.json");
const SCRIPT_VECTOR = path_1.default.join(VECTOR_FILES_ROOT_DIR, "aptos_api__tests__transaction_vector_test__test_script_payload.json");
const MODULE_VECTOR = path_1.default.join(VECTOR_FILES_ROOT_DIR, "aptos_api__tests__transaction_vector_test__test_module_payload.json");
function parseTypeTag(typeTag) {
    if (typeTag.vector) {
        return new aptos_types_1.TypeTagVector(parseTypeTag(typeTag.vector));
    }
    if (typeTag.struct) {
        const { address, module, name, 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        type_args, } = typeTag.struct;
        const typeArgs = type_args.map((arg) => parseTypeTag(arg));
        const structTag = new aptos_types_1.StructTag(aptos_types_1.AccountAddress.fromHex(address), new aptos_types_1.Identifier(module), new aptos_types_1.Identifier(name), typeArgs);
        return new aptos_types_1.TypeTagStruct(structTag);
    }
    switch (typeTag) {
        case "bool":
            return new aptos_types_1.TypeTagBool();
        case "u8":
            return new aptos_types_1.TypeTagU8();
        case "u64":
            return new aptos_types_1.TypeTagU64();
        case "u128":
            return new aptos_types_1.TypeTagU128();
        case "address":
            return new aptos_types_1.TypeTagAddress();
        case "signer":
            return new aptos_types_1.TypeTagSigner();
        default:
            throw new Error("Unknown type tag");
    }
}
function parseTransactionArgument(arg) {
    const argHasOwnProperty = (propertyName) => Object.prototype.hasOwnProperty.call(arg, propertyName);
    if (argHasOwnProperty("U8")) {
        // arg.U8 is a number
        return new aptos_types_1.TransactionArgumentU8(arg.U8);
    }
    if (argHasOwnProperty("U64")) {
        // arg.U64 is a string literal
        return new aptos_types_1.TransactionArgumentU64(BigInt(arg.U64));
    }
    if (argHasOwnProperty("U128")) {
        // arg.U128 is a string literal
        return new aptos_types_1.TransactionArgumentU128(BigInt(arg.U128));
    }
    if (argHasOwnProperty("Address")) {
        // arg.Address is a hex string
        return new aptos_types_1.TransactionArgumentAddress(aptos_types_1.AccountAddress.fromHex(arg.Address));
    }
    if (argHasOwnProperty("U8Vector")) {
        // arg.U8Vector is a hex string
        return new aptos_types_1.TransactionArgumentU8Vector(new hex_string_1.HexString(arg.U8Vector).toUint8Array());
    }
    if (argHasOwnProperty("Bool")) {
        return new aptos_types_1.TransactionArgumentBool(arg.Bool);
    }
    throw new Error("Invalid Transaction Argument");
}
function sign(rawTxn, privateKey) {
    const privateKeyBytes = new hex_string_1.HexString(privateKey).toUint8Array();
    const signingKey = Nacl.sign.keyPair.fromSeed(privateKeyBytes.slice(0, 32));
    const { publicKey } = signingKey;
    const txnBuilder = new builder_1.TransactionBuilderEd25519((signingMessage) => new aptos_types_1.Ed25519Signature(Nacl.sign(signingMessage, signingKey.secretKey).slice(0, 64)), publicKey);
    return Buffer.from(txnBuilder.sign(rawTxn)).toString("hex");
}
function verify(raw_txn, payload, private_key, expected_output) {
    const rawTxn = new aptos_types_1.RawTransaction(aptos_types_1.AccountAddress.fromHex(raw_txn.sender), BigInt(raw_txn.sequence_number), payload, BigInt(raw_txn.max_gas_amount), BigInt(raw_txn.gas_unit_price), BigInt(raw_txn.expiration_timestamp_secs), new aptos_types_1.ChainId(raw_txn.chain_id));
    const signedTxn = sign(rawTxn, private_key);
    expect(signedTxn).toBe(expected_output);
}
describe("Transaction builder vector test", () => {
    it("should pass on entry function payload", () => {
        const vector = JSON.parse(fs_1.default.readFileSync(ENTRY_FUNCTION_VECTOR, "utf8"));
        vector.forEach(({ raw_txn, signed_txn_bcs, private_key }) => {
            const payload = raw_txn.payload.EntryFunction;
            const entryFunctionPayload = new aptos_types_1.TransactionPayloadEntryFunction(aptos_types_1.EntryFunction.natural(`${payload.module.address}::${payload.module.name}`, payload.function, payload.ty_args.map((tag) => parseTypeTag(tag)), payload.args.map((arg) => new hex_string_1.HexString(arg).toUint8Array())));
            verify(raw_txn, entryFunctionPayload, private_key, signed_txn_bcs);
        });
    });
    it("should pass on script payload", () => {
        const vector = JSON.parse(fs_1.default.readFileSync(SCRIPT_VECTOR, "utf8"));
        vector.forEach(({ raw_txn, signed_txn_bcs, private_key }) => {
            const payload = raw_txn.payload.Script;
            // payload.code is hex string
            const code = new hex_string_1.HexString(payload.code).toUint8Array();
            const scriptPayload = new aptos_types_1.TransactionPayloadScript(new aptos_types_1.Script(code, payload.ty_args.map((tag) => parseTypeTag(tag)), payload.args.map((arg) => parseTransactionArgument(arg))));
            verify(raw_txn, scriptPayload, private_key, signed_txn_bcs);
        });
    });
    it("should pass on module payload", () => {
        const vector = JSON.parse(fs_1.default.readFileSync(MODULE_VECTOR, "utf8"));
        vector.forEach(({ raw_txn, signed_txn_bcs, private_key }) => {
            const payload = raw_txn.payload.ModuleBundle.codes;
            // payload.code is hex string
            const modulePayload = new aptos_types_1.TransactionPayloadModuleBundle(new aptos_types_1.ModuleBundle(payload.map(({ code }) => new aptos_types_1.Module(new hex_string_1.HexString(code).toUint8Array()))));
            verify(raw_txn, modulePayload, private_key, signed_txn_bcs);
        });
    });
});
//# sourceMappingURL=transaction_vector.test.js.map