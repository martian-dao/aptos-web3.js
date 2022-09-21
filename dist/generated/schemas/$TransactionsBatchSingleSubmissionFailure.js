"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionsBatchSingleSubmissionFailure = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionsBatchSingleSubmissionFailure = {
    properties: {
        error: {
            type: 'AptosError',
            isRequired: true,
        },
        transaction_index: {
            type: 'number',
            isRequired: true,
            format: 'uint64',
        },
    },
};
//# sourceMappingURL=$TransactionsBatchSingleSubmissionFailure.js.map