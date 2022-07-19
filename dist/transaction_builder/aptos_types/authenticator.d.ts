import { Serializer, Deserializer, Seq } from '../bcs';
import { AccountAddress } from './account_address';
import { Ed25519PublicKey, Ed25519Signature } from './ed25519';
import { MultiEd25519PublicKey, MultiEd25519Signature } from './multi_ed25519';
export declare abstract class TransactionAuthenticator {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TransactionAuthenticator;
}
export declare class TransactionAuthenticatorEd25519 extends TransactionAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    /**
     * An authenticator for single signature.
     *
     * @param public_key Client's public key.
     * @param signature Signature of a raw transaction.
     * @see {@link https://aptos.dev/guides/creating-a-signed-transaction/ | Creating a Signed Transaction}
     * for details about generating a signature.
     */
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorEd25519;
}
export declare class TransactionAuthenticatorMultiEd25519 extends TransactionAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    /**
     * An authenticator for multiple signatures.
     *
     * @param public_key
     * @param signature
     *
     */
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiEd25519;
}
export declare class TransactionAuthenticatorMultiAgent extends TransactionAuthenticator {
    readonly sender: AccountAuthenticator;
    readonly secondary_signer_addresses: Seq<AccountAddress>;
    readonly secondary_signers: Seq<AccountAuthenticator>;
    constructor(sender: AccountAuthenticator, secondary_signer_addresses: Seq<AccountAddress>, secondary_signers: Seq<AccountAuthenticator>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionAuthenticatorMultiAgent;
}
export declare abstract class AccountAuthenticator {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): AccountAuthenticator;
}
export declare class AccountAuthenticatorEd25519 extends AccountAuthenticator {
    readonly public_key: Ed25519PublicKey;
    readonly signature: Ed25519Signature;
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorEd25519;
}
export declare class AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
    readonly public_key: MultiEd25519PublicKey;
    readonly signature: MultiEd25519Signature;
    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): AccountAuthenticatorMultiEd25519;
}
//# sourceMappingURL=authenticator.d.ts.map