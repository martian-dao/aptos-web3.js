import { AnyNumber } from "../bcs";
import { MaybeHexString } from "./hex_string";
export declare function paginateWithCursor<T>(apiFunction: (address: string, ledgerVersion?: string | undefined, start?: string | undefined, limit?: number | undefined) => Promise<T[]>, accountAddress: MaybeHexString, limitPerRequest: number, query?: {
    ledgerVersion?: AnyNumber;
}): Promise<T[]>;
//# sourceMappingURL=pagination_helpers.d.ts.map