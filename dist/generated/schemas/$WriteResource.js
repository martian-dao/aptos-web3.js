"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$WriteResource = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$WriteResource = {
    description: `Write a resource or update an existing one`,
    properties: {
        address: {
            type: 'Address',
            isRequired: true,
        },
        state_key_hash: {
            type: 'string',
            description: `State key hash`,
            isRequired: true,
        },
        data: {
            type: 'MoveResource',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$WriteResource.js.map