"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionSignature_Ed25519Signature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionSignature_Ed25519Signature = {
    type: 'all-of',
    contains: [{
            properties: {
                type: {
                    type: 'string',
                    isRequired: true,
                },
            },
        }, {
            type: 'Ed25519Signature',
        }],
};
//# sourceMappingURL=$TransactionSignature_Ed25519Signature.js.map