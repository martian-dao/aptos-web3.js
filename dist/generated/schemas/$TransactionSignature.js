"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionSignature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionSignature = {
    type: 'one-of',
    contains: [{
            type: 'TransactionSignature_Ed25519Signature',
        }, {
            type: 'TransactionSignature_MultiEd25519Signature',
        }, {
            type: 'TransactionSignature_MultiAgentSignature',
        }],
};
//# sourceMappingURL=$TransactionSignature.js.map