import * as Nacl from "tweetnacl";
import { Buffer } from "buffer/";
import { HexString, MaybeHexString } from "./hex_string";
import { Types } from "./types";
export interface AptosAccountObject {
    address?: string;
    publicKeyHex?: Types.HexEncodedBytes;
    privateKeyHex: Types.HexEncodedBytes;
}
export declare class AptosAccount {
    readonly signingKey: Nacl.SignKeyPair;
    private readonly accountAddress;
    private authKeyCached?;
    static fromAptosAccountObject(obj: AptosAccountObject): AptosAccount;
    /** This class allows passing in an address, to handle account key rotation, where auth_key != public_key */
    constructor(privateKeyBytes?: Uint8Array | undefined, address?: MaybeHexString);
    /** Returns the address associated with the given account */
    address(): HexString;
    /** Returns the authKey for the associated account
     * See here for more info: https://aptos.dev/basics/basics-accounts#single-signer-authentication */
    authKey(): HexString;
    /** Returns the public key for the associated account */
    pubKey(): HexString;
    signBuffer(buffer: Buffer): HexString;
    signHexString(hexString: MaybeHexString): HexString;
    toPrivateKeyObject(): AptosAccountObject;
}
//# sourceMappingURL=aptos_account.d.ts.map