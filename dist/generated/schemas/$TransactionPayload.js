"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionPayload = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionPayload = {
    type: 'one-of',
    description: `An enum of the possible transaction payloads`,
    contains: [{
            type: 'TransactionPayload_EntryFunctionPayload',
        }, {
            type: 'TransactionPayload_ScriptPayload',
        }, {
            type: 'TransactionPayload_ModuleBundlePayload',
        }],
};
//# sourceMappingURL=$TransactionPayload.js.map