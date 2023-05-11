import { AccountAddress } from "./account_address";
import { Deserializer, Seq, Serializer } from "../bcs";
import { Identifier } from "./identifier";
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
export declare class TypeTagU16 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU16;
}
export declare class TypeTagU32 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU32;
}
export declare class TypeTagU64 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU64;
}
export declare class TypeTagU128 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU128;
}
export declare class TypeTagU256 extends TypeTag {
    serialize(serializer: Serializer): void;
    static load(_deserializer: Deserializer): TypeTagU256;
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
    isStringTypeTag(): boolean;
}
export declare class StructTag {
    readonly address: AccountAddress;
    readonly module_name: Identifier;
    readonly name: Identifier;
    readonly type_args: Seq<TypeTag>;
    constructor(address: AccountAddress, module_name: Identifier, name: Identifier, type_args: Seq<TypeTag>);
    /**
     * Converts a string literal to a StructTag
     * @param structTag String literal in format "AcountAddress::module_name::ResourceName",
     *   e.g. "0x1::aptos_coin::AptosCoin"
     * @returns
     */
    static fromString(structTag: string): StructTag;
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): StructTag;
}
export declare const stringStructTag: StructTag;
/**
 * Parser to parse a type tag string
 */
export declare class TypeTagParser {
    private readonly tokens;
    private readonly typeTags;
    constructor(tagStr: string, typeTags?: string[]);
    private consume;
    private parseCommaList;
    parseTypeTag(): TypeTag;
}
export declare class TypeTagParserError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=type_tag.d.ts.map