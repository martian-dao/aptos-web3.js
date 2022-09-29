"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionsBatchSubmissionResult = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionsBatchSubmissionResult = {
    description: `Batch transaction submission result

    Tells which transactions failed`,
    properties: {
        transaction_failures: {
            type: 'array',
            contains: {
                type: 'TransactionsBatchSingleSubmissionFailure',
            },
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$TransactionsBatchSubmissionResult.js.map