"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$AccountSignature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$AccountSignature = {
    type: 'one-of',
    contains: [{
            type: 'AccountSignature_Ed25519Signature',
        }, {
            type: 'AccountSignature_MultiEd25519Signature',
        }],
};
//# sourceMappingURL=$AccountSignature.js.map