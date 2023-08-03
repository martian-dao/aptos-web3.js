import { Deserializer, Serializer, Uint64, Bytes, Seq, Uint8, Uint128, Uint16, Uint256 } from "../bcs";
import { TransactionAuthenticator } from "./authenticator";
import { Identifier } from "./identifier";
import { TypeTag } from "./type_tag";
import { AccountAddress } from "./account_address";
export declare class RawTransaction {
    readonly sender: AccountAddress;
    readonly sequence_number: Uint64;
    readonly payload: TransactionPayload;
    readonly max_gas_amount: Uint64;
    readonly gas_unit_price: Uint64;
    readonly expiration_timestamp_secs: Uint64;
    readonly chain_id: ChainId;
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
    constructor(sender: AccountAddress, sequence_number: Uint64, payload: TransactionPayload, max_gas_amount: Uint64, gas_unit_price: Uint64, expiration_timestamp_secs: Uint64, chain_id: ChainId);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransaction;
}
export declare class Script {
    readonly code: Bytes;
    readonly ty_args: Seq<TypeTag>;
    readonly args: Seq<TransactionArgument>;
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
    constructor(code: Bytes, ty_args: Seq<TypeTag>, args: Seq<TransactionArgument>);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Script;
}
export declare class EntryFunction {
    readonly module_name: ModuleId;
    readonly function_name: Identifier;
    readonly ty_args: Seq<TypeTag>;
    readonly args: Seq<Bytes>;
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
    constructor(module_name: ModuleId, function_name: Identifier, ty_args: Seq<TypeTag>, args: Seq<Bytes>);
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
    static natural(module: string, func: string, ty_args: Seq<TypeTag>, args: Seq<Bytes>): EntryFunction;
    /**
     * `natual` is deprecated, please use `natural`
     *
     * @deprecated.
     */
    static natual(module: string, func: string, ty_args: Seq<TypeTag>, args: Seq<Bytes>): EntryFunction;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): EntryFunction;
}
export declare class MultiSigTransactionPayload {
    readonly transaction_payload: EntryFunction;
    /**
     * Contains the payload to run a multisig account transaction.
     * @param transaction_payload The payload of the multisig transaction. This can only be EntryFunction for now but
     * Script might be supported in the future.
     */
    constructor(transaction_payload: EntryFunction);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiSigTransactionPayload;
}
export declare class MultiSig {
    readonly multisig_address: AccountAddress;
    readonly transaction_payload?: MultiSigTransactionPayload;
    /**
     * Contains the payload to run a multisig account transaction.
     * @param multisig_address The multisig account address the transaction will be executed as.
     * @param transaction_payload The payload of the multisig transaction. This is optional when executing a multisig
     *  transaction whose payload is already stored on chain.
     */
    constructor(multisig_address: AccountAddress, transaction_payload?: MultiSigTransactionPayload);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): MultiSig;
}
export declare class Module {
    readonly code: Bytes;
    /**
     * Contains the bytecode of a Move module that can be published to the Aptos chain.
     * @param code Move bytecode of a module.
     */
    constructor(code: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Module;
}
export declare class ModuleId {
    readonly address: AccountAddress;
    readonly name: Identifier;
    /**
     * Full name of a module.
     * @param address The account address.
     * @param name The name of the module under the account at "address".
     */
    constructor(address: AccountAddress, name: Identifier);
    /**
     * Converts a string literal to a ModuleId
     * @param moduleId String literal in format "AccountAddress::module_name", e.g. "0x1::coin"
     * @returns
     */
    static fromStr(moduleId: string): ModuleId;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ModuleId;
}
export declare class ChangeSet {
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChangeSet;
}
export declare class WriteSet {
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): WriteSet;
}
export declare class SignedTransaction {
    readonly raw_txn: RawTransaction;
    readonly authenticator: TransactionAuthenticator;
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
    constructor(raw_txn: RawTransaction, authenticator: TransactionAuthenticator);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): SignedTransaction;
}
export declare abstract class RawTransactionWithData {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): RawTransactionWithData;
}
export declare class MultiAgentRawTransaction extends RawTransactionWithData {
    readonly raw_txn: RawTransaction;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Seq<AccountAddress>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): MultiAgentRawTransaction;
}
export declare class FeePayerRawTransaction extends RawTransactionWithData {
    readonly raw_txn: RawTransaction;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly fee_payer_address: AccountAddress;
    constructor(raw_txn: RawTransaction, secondary_signer_addresses: Seq<AccountAddress>, fee_payer_address: AccountAddress);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): FeePayerRawTransaction;
}
export declare abstract class TransactionPayload {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionPayload;
}
export declare class TransactionPayloadScript extends TransactionPayload {
    readonly value: Script;
    constructor(value: Script);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadScript;
}
export declare class TransactionPayloadEntryFunction extends TransactionPayload {
    readonly value: EntryFunction;
    constructor(value: EntryFunction);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadEntryFunction;
}
export declare class TransactionPayloadMultisig extends TransactionPayload {
    readonly value: MultiSig;
    constructor(value: MultiSig);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionPayloadMultisig;
}
export declare class ChainId {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ChainId;
}
export declare abstract class TransactionArgument {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionArgument;
}
export declare class TransactionArgumentU8 extends TransactionArgument {
    readonly value: Uint8;
    constructor(value: Uint8);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU8;
}
export declare class TransactionArgumentU16 extends TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU16;
}
export declare class TransactionArgumentU32 extends TransactionArgument {
    readonly value: Uint16;
    constructor(value: Uint16);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU32;
}
export declare class TransactionArgumentU64 extends TransactionArgument {
    readonly value: Uint64;
    constructor(value: Uint64);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU64;
}
export declare class TransactionArgumentU128 extends TransactionArgument {
    readonly value: Uint128;
    constructor(value: Uint128);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU128;
}
export declare class TransactionArgumentU256 extends TransactionArgument {
    readonly value: Uint256;
    constructor(value: Uint256);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU256;
}
export declare class TransactionArgumentAddress extends TransactionArgument {
    readonly value: AccountAddress;
    constructor(value: AccountAddress);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentAddress;
}
export declare class TransactionArgumentU8Vector extends TransactionArgument {
    readonly value: Bytes;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentU8Vector;
}
export declare class TransactionArgumentBool extends TransactionArgument {
    readonly value: boolean;
    constructor(value: boolean);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionArgumentBool;
}
export declare abstract class Transaction {
    abstract serialize(serializer: Serializer): void;
    abstract hash(): Bytes;
    getHashSalt(): Bytes;
    static deserialize(deserializer: Deserializer): Transaction;
}
export declare class UserTransaction extends Transaction {
    readonly value: SignedTransaction;
    constructor(value: SignedTransaction);
    hash(): Bytes;
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): UserTransaction;
}
//# sourceMappingURL=transaction.d.ts.map