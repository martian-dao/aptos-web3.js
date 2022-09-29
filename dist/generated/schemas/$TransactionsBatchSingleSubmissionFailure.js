"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TransactionsBatchSingleSubmissionFailure = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TransactionsBatchSingleSubmissionFailure = {
    description: `Information telling which batch submission transactions failed`,
    properties: {
        error: {
            type: 'AptosError',
            isRequired: true,
        },
        transaction_index: {
            type: 'number',
            description: `The index of which transaction failed, same as submission order`,
            isRequired: true,
            format: 'uint64',
        },
    },
};
//# sourceMappingURL=$TransactionsBatchSingleSubmissionFailure.js.map