export declare const $WriteTableItem: {
    readonly description: "Change set to write a table item";
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
        readonly value: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
        readonly data: {
            readonly type: "DecodedTableData";
        };
    };
};
//# sourceMappingURL=$WriteTableItem.d.ts.map