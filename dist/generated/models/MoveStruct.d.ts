import type { IdentifierWrapper } from './IdentifierWrapper';
import type { MoveAbility } from './MoveAbility';
import type { MoveStructField } from './MoveStructField';
import type { MoveStructGenericTypeParam } from './MoveStructGenericTypeParam';
export declare type MoveStruct = {
    name: IdentifierWrapper;
    is_native: boolean;
    abilities: Array<MoveAbility>;
    generic_type_params: Array<MoveStructGenericTypeParam>;
    fields: Array<MoveStructField>;
};
//# sourceMappingURL=MoveStruct.d.ts.map