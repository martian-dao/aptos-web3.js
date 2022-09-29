"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ModuleBundlePayload = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$ModuleBundlePayload = {
    properties: {
        modules: {
            type: 'array',
            contains: {
                type: 'MoveModuleBytecode',
            },
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$ModuleBundlePayload.js.map