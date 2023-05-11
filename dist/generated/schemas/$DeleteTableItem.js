"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$DeleteTableItem = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$DeleteTableItem = {
    description: `Delete a table item`,
    properties: {
        state_key_hash: {
            type: 'string',
            isRequired: true,
        },
        handle: {
            type: 'HexEncodedBytes',
            isRequired: true,
        },
        key: {
            type: 'HexEncodedBytes',
            isRequired: true,
        },
        data: {
            type: 'DeletedTableData',
        },
    },
};
//# sourceMappingURL=$DeleteTableItem.js.map