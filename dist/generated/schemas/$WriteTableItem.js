"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$WriteTableItem = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$WriteTableItem = {
    description: `Change set to write a table item`,
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
        value: {
            type: 'HexEncodedBytes',
            isRequired: true,
        },
        data: {
            type: 'DecodedTableData',
        },
    },
};
//# sourceMappingURL=$WriteTableItem.js.map