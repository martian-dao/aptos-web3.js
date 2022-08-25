"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$VersionedEvent = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$VersionedEvent = {
    properties: {
        version: {
            type: 'U64',
            isRequired: true,
        },
        key: {
            type: 'EventKey',
            isRequired: true,
        },
        sequence_number: {
            type: 'U64',
            isRequired: true,
        },
        type: {
            type: 'MoveType',
            isRequired: true,
        },
        data: {
            properties: {},
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$VersionedEvent.js.map