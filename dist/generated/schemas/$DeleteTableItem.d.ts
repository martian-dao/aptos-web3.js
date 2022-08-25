export declare const $DeleteTableItem: {
    readonly properties: {
        readonly state_key_hash: {
            readonly type: "string";
            readonly isRequired: true;
        };
        readonly handle: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly key: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly data: {
            readonly type: "DeletedTableData";
        };
    };
};
//# sourceMappingURL=$DeleteTableItem.d.ts.map