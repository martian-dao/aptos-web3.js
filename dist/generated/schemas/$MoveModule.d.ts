export declare const $MoveModule: {
    readonly description: "A Move module";
    readonly properties: {
        readonly address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly name: {
            readonly type: "IdentifierWrapper";
            readonly isRequired: true;
        };
        readonly friends: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveModuleId";
            };
            readonly isRequired: true;
        };
        readonly exposed_functions: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveFunction";
            };
            readonly isRequired: true;
        };
        readonly structs: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveStruct";
            };
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$MoveModule.d.ts.map