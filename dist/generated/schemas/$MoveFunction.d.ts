export declare const $MoveFunction: {
    readonly description: "Move function";
    readonly properties: {
        readonly name: {
            readonly type: "IdentifierWrapper";
            readonly isRequired: true;
        };
        readonly visibility: {
            readonly type: "MoveFunctionVisibility";
            readonly isRequired: true;
        };
        readonly is_entry: {
            readonly type: "boolean";
            readonly description: "Whether the function can be called as an entry function directly in a transaction";
            readonly isRequired: true;
        };
        readonly generic_type_params: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveFunctionGenericTypeParam";
            };
            readonly isRequired: true;
        };
        readonly params: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveType";
            };
            readonly isRequired: true;
        };
        readonly return: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveType";
            };
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$MoveFunction.d.ts.map