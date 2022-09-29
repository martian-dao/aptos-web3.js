"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$Event = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$Event = {
    description: `An event from a transaction`,
    properties: {
        key: {
            type: 'EventKey',
            isRequired: true,
        },
        guid: {
            type: 'EventGuid',
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
            description: `The JSON representation of the event`,
            properties: {},
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$Event.js.map