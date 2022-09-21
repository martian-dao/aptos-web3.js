"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$EntryFunctionPayload = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$EntryFunctionPayload = {
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
//# sourceMappingURL=$EntryFunctionPayload.js.map