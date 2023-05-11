export declare const $TransactionPayload_MultisigPayload: {
    readonly type: "all-of";
    readonly contains: readonly [{
        readonly properties: {
            readonly type: {
                readonly type: "string";
                readonly isRequired: true;
            };
        };
    }, {
        readonly type: "MultisigPayload";
    }];
};
//# sourceMappingURL=$TransactionPayload_MultisigPayload.d.ts.map