"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBuilderRemoteABI = exports.TransactionBuilderABI = exports.TransactionBuilderMultiEd25519 = exports.TransactionBuilderEd25519 = exports.TransactionBuilder = exports.TypeTagParser = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const aptos_types_1 = require("../aptos_types");
const bcs_1 = require("../bcs");
const abi_1 = require("../aptos_types/abi");
const builder_utils_1 = require("./builder_utils");
const utils_1 = require("../utils");
var aptos_types_2 = require("../aptos_types");
Object.defineProperty(exports, "TypeTagParser", { enumerable: true, get: function () { return aptos_types_2.TypeTagParser; } });
const RAW_TRANSACTION_SALT = "APTOS::RawTransaction";
const RAW_TRANSACTION_WITH_DATA_SALT = "APTOS::RawTransactionWithData";
class TransactionBuilder {
    constructor(signingFunction, rawTxnBuilder) {
        this.rawTxnBuilder = rawTxnBuilder;
        this.signingFunction = signingFunction;
    }
    /**
     * Builds a RawTransaction. Relays the call to TransactionBuilderABI.build
     * @param func
     * @param ty_tags
     * @param args
     */
    build(func, ty_tags, args) {
        if (!this.rawTxnBuilder) {
            throw new Error("this.rawTxnBuilder doesn't exist.");
        }
        return this.rawTxnBuilder.build(func, ty_tags, args);
    }
    /** Generates a Signing Message out of a raw transaction. */
    static getSigningMessage(rawTxn) {
        const hash = sha3_1.sha3_256.create();
        if (rawTxn instanceof aptos_types_1.RawTransaction) {
            hash.update(RAW_TRANSACTION_SALT);
        }
        else if (rawTxn instanceof aptos_types_1.MultiAgentRawTransaction) {
            hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
        }
        else if (rawTxn instanceof aptos_types_1.FeePayerRawTransaction) {
            hash.update(RAW_TRANSACTION_WITH_DATA_SALT);
        }
        else {
            throw new Error("Unknown transaction type.");
        }
        const prefix = hash.digest();
        const body = (0, bcs_1.bcsToBytes)(rawTxn);
        const mergedArray = new Uint8Array(prefix.length + body.length);
        mergedArray.set(prefix);
        mergedArray.set(body, prefix.length);
        return mergedArray;
    }
}
exports.TransactionBuilder = TransactionBuilder;
/**
 * Provides signing method for signing a raw transaction with single public key.
 */
class TransactionBuilderEd25519 extends TransactionBuilder {
    constructor(signingFunction, publicKey, rawTxnBuilder) {
        super(signingFunction, rawTxnBuilder);
        this.publicKey = publicKey;
    }
    rawToSigned(rawTxn) {
        const signingMessage = TransactionBuilder.getSigningMessage(rawTxn);
        const signature = this.signingFunction(signingMessage);
        const authenticator = new aptos_types_1.TransactionAuthenticatorEd25519(new aptos_types_1.Ed25519PublicKey(this.publicKey), signature);
        return new aptos_types_1.SignedTransaction(rawTxn, authenticator);
    }
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn) {
        return (0, bcs_1.bcsToBytes)(this.rawToSigned(rawTxn));
    }
}
exports.TransactionBuilderEd25519 = TransactionBuilderEd25519;
/**
 * Provides signing method for signing a raw transaction with multisig public key.
 */
class TransactionBuilderMultiEd25519 extends TransactionBuilder {
    constructor(signingFunction, publicKey) {
        super(signingFunction);
        this.publicKey = publicKey;
    }
    rawToSigned(rawTxn) {
        const signingMessage = TransactionBuilder.getSigningMessage(rawTxn);
        const signature = this.signingFunction(signingMessage);
        const authenticator = new aptos_types_1.TransactionAuthenticatorMultiEd25519(this.publicKey, signature);
        return new aptos_types_1.SignedTransaction(rawTxn, authenticator);
    }
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn) {
        return (0, bcs_1.bcsToBytes)(this.rawToSigned(rawTxn));
    }
}
exports.TransactionBuilderMultiEd25519 = TransactionBuilderMultiEd25519;
/**
 * Builds raw transactions based on ABI
 */
class TransactionBuilderABI {
    /**
     * Constructs a TransactionBuilderABI instance
     * @param abis List of binary ABIs.
     * @param builderConfig Configs for creating a raw transaction.
     */
    constructor(abis, builderConfig) {
        this.abiMap = new Map();
        abis.forEach((abi) => {
            const deserializer = new bcs_1.Deserializer(abi);
            const scriptABI = abi_1.ScriptABI.deserialize(deserializer);
            let k;
            if (scriptABI instanceof abi_1.EntryFunctionABI) {
                const funcABI = scriptABI;
                const { address: addr, name: moduleName } = funcABI.module_name;
                k = `${utils_1.HexString.fromUint8Array(addr.address).toShortString()}::${moduleName.value}::${funcABI.name}`;
            }
            else {
                const funcABI = scriptABI;
                k = funcABI.name;
            }
            if (this.abiMap.has(k)) {
                throw new Error("Found conflicting ABI interfaces");
            }
            this.abiMap.set(k, scriptABI);
        });
        this.builderConfig = {
            maxGasAmount: BigInt(utils_1.DEFAULT_MAX_GAS_AMOUNT),
            expSecFromNow: utils_1.DEFAULT_TXN_EXP_SEC_FROM_NOW,
            ...builderConfig,
        };
    }
    static toBCSArgs(abiArgs, args) {
        if (abiArgs.length !== args.length) {
            throw new Error("Wrong number of args provided.");
        }
        return args.map((arg, i) => {
            const serializer = new bcs_1.Serializer();
            (0, builder_utils_1.serializeArg)(arg, abiArgs[i].type_tag, serializer);
            return serializer.getBytes();
        });
    }
    static toTransactionArguments(abiArgs, args) {
        if (abiArgs.length !== args.length) {
            throw new Error("Wrong number of args provided.");
        }
        return args.map((arg, i) => (0, builder_utils_1.argToTransactionArgument)(arg, abiArgs[i].type_tag));
    }
    setSequenceNumber(seqNumber) {
        this.builderConfig.sequenceNumber = BigInt(seqNumber);
    }
    /**
     * Builds a TransactionPayload. For dApps, chain ID and account sequence numbers are only known to the wallet.
     * Instead of building a RawTransaction (requires chainID and sequenceNumber), dApps can build a TransactionPayload
     * and pass the payload to the wallet for signing and sending.
     * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
     * @param ty_tags TypeTag strings
     * @param args Function arguments
     * @returns TransactionPayload
     */
    buildTransactionPayload(func, ty_tags, args) {
        const typeTags = ty_tags.map((ty_arg) => new aptos_types_1.TypeTagParser(ty_arg).parseTypeTag());
        let payload;
        if (!this.abiMap.has(func)) {
            throw new Error(`Cannot find function: ${func}`);
        }
        const scriptABI = this.abiMap.get(func);
        if (scriptABI instanceof abi_1.EntryFunctionABI) {
            const funcABI = scriptABI;
            const bcsArgs = TransactionBuilderABI.toBCSArgs(funcABI.args, args);
            payload = new aptos_types_1.TransactionPayloadEntryFunction(new aptos_types_1.EntryFunction(funcABI.module_name, new aptos_types_1.Identifier(funcABI.name), typeTags, bcsArgs));
        }
        else if (scriptABI instanceof abi_1.TransactionScriptABI) {
            const funcABI = scriptABI;
            const scriptArgs = TransactionBuilderABI.toTransactionArguments(funcABI.args, args);
            payload = new aptos_types_1.TransactionPayloadScript(new aptos_types_1.Script(funcABI.code, typeTags, scriptArgs));
        }
        else {
            /* istanbul ignore next */
            throw new Error("Unknown ABI format.");
        }
        return payload;
    }
    /**
     * Builds a RawTransaction
     * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
     * @param ty_tags TypeTag strings.
     * @example Below are valid value examples
     * ```
     * // Structs are in format `AccountAddress::ModuleName::StructName`
     * 0x1::aptos_coin::AptosCoin
     * // Vectors are in format `vector<other_tag_string>`
     * vector<0x1::aptos_coin::AptosCoin>
     * bool
     * u8
     * u16
     * u32
     * u64
     * u128
     * u256
     * address
     * ```
     * @param args Function arguments
     * @returns RawTransaction
     */
    build(func, ty_tags, args) {
        const { sender, sequenceNumber, gasUnitPrice, maxGasAmount, expSecFromNow, chainId, expTimestampSec: expirationTimestampSec, } = this.builderConfig;
        if (!gasUnitPrice) {
            throw new Error("No gasUnitPrice provided.");
        }
        let expTimestampSec = expirationTimestampSec;
        const senderAccount = sender instanceof aptos_types_1.AccountAddress
            ? sender
            : aptos_types_1.AccountAddress.fromHex(sender);
        if (!expTimestampSec) {
            expTimestampSec = BigInt(Math.floor(Date.now() / 1000));
        }
        // @ts-ignore
        expTimestampSec += BigInt(expSecFromNow);
        const payload = this.buildTransactionPayload(func, ty_tags, args);
        if (payload) {
            return new aptos_types_1.RawTransaction(senderAccount, BigInt(sequenceNumber), payload, BigInt(maxGasAmount), BigInt(gasUnitPrice), expTimestampSec, new aptos_types_1.ChainId(Number(chainId)));
        }
        throw new Error("Invalid ABI.");
    }
}
exports.TransactionBuilderABI = TransactionBuilderABI;
/**
 * This transaction builder downloads JSON ABIs from the fullnodes.
 * It then translates the JSON ABIs to the format that is accepted by TransactionBuilderABI
 */
class TransactionBuilderRemoteABI {
    // We don't want the builder to depend on the actual AptosClient. There might be circular dependencies.
    constructor(aptosClient, builderConfig) {
        this.aptosClient = aptosClient;
        this.builderConfig = builderConfig;
    }
    // Cache for 10 minutes
    async fetchABI(addr) {
        const modules = await this.aptosClient.getAccountModules(addr);
        const abis = modules
            .map((module) => module.abi)
            .flatMap((abi) => abi.exposed_functions
            .filter((ef) => ef.is_entry)
            .map((ef) => ({
            fullName: `${abi.address}::${abi.name}::${ef.name}`,
            ...ef,
        })));
        const abiMap = new Map();
        abis.forEach((abi) => {
            abiMap.set(abi.fullName, abi);
        });
        return abiMap;
    }
    /**
     * Builds a raw transaction. Only support script function a.k.a entry function payloads
     *
     * @param func fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer
     * @param ty_tags
     * @param args
     * @returns RawTransaction
     */
    async build(func, ty_tags, args) {
        /* eslint no-param-reassign: ["off"] */
        const normlize = (s) => s.replace(/^0[xX]0*/g, "0x");
        func = normlize(func);
        const funcNameParts = func.split("::");
        if (funcNameParts.length !== 3) {
            throw new Error(
            // eslint-disable-next-line max-len
            "'func' needs to be a fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer");
        }
        const [addr, module] = func.split("::");
        // Downloads the JSON abi
        const abiMap = await this.fetchABI(addr);
        if (!abiMap.has(func)) {
            throw new Error(`${func} doesn't exist.`);
        }
        const funcAbi = abiMap.get(func);
        // Remove all `signer` and `&signer` from argument list because the Move VM injects those arguments. Clients do not
        // need to care about those args. `signer` and `&signer` are required be in the front of the argument list. But we
        // just loop through all arguments and filter out `signer` and `&signer`.
        const abiArgs = funcAbi.params.filter((param) => param !== "signer" && param !== "&signer");
        // Convert abi string arguments to TypeArgumentABI
        const typeArgABIs = abiArgs.map((abiArg, i) => new abi_1.ArgumentABI(`var${i}`, new aptos_types_1.TypeTagParser(abiArg, ty_tags).parseTypeTag()));
        const entryFunctionABI = new abi_1.EntryFunctionABI(funcAbi.name, aptos_types_1.ModuleId.fromStr(`${addr}::${module}`), "", // Doc string
        funcAbi.generic_type_params.map((_, i) => new abi_1.TypeArgumentABI(`${i}`)), typeArgABIs);
        const { sender, ...rest } = this.builderConfig;
        const senderAddress = sender instanceof aptos_types_1.AccountAddress
            ? utils_1.HexString.fromUint8Array(sender.address)
            : sender;
        const [{ sequence_number: sequenceNumber }, chainId, { gas_estimate: gasUnitPrice },] = await Promise.all([
            rest?.sequenceNumber
                ? Promise.resolve({ sequence_number: rest?.sequenceNumber })
                : this.aptosClient.getAccount(senderAddress),
            rest?.chainId
                ? Promise.resolve(rest?.chainId)
                : this.aptosClient.getChainId(),
            rest?.gasUnitPrice
                ? Promise.resolve({ gas_estimate: rest?.gasUnitPrice })
                : this.aptosClient.estimateGasPrice(),
        ]);
        const getLedgerInfo = await this.aptosClient.getLedgerInfo();
        // ledger_timestamp is in microseconds ("1662987117698998")
        const expTimestampSec = BigInt(Math.floor(parseInt(getLedgerInfo.ledger_timestamp, 10) / 1000000));
        const builderABI = new TransactionBuilderABI([(0, bcs_1.bcsToBytes)(entryFunctionABI)], {
            sender,
            sequenceNumber,
            chainId,
            gasUnitPrice: BigInt(gasUnitPrice),
            expTimestampSec,
            ...rest,
        });
        return builderABI.build(func, ty_tags, args);
    }
}
__decorate([
    (0, utils_1.MemoizeExpiring)(10 * 60 * 1000)
], TransactionBuilderRemoteABI.prototype, "fetchABI", null);
exports.TransactionBuilderRemoteABI = TransactionBuilderRemoteABI;
//# sourceMappingURL=builder.js.map