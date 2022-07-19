import { Deserializer, Serializer } from '../bcs';
export declare class Identifier {
    value: string;
    constructor(value: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): Identifier;
}
//# sourceMappingURL=identifier.d.ts.map