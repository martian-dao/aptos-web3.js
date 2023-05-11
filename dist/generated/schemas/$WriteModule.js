"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$WriteModule = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$WriteModule = {
    description: `Write a new module or update an existing one`,
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
            type: 'MoveModuleBytecode',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$WriteModule.js.map