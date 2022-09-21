"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$IndexResponse = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$IndexResponse = {
    description: `The struct holding all data returned to the client by the
    index endpoint (i.e., GET "/").`,
    properties: {
        chain_id: {
            type: 'number',
            isRequired: true,
            format: 'uint8',
        },
        epoch: {
            type: 'U64',
            isRequired: true,
        },
        ledger_version: {
            type: 'U64',
            isRequired: true,
        },
        oldest_ledger_version: {
            type: 'U64',
            isRequired: true,
        },
        ledger_timestamp: {
            type: 'U64',
            isRequired: true,
        },
        node_role: {
            type: 'RoleType',
            isRequired: true,
        },
        oldest_block_height: {
            type: 'U64',
            isRequired: true,
        },
        block_height: {
            type: 'U64',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$IndexResponse.js.map