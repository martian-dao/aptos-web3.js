import { Serializer } from "../bcs";
import { AccountAddress } from "./account_address";
export declare class RotationProofChallenge {
    readonly accountAddress: AccountAddress;
    readonly moduleName: string;
    readonly structName: string;
    readonly sequenceNumber: number | bigint;
    readonly originator: AccountAddress;
    readonly currentAuthKey: AccountAddress;
    readonly newPublicKey: Uint8Array;
    constructor(accountAddress: AccountAddress, moduleName: string, structName: string, sequenceNumber: number | bigint, originator: AccountAddress, currentAuthKey: AccountAddress, newPublicKey: Uint8Array);
    serialize(serializer: Serializer): void;
}
//# sourceMappingURL=rotation_proof_challenge.d.ts.map