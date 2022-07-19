import { Deserializer, Seq, Serializer } from '../bcs';
import { AccountAddress } from './account_address';
import { Identifier } from './identifier';
export declare abstract class TypeTag {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeTag;
}
export declare class TypeTagBool extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagBool;
}
export declare class TypeTagU8 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU8;
}
export declare class TypeTagU64 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU64;
}
export declare class TypeTagU128 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU128;
}
export declare class TypeTagAddress extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagAddress;
}
export declare class TypeTagSigner extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagSigner;
}
export declare class TypeTagVector extends TypeTag {
    readonly value: TypeTag;
    constructor(value: TypeTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagVector;
}
export declare class TypeTagStruct extends TypeTag {
    readonly value: StructTag;
    constructor(value: StructTag);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TypeTagStruct;
}
export declare class StructTag {
    readonly address: AccountAddress;
    readonly module_name: Identifier;
    readonly name: Identifier;
    readonly type_args: Seq<TypeTag>;
    constructor(address: AccountAddress, module_name: Identifier, name: Identifier, type_args: Seq<TypeTag>);
    /**
     * Converts a string literal to a StructTag
     * @param structTag String literal in format "AcountAddress::ModuleName::ResourceName",
     *   e.g. "0x01::TestCoin::TestCoin"
     * @returns
     */
    static fromString(structTag: string): StructTag;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): StructTag;
}
//# sourceMappingURL=type_tag.d.ts.map