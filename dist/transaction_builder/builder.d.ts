import { Ed25519Signature, MultiEd25519PublicKey, MultiEd25519Signature, RawTransaction, SigningMessage, MultiAgentRawTransaction } from "./aptos_types";
import { Bytes } from "./bcs";
declare type AnyRawTransaction = RawTransaction | MultiAgentRawTransaction;
/**
 * Function that takes in a Signing Message (serialized raw transaction)
 *  and returns a signature
 */
export declare type SigningFn = (txn: SigningMessage) => Ed25519Signature | MultiEd25519Signature;
export declare class TransactionBuilder<F extends SigningFn> {
    protected readonly signingFunction: F;
    constructor(signingFunction: F);
    /** Generates a Signing Message out of a raw transaction. */
    static getSigningMessage(rawTxn: AnyRawTransaction): SigningMessage;
}
/**
 * Provides signing method for signing a raw transaction with single public key.
 */
export declare class TransactionBuilderEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: Uint8Array);
    private signInternal;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
/**
 * Provides signing method for signing a raw transaction with multisig public key.
 */
export declare class TransactionBuilderMultiEd25519 extends TransactionBuilder<SigningFn> {
    private readonly publicKey;
    constructor(signingFunction: SigningFn, publicKey: MultiEd25519PublicKey);
    private signInternal;
    /** Signs a raw transaction and returns a bcs serialized transaction. */
    sign(rawTxn: RawTransaction): Bytes;
}
export {};
//# sourceMappingURL=builder.d.ts.map