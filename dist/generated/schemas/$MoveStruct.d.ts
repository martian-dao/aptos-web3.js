export declare const $MoveStruct: {
    readonly properties: {
        readonly name: {
            readonly type: "IdentifierWrapper";
            readonly isRequired: true;
        };
        readonly is_native: {
            readonly type: "boolean";
            readonly isRequired: true;
        };
        readonly abilities: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveAbility";
            };
            readonly isRequired: true;
        };
        readonly generic_type_params: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveStructGenericTypeParam";
            };
            readonly isRequired: true;
        };
        readonly fields: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveStructField";
            };
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$MoveStruct.d.ts.map