"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$DeleteModule = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$DeleteModule = {
    description: `Delete a module`,
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
        module: {
            type: 'MoveModuleId',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$DeleteModule.js.map