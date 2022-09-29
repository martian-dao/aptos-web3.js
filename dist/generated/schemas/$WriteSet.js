"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$WriteSet = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$WriteSet = {
    type: 'one-of',
    description: `The associated writeset with a payload`,
    contains: [{
            type: 'WriteSet_ScriptWriteSet',
        }, {
            type: 'WriteSet_DirectWriteSet',
        }],
};
//# sourceMappingURL=$WriteSet.js.map