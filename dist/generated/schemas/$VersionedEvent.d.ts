export declare const $VersionedEvent: {
    readonly properties: {
        readonly version: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly key: {
            readonly type: "EventKey";
            readonly isRequired: true;
        };
        readonly sequence_number: {
            readonly type: "U64";
            readonly isRequired: true;
        };
        readonly type: {
            readonly type: "MoveType";
            readonly isRequired: true;
        };
        readonly data: {
            readonly properties: {};
            readonly isRequired: true;
        };
    };
};
//# sourceMappingURL=$VersionedEvent.d.ts.map