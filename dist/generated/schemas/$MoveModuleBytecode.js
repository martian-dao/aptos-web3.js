"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$MoveModuleBytecode = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$MoveModuleBytecode = {
    description: `Move module bytecode along with it's ABI`,
    properties: {
        bytecode: {
            type: 'HexEncodedBytes',
            isRequired: true,
        },
        abi: {
            type: 'MoveModule',
        },
    },
};
//# sourceMappingURL=$MoveModuleBytecode.js.map