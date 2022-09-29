"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$AccountData = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$AccountData = {
    description: `Account data

    A simplified version of the onchain Account resource`,
    properties: {
        sequence_number: {
            type: 'U64',
            isRequired: true,
        },
        authentication_key: {
            type: 'HexEncodedBytes',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$AccountData.js.map