import { Deserializer, Serializer, Bytes, Seq } from "../bcs";
import { ModuleId } from "./transaction";
import { TypeTag } from "./type_tag";
export declare class TypeArgumentABI {
    readonly name: string;
    /**
     * Constructs a TypeArgumentABI instance.
     * @param name
     */
    constructor(name: string);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeArgumentABI;
}
export declare class ArgumentABI {
    readonly name: string;
    readonly type_tag: TypeTag;
    /**
     * Constructs an ArgumentABI instance.
     * @param name
     * @param type_tag
     */
    constructor(name: string, type_tag: TypeTag);
    serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): TypeArgumentABI;
}
export declare abstract class ScriptABI {
    abstract serialize(serializer: Serializer): void;
    static deserialize(deserializer: Deserializer): ScriptABI;
}
export declare class TransactionScriptABI extends ScriptABI {
    readonly name: string;
    readonly doc: string;
    readonly code: Bytes;
    readonly ty_args: Seq<TypeArgumentABI>;
    readonly args: Seq<ArgumentABI>;
    /**
     * Constructs a TransactionScriptABI instance.
     * @param name Entry function name
     * @param doc
     * @param code
     * @param ty_args
     * @param args
     */
    constructor(name: string, doc: string, code: Bytes, ty_args: Seq<TypeArgumentABI>, args: Seq<ArgumentABI>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): TransactionScriptABI;
}
export declare class EntryFunctionABI extends ScriptABI {
    readonly name: string;
    readonly module_name: ModuleId;
    readonly doc: string;
    readonly ty_args: Seq<TypeArgumentABI>;
    readonly args: Seq<ArgumentABI>;
    /**
     * Constructs a EntryFunctionABI instance
     * @param name
     * @param module_name Fully qualified module id
     * @param doc
     * @param ty_args
     * @param args
     */
    constructor(name: string, module_name: ModuleId, doc: string, ty_args: Seq<TypeArgumentABI>, args: Seq<ArgumentABI>);
    serialize(serializer: Serializer): void;
    static load(deserializer: Deserializer): EntryFunctionABI;
}
//# sourceMappingURL=abi.d.ts.map