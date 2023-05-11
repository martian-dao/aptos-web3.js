"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionPayload_MultisigPayload = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionPayload_MultisigPayload = {
    type: 'all-of',
    contains: [{
            properties: {
                type: {
                    type: 'string',
                    isRequired: true,
                },
            },
        }, {
            type: 'MultisigPayload',
        }],
};
//# sourceMappingURL=$TransactionPayload_MultisigPayload.js.map