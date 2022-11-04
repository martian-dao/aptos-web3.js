export declare const $WriteModule: {
    readonly description: "Write a new module or update an existing one";
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
            readonly type: "MoveModuleBytecode";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$WriteModule.d.ts.map