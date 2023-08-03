import type { EntryFunctionId } from './EntryFunctionId';
import type { MoveType } from './MoveType';
/**
 * Payload which runs a single entry function
 */
export declare type EntryFunctionPayload = {
    function: EntryFunctionId;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};
//# sourceMappingURL=EntryFunctionPayload.d.ts.map