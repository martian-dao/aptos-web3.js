"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$U128 = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$U128 = {
    type: 'string',
    description: `A string containing a 128-bit unsigned integer.

    We represent u128 values as a string to ensure compatability with languages such
    as JavaScript that do not parse u64s in JSON natively.
    `,
    format: 'uint64',
};
//# sourceMappingURL=$U128.js.map