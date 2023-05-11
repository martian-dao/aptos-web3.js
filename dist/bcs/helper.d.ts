import { Deserializer } from "./deserializer";
import { Serializer } from "./serializer";
import { AnyNumber, Bytes, Seq, Uint16, Uint32, Uint8 } from "./types";
interface Serializable {
    serialize(serializer: Serializer): void;
}
/**
 * Serializes a vector values that are "Serializable".
 */
export declare function serializeVector<T extends Serializable>(value: Seq<T>, serializer: Serializer): void;
/**
 * Serializes a vector with specified item serialization function.
 * Very dynamic function and bypasses static typechecking.
 */
export declare function serializeVectorWithFunc(value: any[], func: string): Bytes;
/**
 * Deserializes a vector of values.
 */
export declare function deserializeVector(deserializer: Deserializer, cls: any): any[];
export declare function bcsToBytes<T extends Serializable>(value: T): Bytes;
export declare function bcsSerializeUint64(value: AnyNumber): Bytes;
export declare function bcsSerializeU8(value: Uint8): Bytes;
export declare function bcsSerializeU16(value: Uint16): Bytes;
export declare function bcsSerializeU32(value: Uint32): Bytes;
export declare function bcsSerializeU128(value: AnyNumber): Bytes;
export declare function bcsSerializeBool(value: boolean): Bytes;
export declare function bcsSerializeStr(value: string): Bytes;
export declare function bcsSerializeBytes(value: Bytes): Bytes;
export declare function bcsSerializeFixedBytes(value: Bytes): Bytes;
export {};
//# sourceMappingURL=helper.d.ts.map