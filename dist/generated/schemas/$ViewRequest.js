"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ViewRequest = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$ViewRequest = {
    description: `View request for the Move View Function API`,
    properties: {
        function: {
            type: 'EntryFunctionId',
            isRequired: true,
        },
        type_arguments: {
            type: 'array',
            contains: {
                type: 'MoveType',
            },
            isRequired: true,
        },
        arguments: {
            type: 'array',
            contains: {
                properties: {},
            },
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$ViewRequest.js.map