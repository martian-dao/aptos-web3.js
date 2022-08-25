"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$Event = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$Event = {
    properties: {
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
//# sourceMappingURL=$Event.js.map