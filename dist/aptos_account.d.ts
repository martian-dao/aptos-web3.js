import * as Nacl from 'tweetnacl';
import { Buffer } from 'buffer/';
import { HexString, MaybeHexString } from './hex_string';
import { Types } from './types';
export interface AptosAccountObject {
    address?: string;
    publicKeyHex?: Types.HexEncodedBytes;
    privateKeyHex: Types.HexEncodedBytes;
}
/**
 * Class for creating and managing Aptos account
 */
export declare class AptosAccount {
    /**
     * A private key and public key, associated with the given account
     */
    readonly signingKey: Nacl.SignKeyPair;
    /**
     * Address associated with the given account
     */
    private readonly accountAddress;
    private authKeyCached?;
    static fromAptosAccountObject(obj: AptosAccountObject): AptosAccount;
    /**
     * Creates new account instance. Constructor allows passing in an address,
     * to handle account key rotation, where auth_key != public_key
     * @param privateKeyBytes  Private key from which account key pair will be generated.
     * If not specified, new key pair is going to be created.
     * @param address Account address (e.g. 0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591).
     * If not specified, a new one will be generated from public key
     */
    constructor(privateKeyBytes?: Uint8Array | undefined, address?: MaybeHexString);
    /**
     * This is the key by which Aptos account is referenced.
     * It is the 32-byte of the SHA-3 256 cryptographic hash
     * of the public key(s) concatenated with a signature scheme identifier byte
     * @returns Address associated with the given account
     */
    address(): HexString;
    /**
     * This key enables account owners to rotate their private key(s)
     * associated with the account without changing the address that hosts their account.
     * See here for more info: {@link https://aptos.dev/basics/basics-accounts#single-signer-authentication}
     * @returns Authentication key for the associated account
     */
    authKey(): HexString;
    /**
     * This key is generated with Ed25519 scheme.
     * Public key is used to check a signature of transaction, signed by given account
     * @returns The public key for the associated account
     */
    pubKey(): HexString;
    /**
     * Signs specified `buffer` with account's private key
     * @param buffer A buffer to sign
     * @returns A signature HexString
     */
    signBuffer(buffer: Buffer): HexString;
    /**
     * Signs specified `hexString` with account's private key
     * @param hexString A regular string or HexString to sign
     * @returns A signature HexString
     */
    signHexString(hexString: MaybeHexString): HexString;
    /**
     * Derives account address, public key and private key
     * @returns AptosAccountObject instance.
     * @example An example of the returned AptosAccountObject object
     * ```
     * {
     *    address: "0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591",
     *    publicKeyHex: "0xf56d8524faf79fbc0f48c13aeed3b0ce5dd376b4db93b8130a107c0a5e04ba04",
     *    privateKeyHex: `0x009c9f7c992a06cfafe916f125d8adb7a395fca243e264a8e56a4b3e6accf940
     *      d2b11e9ece3049ce60e3c7b4a1c58aebfa9298e29a30a58a67f1998646135204`
     * }
     * ```
     */
    toPrivateKeyObject(): AptosAccountObject;
}
//# sourceMappingURL=aptos_account.d.ts.map