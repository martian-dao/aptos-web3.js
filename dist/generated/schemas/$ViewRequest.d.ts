export declare const $ViewRequest: {
    readonly description: "View request for the Move View Function API";
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
//# sourceMappingURL=$ViewRequest.d.ts.map