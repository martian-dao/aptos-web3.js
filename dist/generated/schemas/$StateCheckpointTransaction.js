"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$StateCheckpointTransaction = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$StateCheckpointTransaction = {
    properties: {
        version: {
            type: 'U64',
            isRequired: true,
        },
        hash: {
            type: 'HashValue',
            isRequired: true,
        },
        state_change_hash: {
            type: 'HashValue',
            isRequired: true,
        },
        event_root_hash: {
            type: 'HashValue',
            isRequired: true,
        },
        state_checkpoint_hash: {
            type: 'HashValue',
        },
        gas_used: {
            type: 'U64',
            isRequired: true,
        },
        success: {
            type: 'boolean',
            isRequired: true,
        },
        vm_status: {
            type: 'string',
            isRequired: true,
        },
        accumulator_root_hash: {
            type: 'HashValue',
            isRequired: true,
        },
        changes: {
            type: 'array',
            contains: {
                type: 'WriteSetChange',
            },
            isRequired: true,
        },
        timestamp: {
            type: 'U64',
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$StateCheckpointTransaction.js.map