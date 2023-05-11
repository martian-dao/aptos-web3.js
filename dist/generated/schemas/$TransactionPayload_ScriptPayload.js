"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionPayload_ScriptPayload = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionPayload_ScriptPayload = {
    type: 'all-of',
    contains: [{
            properties: {
                type: {
                    type: 'string',
                    isRequired: true,
                },
            },
        }, {
            type: 'ScriptPayload',
        }],
};
//# sourceMappingURL=$TransactionPayload_ScriptPayload.js.map