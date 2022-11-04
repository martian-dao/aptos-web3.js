"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$Transaction = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$Transaction = {
    type: 'one-of',
    description: `Enum of the different types of transactions in Aptos`,
    contains: [{
            type: 'Transaction_PendingTransaction',
        }, {
            type: 'Transaction_UserTransaction',
        }, {
            type: 'Transaction_GenesisTransaction',
        }, {
            type: 'Transaction_BlockMetadataTransaction',
        }, {
            type: 'Transaction_StateCheckpointTransaction',
        }],
};
//# sourceMappingURL=$Transaction.js.map