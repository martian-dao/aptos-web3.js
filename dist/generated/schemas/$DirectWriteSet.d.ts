export declare const $DirectWriteSet: {
    readonly properties: {
        readonly changes: {
            readonly type: "array";
            readonly contains: {
                readonly type: "WriteSetChange";
            };
            readonly isRequired: true;
        };
        readonly events: {
            readonly type: "array";
            readonly contains: {
                readonly type: "Event";
            };
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$DirectWriteSet.d.ts.map