"use strict";
// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTransaction = exports.Transaction = exports.TransactionArgumentBool = exports.TransactionArgumentU8Vector = exports.TransactionArgumentAddress = exports.TransactionArgumentU256 = exports.TransactionArgumentU128 = exports.TransactionArgumentU64 = exports.TransactionArgumentU32 = exports.TransactionArgumentU16 = exports.TransactionArgumentU8 = exports.TransactionArgument = exports.ChainId = exports.TransactionPayloadMultisig = exports.TransactionPayloadEntryFunction = exports.TransactionPayloadScript = exports.TransactionPayload = exports.FeePayerRawTransaction = exports.MultiAgentRawTransaction = exports.RawTransactionWithData = exports.SignedTransaction = exports.WriteSet = exports.ChangeSet = exports.ModuleId = exports.Module = exports.MultiSig = exports.MultiSigTransactionPayload = exports.EntryFunction = exports.Script = exports.RawTransaction = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
const sha3_1 = require("@noble/hashes/sha3");
const utils_1 = require("../utils");
const bcs_1 = require("../bcs");
const authenticator_1 = require("./authenticator");
const identifier_1 = require("./identifier");
const type_tag_1 = require("./type_tag");
const account_address_1 = require("./account_address");
class RawTransaction {
    /**
     * RawTransactions contain the metadata and payloads that can be submitted to Aptos chain for execution.
     * RawTransactions must be signed before Aptos chain can execute them.
     *
     * @param sender Account address of the sender.
     * @param sequence_number Sequence number of this transaction. This must match the sequence number stored in
     *   the sender's account at the time the transaction executes.
     * @param payload Instructions for the Aptos Blockchain, including publishing a module,
     *   execute a entry function or execute a script payload.
     * @param max_gas_amount Maximum total gas to spend for this transaction. The account must have more
     *   than this gas or the transaction will be discarded during validation.
     * @param gas_unit_price Price to be paid per gas unit.
     * @param expiration_timestamp_secs The blockchain timestamp at which the blockchain would discard this transaction.
     * @param chain_id The chain ID of the blockchain that this transaction is intended to be run on.
     */
    constructor(sender, sequence_number, payload, max_gas_amount, gas_unit_price, expiration_timestamp_secs, chain_id) {
        this.sender = sender;
        this.sequence_number = sequence_number;
        this.payload = payload;
        this.max_gas_amount = max_gas_amount;
        this.gas_unit_price = gas_unit_price;
        this.expiration_timestamp_secs = expiration_timestamp_secs;
        this.chain_id = chain_id;
    }
    serialize(serializer) {
        this.sender.serialize(serializer);
        serializer.serializeU64(this.sequence_number);
        this.payload.serialize(serializer);
        serializer.serializeU64(this.max_gas_amount);
        serializer.serializeU64(this.gas_unit_price);
        serializer.serializeU64(this.expiration_timestamp_secs);
        this.chain_id.serialize(serializer);
    }
    static deserialize(deserializer) {
        const sender = account_address_1.AccountAddress.deserialize(deserializer);
        const sequence_number = deserializer.deserializeU64();
        const payload = TransactionPayload.deserialize(deserializer);
        const max_gas_amount = deserializer.deserializeU64();
        const gas_unit_price = deserializer.deserializeU64();
        const expiration_timestamp_secs = deserializer.deserializeU64();
        const chain_id = ChainId.deserialize(deserializer);
        return new RawTransaction(sender, sequence_number, payload, max_gas_amount, gas_unit_price, expiration_timestamp_secs, chain_id);
    }
}
exports.RawTransaction = RawTransaction;
class Script {
    /**
     * Scripts contain the Move bytecodes payload that can be submitted to Aptos chain for execution.
     * @param code Move bytecode
     * @param ty_args Type arguments that bytecode requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to bytecode function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(code, ty_args, args) {
        this.code = code;
        this.ty_args = ty_args;
        this.args = args;
    }
    serialize(serializer) {
        serializer.serializeBytes(this.code);
        (0, bcs_1.serializeVector)(this.ty_args, serializer);
        (0, bcs_1.serializeVector)(this.args, serializer);
    }
    static deserialize(deserializer) {
        const code = deserializer.deserializeBytes();
        const ty_args = (0, bcs_1.deserializeVector)(deserializer, type_tag_1.TypeTag);
        const args = (0, bcs_1.deserializeVector)(deserializer, TransactionArgument);
        return new Script(code, ty_args, args);
    }
}
exports.Script = Script;
class EntryFunction {
    /**
     * Contains the payload to run a function within a module.
     * @param module_name Fully qualified module name. ModuleId consists of account address and module name.
     * @param function_name The function to run.
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     */
    constructor(module_name, function_name, ty_args, args) {
        this.module_name = module_name;
        this.function_name = function_name;
        this.ty_args = ty_args;
        this.args = args;
    }
    /**
     *
     * @param module Fully qualified module name in format "AccountAddress::module_name" e.g. "0x1::coin"
     * @param func Function name
     * @param ty_args Type arguments that move function requires.
     *
     * @example
     * A coin transfer function has one type argument "CoinType".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @param args Arugments to the move function.
     *
     * @example
     * A coin transfer function has three arugments "from", "to" and "amount".
     * ```
     * public(script) fun transfer<CoinType>(from: &signer, to: address, amount: u64,)
     * ```
     * @returns
     */
    static natural(module, func, ty_args, args) {
        return new EntryFunction(ModuleId.fromStr(module), new identifier_1.Identifier(func), ty_args, args);
    }
    /**
     * `natual` is deprecated, please use `natural`
     *
     * @deprecated.
     */
    static natual(module, func, ty_args, args) {
        return EntryFunction.natural(module, func, ty_args, args);
    }
    serialize(serializer) {
        this.module_name.serialize(serializer);
        this.function_name.serialize(serializer);
        (0, bcs_1.serializeVector)(this.ty_args, serializer);
        serializer.serializeU32AsUleb128(this.args.length);
        this.args.forEach((item) => {
            serializer.serializeBytes(item);
        });
    }
    static deserialize(deserializer) {
        const module_name = ModuleId.deserialize(deserializer);
        const function_name = identifier_1.Identifier.deserialize(deserializer);
        const ty_args = (0, bcs_1.deserializeVector)(deserializer, type_tag_1.TypeTag);
        const length = deserializer.deserializeUleb128AsU32();
        const list = [];
        for (let i = 0; i < length; i += 1) {
            list.push(deserializer.deserializeBytes());
        }
        const args = list;
        return new EntryFunction(module_name, function_name, ty_args, args);
    }
}
exports.EntryFunction = EntryFunction;
class MultiSigTransactionPayload {
    /**
     * Contains the payload to run a multisig account transaction.
     * @param transaction_payload The payload of the multisig transaction. This can only be EntryFunction for now but
     * Script might be supported in the future.
     */
    constructor(transaction_payload) {
        this.transaction_payload = transaction_payload;
    }
    serialize(serializer) {
        // We can support multiple types of inner transaction payload in the future.
        // For now it's only EntryFunction but if we support more types, we need to serialize with the right enum values
        // here
        serializer.serializeU32AsUleb128(0);
        this.transaction_payload.serialize(serializer);
    }
    static deserialize(deserializer) {
        // TODO: Support other types of payload beside EntryFunction.
        // This is the enum value indicating which type of payload the multisig tx contains.
        deserializer.deserializeUleb128AsU32();
        return new MultiSigTransactionPayload(EntryFunction.deserialize(deserializer));
    }
}
exports.MultiSigTransactionPayload = MultiSigTransactionPayload;
class MultiSig {
    /**
     * Contains the payload to run a multisig account transaction.
     * @param multisig_address The multisig account address the transaction will be executed as.
     * @param transaction_payload The payload of the multisig transaction. This is optional when executing a multisig
     *  transaction whose payload is already stored on chain.
     */
    constructor(multisig_address, transaction_payload) {
        this.multisig_address = multisig_address;
        this.transaction_payload = transaction_payload;
    }
    serialize(serializer) {
        this.multisig_address.serialize(serializer);
        // Options are encoded with an extra u8 field before the value - 0x0 is none and 0x1 is present.
        // We use serializeBool below to create this prefix value.
        if (this.transaction_payload === undefined) {
            serializer.serializeBool(false);
        }
        else {
            serializer.serializeBool(true);
            this.transaction_payload.serialize(serializer);
        }
    }
    static deserialize(deserializer) {
        const multisig_address = account_address_1.AccountAddress.deserialize(deserializer);
        const payloadPresent = deserializer.deserializeBool();
        let transaction_payload;
        if (payloadPresent) {
            transaction_payload = MultiSigTransactionPayload.deserialize(deserializer);
        }
        return new MultiSig(multisig_address, transaction_payload);
    }
}
exports.MultiSig = MultiSig;
class Module {
    /**
     * Contains the bytecode of a Move module that can be published to the Aptos chain.
     * @param code Move bytecode of a module.
     */
    constructor(code) {
        this.code = code;
    }
    serialize(serializer) {
        serializer.serializeBytes(this.code);
    }
    static deserialize(deserializer) {
        const code = deserializer.deserializeBytes();
        return new Module(code);
    }
}
exports.Module = Module;
class ModuleId {
    /**
     * Full name of a module.
     * @param address The account address.
     * @param name The name of the module under the account at "address".
     */
    constructor(address, name) {
        this.address = address;
        this.name = name;
    }
    /**
     * Converts a string literal to a ModuleId
     * @param moduleId String literal in format "AccountAddress::module_name", e.g. "0x1::coin"
     * @returns
     */
    static fromStr(moduleId) {
        const parts = moduleId.split("::");
        if (parts.length !== 2) {
            throw new Error("Invalid module id.");
        }
        return new ModuleId(account_address_1.AccountAddress.fromHex(new utils_1.HexString(parts[0])), new identifier_1.Identifier(parts[1]));
    }
    serialize(serializer) {
        this.address.serialize(serializer);
        this.name.serialize(serializer);
    }
    static deserialize(deserializer) {
        const address = account_address_1.AccountAddress.deserialize(deserializer);
        const name = identifier_1.Identifier.deserialize(deserializer);
        return new ModuleId(address, name);
    }
}
exports.ModuleId = ModuleId;
class ChangeSet {
    serialize(serializer) {
        throw new Error("Not implemented.");
    }
    static deserialize(deserializer) {
        throw new Error("Not implemented.");
    }
}
exports.ChangeSet = ChangeSet;
class WriteSet {
    serialize(serializer) {
        throw new Error("Not implmented.");
    }
    static deserialize(deserializer) {
        throw new Error("Not implmented.");
    }
}
exports.WriteSet = WriteSet;
class SignedTransaction {
    /**
     * A SignedTransaction consists of a raw transaction and an authenticator. The authenticator
     * contains a client's public key and the signature of the raw transaction.
     *
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     *
     * @param raw_txn
     * @param authenticator Contains a client's public key and the signature of the raw transaction.
     *   Authenticator has 3 flavors: single signature, multi-signature and multi-agent.
     *   @see authenticator.ts for details.
     */
    constructor(raw_txn, authenticator) {
        this.raw_txn = raw_txn;
        this.authenticator = authenticator;
    }
    serialize(serializer) {
        this.raw_txn.serialize(serializer);
        this.authenticator.serialize(serializer);
    }
    static deserialize(deserializer) {
        const raw_txn = RawTransaction.deserialize(deserializer);
        const authenticator = authenticator_1.TransactionAuthenticator.deserialize(deserializer);
        return new SignedTransaction(raw_txn, authenticator);
    }
}
exports.SignedTransaction = SignedTransaction;
class RawTransactionWithData {
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return MultiAgentRawTransaction.load(deserializer);
            case 1:
                return FeePayerRawTransaction.load(deserializer);
            default:
                throw new Error(`Unknown variant index for RawTransactionWithData: ${index}`);
        }
    }
}
exports.RawTransactionWithData = RawTransactionWithData;
class MultiAgentRawTransaction extends RawTransactionWithData {
    constructor(raw_txn, secondary_signer_addresses) {
        super();
        this.raw_txn = raw_txn;
        this.secondary_signer_addresses = secondary_signer_addresses;
    }
    serialize(serializer) {
        // enum variant index
        serializer.serializeU32AsUleb128(0);
        this.raw_txn.serialize(serializer);
        (0, bcs_1.serializeVector)(this.secondary_signer_addresses, serializer);
    }
    static load(deserializer) {
        const rawTxn = RawTransaction.deserialize(deserializer);
        const secondarySignerAddresses = (0, bcs_1.deserializeVector)(deserializer, account_address_1.AccountAddress);
        return new MultiAgentRawTransaction(rawTxn, secondarySignerAddresses);
    }
}
exports.MultiAgentRawTransaction = MultiAgentRawTransaction;
class FeePayerRawTransaction extends RawTransactionWithData {
    constructor(raw_txn, secondary_signer_addresses, fee_payer_address) {
        super();
        this.raw_txn = raw_txn;
        this.secondary_signer_addresses = secondary_signer_addresses;
        this.fee_payer_address = fee_payer_address;
    }
    serialize(serializer) {
        // enum variant index
        serializer.serializeU32AsUleb128(1);
        this.raw_txn.serialize(serializer);
        (0, bcs_1.serializeVector)(this.secondary_signer_addresses, serializer);
        this.fee_payer_address.serialize(serializer);
    }
    static load(deserializer) {
        const rawTxn = RawTransaction.deserialize(deserializer);
        const secondarySignerAddresses = (0, bcs_1.deserializeVector)(deserializer, account_address_1.AccountAddress);
        const feePayerAddress = account_address_1.AccountAddress.deserialize(deserializer);
        return new FeePayerRawTransaction(rawTxn, secondarySignerAddresses, feePayerAddress);
    }
}
exports.FeePayerRawTransaction = FeePayerRawTransaction;
class TransactionPayload {
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TransactionPayloadScript.load(deserializer);
            // TODO: change to 1 once ModuleBundle has been removed from rust
            case 2:
                return TransactionPayloadEntryFunction.load(deserializer);
            case 3:
                return TransactionPayloadMultisig.load(deserializer);
            default:
                throw new Error(`Unknown variant index for TransactionPayload: ${index}`);
        }
    }
}
exports.TransactionPayload = TransactionPayload;
class TransactionPayloadScript extends TransactionPayload {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(0);
        this.value.serialize(serializer);
    }
    static load(deserializer) {
        const value = Script.deserialize(deserializer);
        return new TransactionPayloadScript(value);
    }
}
exports.TransactionPayloadScript = TransactionPayloadScript;
class TransactionPayloadEntryFunction extends TransactionPayload {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(2);
        this.value.serialize(serializer);
    }
    static load(deserializer) {
        const value = EntryFunction.deserialize(deserializer);
        return new TransactionPayloadEntryFunction(value);
    }
}
exports.TransactionPayloadEntryFunction = TransactionPayloadEntryFunction;
class TransactionPayloadMultisig extends TransactionPayload {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(3);
        this.value.serialize(serializer);
    }
    static load(deserializer) {
        const value = MultiSig.deserialize(deserializer);
        return new TransactionPayloadMultisig(value);
    }
}
exports.TransactionPayloadMultisig = TransactionPayloadMultisig;
class ChainId {
    constructor(value) {
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU8(this.value);
    }
    static deserialize(deserializer) {
        const value = deserializer.deserializeU8();
        return new ChainId(value);
    }
}
exports.ChainId = ChainId;
class TransactionArgument {
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return TransactionArgumentU8.load(deserializer);
            case 1:
                return TransactionArgumentU64.load(deserializer);
            case 2:
                return TransactionArgumentU128.load(deserializer);
            case 3:
                return TransactionArgumentAddress.load(deserializer);
            case 4:
                return TransactionArgumentU8Vector.load(deserializer);
            case 5:
                return TransactionArgumentBool.load(deserializer);
            case 6:
                return TransactionArgumentU16.load(deserializer);
            case 7:
                return TransactionArgumentU32.load(deserializer);
            case 8:
                return TransactionArgumentU256.load(deserializer);
            default:
                throw new Error(`Unknown variant index for TransactionArgument: ${index}`);
        }
    }
}
exports.TransactionArgument = TransactionArgument;
class TransactionArgumentU8 extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(0);
        serializer.serializeU8(this.value);
    }
    static load(deserializer) {
        const value = deserializer.deserializeU8();
        return new TransactionArgumentU8(value);
    }
}
exports.TransactionArgumentU8 = TransactionArgumentU8;
class TransactionArgumentU16 extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(6);
        serializer.serializeU16(this.value);
    }
    static load(deserializer) {
        const value = deserializer.deserializeU16();
        return new TransactionArgumentU16(value);
    }
}
exports.TransactionArgumentU16 = TransactionArgumentU16;
class TransactionArgumentU32 extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(7);
        serializer.serializeU32(this.value);
    }
    static load(deserializer) {
        const value = deserializer.deserializeU32();
        return new TransactionArgumentU32(value);
    }
}
exports.TransactionArgumentU32 = TransactionArgumentU32;
class TransactionArgumentU64 extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(1);
        serializer.serializeU64(this.value);
    }
    static load(deserializer) {
        const value = deserializer.deserializeU64();
        return new TransactionArgumentU64(value);
    }
}
exports.TransactionArgumentU64 = TransactionArgumentU64;
class TransactionArgumentU128 extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(2);
        serializer.serializeU128(this.value);
    }
    static load(deserializer) {
        const value = deserializer.deserializeU128();
        return new TransactionArgumentU128(value);
    }
}
exports.TransactionArgumentU128 = TransactionArgumentU128;
class TransactionArgumentU256 extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(8);
        serializer.serializeU256(this.value);
    }
    static load(deserializer) {
        const value = deserializer.deserializeU256();
        return new TransactionArgumentU256(value);
    }
}
exports.TransactionArgumentU256 = TransactionArgumentU256;
class TransactionArgumentAddress extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(3);
        this.value.serialize(serializer);
    }
    static load(deserializer) {
        const value = account_address_1.AccountAddress.deserialize(deserializer);
        return new TransactionArgumentAddress(value);
    }
}
exports.TransactionArgumentAddress = TransactionArgumentAddress;
class TransactionArgumentU8Vector extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(4);
        serializer.serializeBytes(this.value);
    }
    static load(deserializer) {
        const value = deserializer.deserializeBytes();
        return new TransactionArgumentU8Vector(value);
    }
}
exports.TransactionArgumentU8Vector = TransactionArgumentU8Vector;
class TransactionArgumentBool extends TransactionArgument {
    constructor(value) {
        super();
        this.value = value;
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(5);
        serializer.serializeBool(this.value);
    }
    static load(deserializer) {
        const value = deserializer.deserializeBool();
        return new TransactionArgumentBool(value);
    }
}
exports.TransactionArgumentBool = TransactionArgumentBool;
class Transaction {
    getHashSalt() {
        const hash = sha3_1.sha3_256.create();
        hash.update("APTOS::Transaction");
        return hash.digest();
    }
    static deserialize(deserializer) {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case 0:
                return UserTransaction.load(deserializer);
            default:
                throw new Error(`Unknown variant index for Transaction: ${index}`);
        }
    }
}
exports.Transaction = Transaction;
class UserTransaction extends Transaction {
    constructor(value) {
        super();
        this.value = value;
    }
    hash() {
        const hash = sha3_1.sha3_256.create();
        hash.update(this.getHashSalt());
        hash.update((0, bcs_1.bcsToBytes)(this));
        return hash.digest();
    }
    serialize(serializer) {
        serializer.serializeU32AsUleb128(0);
        this.value.serialize(serializer);
    }
    static load(deserializer) {
        return new UserTransaction(SignedTransaction.deserialize(deserializer));
    }
}
exports.UserTransaction = UserTransaction;
//# sourceMappingURL=transaction.js.map