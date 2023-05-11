"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$Ed25519Signature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$Ed25519Signature = {
    description: `A single Ed25519 signature`,
    properties: {
        public_key: {
            type: 'HexEncodedBytes',
            isRequired: true,
        },
        signature: {
            type: 'HexEncodedBytes',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$Ed25519Signature.js.map