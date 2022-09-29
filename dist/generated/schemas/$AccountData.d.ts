export declare const $AccountData: {
    readonly description: "Account data\n\n    A simplified version of the onchain Account resource";
    readonly properties: {
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly authentication_key: {
            readonly type: "HexEncodedBytes";
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$AccountData.d.ts.map