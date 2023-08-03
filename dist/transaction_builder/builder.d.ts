import { Ed25519Signature, MultiEd25519PublicKey, MultiEd25519Signature, RawTransaction, SignedTransaction, SigningMessage, MultiAgentRawTransaction, FeePayerRawTransaction, AccountAddress, TransactionPayload } from "../aptos_types";
import { Bytes, Uint64, Uint8 } from "../bcs";
import * as Gen from "../generated/index";
import { MaybeHexString } from "../utils";
export { TypeTagParser } from "../aptos_types";
declare type AnyRawTransaction = RawTransaction | MultiAgentRawTransaction | FeePayerRawTransaction;
/**
 * Function that takes in a Signing Message (serialized raw transaction)
 *  and returns a signature
 */
export declare type SigningFn = (txn: SigningMessage) => Ed25519Signature | MultiEd25519Signature;
export declare class TransactionBuilder<F extends SigningFn> {
    readonly rawTxnBuilder?: TransactionBuilderABI;
    protected readonly signingFunction: F;
    constructor(signingFunction: F, rawTxnBuilder?: TransactionBuilderABI);
    /**
     * Builds a RawTransaction. Relays the call to TransactionBuilderABI.build
     * @param func
     * @param ty_tags
     * @param args
     */
    build(func: string, ty_tags: string[], args: any[]): RawTransaction;
    /** Generates a Signing Message out of a raw transaction. */
    static getSigningMessage(rawTxn: AnyRawTransaction): SigningMessage;
}
/**
 * Provides signing method for signing a raw transaction with single public key.
 */
export declare class TransactionBuilderEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: Uint8Array, rawTxnBuilder?: TransactionBuilderABI);
    rawToSigned(rawTxn: RawTransaction): SignedTransaction;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Provides signing method for signing a raw transaction with multisig public key.
 */
export declare class TransactionBuilderMultiEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: MultiEd25519PublicKey);
    rawToSigned(rawTxn: RawTransaction): SignedTransaction;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Config for creating raw transactions.
 */
interface ABIBuilderConfig {
    sender: MaybeHexString | AccountAddress;
    sequenceNumber: Uint64 | string;
    gasUnitPrice: Uint64 | string;
    maxGasAmount?: Uint64 | string;
    expSecFromNow?: number | string;
    chainId: Uint8 | string;
    expTimestampSec?: bigint;
}
/**
 * Builds raw transactions based on ABI
 */
export declare class TransactionBuilderABI {
    private readonly abiMap;
    private readonly builderConfig;
    /**
     * Constructs a TransactionBuilderABI instance
     * @param abis List of binary ABIs.
     * @param builderConfig Configs for creating a raw transaction.
     */
    constructor(abis: Bytes[], builderConfig?: ABIBuilderConfig);
    private static toBCSArgs;
    private static toTransactionArguments;
    setSequenceNumber(seqNumber: Uint64 | string): void;
    /**
     * Builds a TransactionPayload. For dApps, chain ID and account sequence numbers are only known to the wallet.
     * Instead of building a RawTransaction (requires chainID and sequenceNumber), dApps can build a TransactionPayload
     * and pass the payload to the wallet for signing and sending.
     * @param func Fully qualified func names, e.g. 0x1::aptos_account::transfer
     * @param ty_tags TypeTag strings
     * @param args Function arguments
     * @returns TransactionPayload
     */
    buildTransactionPayload(func: string, ty_tags: string[], args: any[]): TransactionPayload;
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
    build(func: string, ty_tags: string[], args: any[]): RawTransaction;
}
export declare type RemoteABIBuilderConfig = Partial<Omit<ABIBuilderConfig, "sender">> & {
    sender: MaybeHexString | AccountAddress;
};
interface AptosClientInterface {
    getAccountModules: (accountAddress: MaybeHexString) => Promise<Gen.MoveModuleBytecode[]>;
    getAccount: (accountAddress: MaybeHexString) => Promise<Gen.AccountData>;
    getChainId: () => Promise<number>;
    estimateGasPrice: () => Promise<Gen.GasEstimation>;
    getLedgerInfo: () => Promise<Gen.IndexResponse>;
}
/**
 * This transaction builder downloads JSON ABIs from the fullnodes.
 * It then translates the JSON ABIs to the format that is accepted by TransactionBuilderABI
 */
export declare class TransactionBuilderRemoteABI {
    private readonly aptosClient;
    private readonly builderConfig;
    constructor(aptosClient: AptosClientInterface, builderConfig: RemoteABIBuilderConfig);
    fetchABI(addr: string): Promise<Map<string, Gen.MoveFunction & {
        fullName: string;
    }>>;
    /**
     * Builds a raw transaction. Only support script function a.k.a entry function payloads
     *
     * @param func fully qualified function name in format <address>::<module>::<function>, e.g. 0x1::coin::transfer
     * @param ty_tags
     * @param args
     * @returns RawTransaction
     */
    build(func: Gen.EntryFunctionId, ty_tags: Gen.MoveType[], args: any[]): Promise<RawTransaction>;
}
//# sourceMappingURL=builder.d.ts.map