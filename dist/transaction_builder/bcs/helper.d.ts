import { Deserializer } from './deserializer';
import { Serializer } from './serializer';
import { AnyNumber, Bytes, Seq } from './types';
interface Serializable {
    serialize(serializer: Serializer): void;
}
/**
 * Serializes a vector values that are "Serializable".
 */
export declare function serializeVector<T extends Serializable>(value: Seq<T>, serializer: Serializer): void;
/**
 * Deserializes a vector of values.
 */
export declare function deserializeVector(deserializer: Deserializer, cls: any): any[];
export declare function bcsToBytes<T extends Serializable>(value: T): Bytes;
export declare function bcsSerializeUint64(value: AnyNumber): Bytes;
export declare function bcsSerializeStr(value: string): Bytes;
export {};
//# sourceMappingURL=helper.d.ts.map