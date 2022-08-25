"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$DirectWriteSet = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$DirectWriteSet = {
    properties: {
        changes: {
            type: 'array',
            contains: {
                type: 'WriteSetChange',
            },
            isRequired: true,
        },
        events: {
            type: 'array',
            contains: {
                type: 'Event',
            },
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$DirectWriteSet.js.map