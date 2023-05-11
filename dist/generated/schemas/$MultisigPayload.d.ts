export declare const $MultisigPayload: {
    readonly description: "A multisig transaction that allows an owner of a multisig account to execute a pre-approved\n    transaction as the multisig account.";
    readonly properties: {
        readonly multisig_address: {
            readonly type: "Address";
            readonly isRequired: true;
        };
        readonly transaction_payload: {
            readonly type: "MultisigTransactionPayload";
        };
    };
};
//# sourceMappingURL=$MultisigPayload.d.ts.map