"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$AccountSignature_MultiEd25519Signature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$AccountSignature_MultiEd25519Signature = {
    type: 'all-of',
    contains: [{
            properties: {
                type: {
                    type: 'string',
                    isRequired: true,
                },
            },
        }, {
            type: 'MultiEd25519Signature',
        }],
};
//# sourceMappingURL=$AccountSignature_MultiEd25519Signature.js.map