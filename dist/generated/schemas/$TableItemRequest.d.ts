export declare const $TableItemRequest: {
    readonly description: "Table Item request for the GetTableItem API";
    readonly properties: {
        readonly key_type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
        readonly value_type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
        readonly key: {
            readonly description: "The value of the table item's key";
            readonly properties: {};
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$TableItemRequest.d.ts.map