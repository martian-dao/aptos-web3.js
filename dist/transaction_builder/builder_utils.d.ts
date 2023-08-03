import { TypeTag, TransactionArgument } from "../aptos_types";
import { Serializer } from "../bcs";
export declare function ensureBoolean(val: boolean | string): boolean;
export declare function ensureNumber(val: number | string): number;
export declare function ensureBigInt(val: number | bigint | string): bigint;
export declare function serializeArg(argVal: any, argType: TypeTag, serializer: Serializer): void;
export declare function argToTransactionArgument(argVal: any, argType: TypeTag): TransactionArgument;
//# sourceMappingURL=builder_utils.d.ts.map