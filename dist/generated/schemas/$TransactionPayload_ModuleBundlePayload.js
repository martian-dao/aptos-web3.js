"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionPayload_ModuleBundlePayload = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionPayload_ModuleBundlePayload = {
    type: 'all-of',
    contains: [{
            properties: {
                type: {
                    type: 'string',
                    isRequired: true,
                },
            },
        }, {
            type: 'ModuleBundlePayload',
        }],
};
//# sourceMappingURL=$TransactionPayload_ModuleBundlePayload.js.map