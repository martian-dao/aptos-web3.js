"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$AccountSignature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$AccountSignature = {
    type: 'one-of',
    description: `Account signature scheme

    The account signature scheme allows you to have two types of accounts:

    1. A single Ed25519 key account, one private key
    2. A k-of-n multi-Ed25519 key account, multiple private keys, such that k-of-n must sign a transaction.`,
    contains: [{
            type: 'AccountSignature_Ed25519Signature',
        }, {
            type: 'AccountSignature_MultiEd25519Signature',
        }],
};
//# sourceMappingURL=$AccountSignature.js.map