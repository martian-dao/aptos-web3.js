"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$DeleteResource = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$DeleteResource = {
    description: `Delete a resource`,
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
        resource: {
            type: 'MoveStructTag',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$DeleteResource.js.map