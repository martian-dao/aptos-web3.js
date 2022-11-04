"use strict";
// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotationProofChallenge = void 0;
class RotationProofChallenge {
    constructor(accountAddress, moduleName, structName, sequenceNumber, originator, currentAuthKey, newPublicKey) {
        this.accountAddress = accountAddress;
        this.moduleName = moduleName;
        this.structName = structName;
        this.sequenceNumber = sequenceNumber;
        this.originator = originator;
        this.currentAuthKey = currentAuthKey;
        this.newPublicKey = newPublicKey;
    }
    serialize(serializer) {
        this.accountAddress.serialize(serializer);
        serializer.serializeStr(this.moduleName);
        serializer.serializeStr(this.structName);
        serializer.serializeU64(this.sequenceNumber);
        this.originator.serialize(serializer);
        this.currentAuthKey.serialize(serializer);
        serializer.serializeBytes(this.newPublicKey);
    }
}
exports.RotationProofChallenge = RotationProofChallenge;
//# sourceMappingURL=rotation_proof_challenge.js.map