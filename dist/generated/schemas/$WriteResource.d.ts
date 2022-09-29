export declare const $WriteResource: {
    readonly description: "Write a resource or update an existing one";
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
        readonly data: {
            readonly type: "MoveResource";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$WriteResource.d.ts.map