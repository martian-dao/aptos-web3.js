export declare const $EntryFunctionPayload: {
    readonly properties: {
        readonly function: {
            readonly type: "EntryFunctionId";
            readonly isRequired: true;
        };
        readonly type_arguments: {
            readonly type: "array";
            readonly contains: {
                readonly type: "MoveType";
            };
            readonly isRequired: true;
        };
        readonly arguments: {
            readonly type: "array";
            readonly contains: {
                readonly properties: {};
            };
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$EntryFunctionPayload.d.ts.map