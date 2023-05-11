"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$MultisigPayload = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$MultisigPayload = {
    description: `A multisig transaction that allows an owner of a multisig account to execute a pre-approved
    transaction as the multisig account.`,
    properties: {
        multisig_address: {
            type: 'Address',
            isRequired: true,
        },
        transaction_payload: {
            type: 'MultisigTransactionPayload',
        },
    },
};
//# sourceMappingURL=$MultisigPayload.js.map