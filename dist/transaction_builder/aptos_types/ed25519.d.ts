import { Bytes, Deserializer, Serializer } from '../bcs';
export declare class Ed25519PublicKey {
    static readonly LENGTH: number;
    readonly value: Bytes;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519PublicKey;
}
export declare class Ed25519Signature {
    readonly value: Bytes;
    static readonly LENGTH = 64;
    constructor(value: Bytes);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Ed25519Signature;
}
//# sourceMappingURL=ed25519.d.ts.map