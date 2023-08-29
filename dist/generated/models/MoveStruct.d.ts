import type { IdentifierWrapper } from './IdentifierWrapper';
import type { MoveAbility } from './MoveAbility';
import type { MoveStructField } from './MoveStructField';
import type { MoveStructGenericTypeParam } from './MoveStructGenericTypeParam';
/**
 * A move struct
 */
export declare type MoveStruct = {
    name: IdentifierWrapper;
    /**
     * Whether the struct is a native struct of Move
     */
    is_native: boolean;
    /**
     * Abilities associated with the struct
     */
    abilities: Array<MoveAbility>;
    /**
     * Generic types associated with the struct
     */
    generic_type_params: Array<MoveStructGenericTypeParam>;
    /**
     * Fields associated with the struct
     */
    fields: Array<MoveStructField>;
};
//# sourceMappingURL=MoveStruct.d.ts.map