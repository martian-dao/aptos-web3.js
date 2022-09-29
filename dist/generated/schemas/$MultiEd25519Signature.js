"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$MultiEd25519Signature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$MultiEd25519Signature = {
    description: `A Ed25519 multi-sig signature

    This allows k-of-n signing for a transaction`,
    properties: {
        public_keys: {
            type: 'array',
            contains: {
                type: 'HexEncodedBytes',
            },
            isRequired: true,
        },
        signatures: {
            type: 'array',
            contains: {
                type: 'HexEncodedBytes',
            },
            isRequired: true,
        },
        threshold: {
            type: 'number',
            description: `The number of signatures required for a successful transaction`,
            isRequired: true,
            format: 'uint8',
        },
        bitmap: {
            type: 'HexEncodedBytes',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$MultiEd25519Signature.js.map