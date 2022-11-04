"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$MoveValue = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$MoveValue = {
    type: 'any-of',
    description: `An enum of the possible Move value types`,
    contains: [{
            type: 'number',
            format: 'uint8',
        }, {
            type: 'U64',
        }, {
            type: 'U128',
        }, {
            type: 'boolean',
        }, {
            type: 'Address',
        }, {
            type: 'array',
            contains: {
                type: 'MoveValue',
            },
        }, {
            type: 'HexEncodedBytes',
        }, {
            type: 'MoveStructValue',
        }, {
            type: 'string',
        }],
};
//# sourceMappingURL=$MoveValue.js.map