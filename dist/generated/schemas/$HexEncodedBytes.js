"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$HexEncodedBytes = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$HexEncodedBytes = {
    type: 'string',
    description: `All bytes (Vec<u8>) data is represented as hex-encoded string prefixed with \`0x\` and fulfilled with
    two hex digits per byte.

    Unlike the \`Address\` type, HexEncodedBytes will not trim any zeros.
    `,
    format: 'hex',
};
//# sourceMappingURL=$HexEncodedBytes.js.map