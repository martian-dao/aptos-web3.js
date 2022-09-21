"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionSignature_MultiAgentSignature = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionSignature_MultiAgentSignature = {
    type: 'all-of',
    contains: [{
            properties: {
                type: {
                    type: 'string',
                    isRequired: true,
                },
            },
        }, {
            type: 'MultiAgentSignature',
        }],
};
//# sourceMappingURL=$TransactionSignature_MultiAgentSignature.js.map