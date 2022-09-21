"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$MultiEd25519Signature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$MultiEd25519Signature = {
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