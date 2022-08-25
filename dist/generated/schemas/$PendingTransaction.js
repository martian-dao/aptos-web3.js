"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$PendingTransaction = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$PendingTransaction = {
    properties: {
        hash: {
            type: 'HashValue',
            isRequired: true,
        },
        sender: {
            type: 'Address',
            isRequired: true,
        },
        sequence_number: {
            type: 'U64',
            isRequired: true,
        },
        max_gas_amount: {
            type: 'U64',
            isRequired: true,
        },
        gas_unit_price: {
            type: 'U64',
            isRequired: true,
        },
        expiration_timestamp_secs: {
            type: 'U64',
            isRequired: true,
        },
        payload: {
            type: 'TransactionPayload',
            isRequired: true,
        },
        signature: {
            type: 'TransactionSignature',
        },
    },
};
//# sourceMappingURL=$PendingTransaction.js.map