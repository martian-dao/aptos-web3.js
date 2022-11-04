"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$TableItemRequest = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$TableItemRequest = {
    description: `Table Item request for the GetTableItem API`,
    properties: {
        key_type: {
            type: 'MoveType',
            isRequired: true,
        },
        value_type: {
            type: 'MoveType',
            isRequired: true,
        },
        key: {
            description: `The value of the table item's key`,
            properties: {},
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$TableItemRequest.js.map