import type { IdentifierWrapper } from './IdentifierWrapper';
import type { MoveFunctionGenericTypeParam } from './MoveFunctionGenericTypeParam';
import type { MoveFunctionVisibility } from './MoveFunctionVisibility';
import type { MoveType } from './MoveType';
export declare type MoveFunction = {
    name: IdentifierWrapper;
    visibility: MoveFunctionVisibility;
    is_entry: boolean;
    generic_type_params: Array<MoveFunctionGenericTypeParam>;
    params: Array<MoveType>;
    return: Array<MoveType>;
};
//# sourceMappingURL=MoveFunction.d.ts.map