export declare const $DeleteModule: {
    readonly description: "Delete a module";
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
        readonly module: {
            readonly type: "MoveModuleId";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$DeleteModule.d.ts.map