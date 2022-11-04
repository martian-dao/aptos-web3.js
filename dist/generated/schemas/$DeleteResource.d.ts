export declare const $DeleteResource: {
    readonly description: "Delete a resource";
    readonly properties: {
        readonly address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly state_key_hash: {
            readonly type: "string";
            readonly description: "State key hash";
            readonly isRequired: true;
        };
        readonly resource: {
            readonly type: "MoveStructTag";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$DeleteResource.d.ts.map