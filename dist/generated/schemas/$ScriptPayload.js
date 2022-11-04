"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ScriptPayload = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$ScriptPayload = {
    description: `Payload which runs a script that can run multiple functions`,
    properties: {
        code: {
            type: 'MoveScriptBytecode',
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
//# sourceMappingURL=$ScriptPayload.js.map