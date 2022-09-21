"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$MoveStruct = void 0;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
exports.$MoveStruct = {
    properties: {
        name: {
            type: 'IdentifierWrapper',
            isRequired: true,
        },
        is_native: {
            type: 'boolean',
            isRequired: true,
        },
        abilities: {
            type: 'array',
            contains: {
                type: 'MoveAbility',
            },
            isRequired: true,
        },
        generic_type_params: {
            type: 'array',
            contains: {
                type: 'MoveStructGenericTypeParam',
            },
            isRequired: true,
        },
        fields: {
            type: 'array',
            contains: {
                type: 'MoveStructField',
            },
            isRequired: true,
        },
    },
};
//# sourceMappingURL=$MoveStruct.js.map