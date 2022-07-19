import { HexString } from '../../hex_string';
import { Bytes } from '../bcs';
import { MultiEd25519PublicKey } from './multi_ed25519';
/**
 * Each account stores an authentication key. Authentication key enables account owners to rotate
 * their private key(s) associated with the account without changing the address that hosts their account.
 * @see {@link * https://aptos.dev/basics/basics-accounts | Account Basics}
 *
 * Account addresses can be derived from AuthenticationKey
 */
export declare class AuthenticationKey {
    static readonly LENGTH: number;
    static readonly MULTI_ED25519_SCHEME: number;
    readonly bytes: Bytes;
    constructor(bytes: Bytes);
    /**
     * Converts a K-of-N MultiEd25519PublicKey to AuthenticationKey with:
     * `auth_key = sha3-256(p_1 | … | p_n | K | 0x01)`. `K` represents the K-of-N required for
     * authenticating the transaction. `0x01` is the 1-byte scheme for multisig.
     */
    static fromMultiEd25519PublicKey(publicKey: MultiEd25519PublicKey): AuthenticationKey;
    /**
     * Derives an account address from AuthenticationKey. Since current AccountAddress is 32 bytes,
     * AuthenticationKey bytes are directly translated to AccountAddress.
     */
    derivedAddress(): HexString;
}
//# sourceMappingURL=authentication_key.d.ts.map