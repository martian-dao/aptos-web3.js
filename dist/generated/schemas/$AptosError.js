"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$AptosError = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$AptosError = {
    description: `This is the generic struct we use for all API errors, it contains a string
    message and an Aptos API specific error code.`,
    properties: {
        message: {
            type: 'string',
            description: `A message describing the error`,
            isRequired: true,
        },
        error_code: {
            type: 'AptosErrorCode',
            isRequired: true,
        },
        vm_error_code: {
            type: 'number',
            description: `A code providing VM error details when submitting transactions to the VM`,
            format: 'uint64',
        },
    },
};
//# sourceMappingURL=$AptosError.js.map