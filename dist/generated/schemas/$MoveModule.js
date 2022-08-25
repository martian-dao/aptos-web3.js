"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$MoveModule = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$MoveModule = {
    properties: {
        address: {
            type: 'Address',
            isRequired: true,
        },
        name: {
            type: 'IdentifierWrapper',
            isRequired: true,
        },
        friends: {
            type: 'array',
            contains: {
                type: 'MoveModuleId',
            },
            isRequired: true,
        },
        exposed_functions: {
            type: 'array',
            contains: {
                type: 'MoveFunction',
            },
            isRequired: true,
        },
        structs: {
            type: 'array',
            contains: {
                type: 'MoveStruct',
            },
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$MoveModule.js.map