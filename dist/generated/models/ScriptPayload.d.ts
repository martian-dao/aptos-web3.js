import type { MoveScriptBytecode } from './MoveScriptBytecode';
import type { MoveType } from './MoveType';
/**
 * Payload which runs a script that can run multiple functions
 */
export declare type ScriptPayload = {
    code: MoveScriptBytecode;
    /**
     * Type arguments of the function
     */
    type_arguments: Array<MoveType>;
    /**
     * Arguments of the function
     */
    arguments: Array<any>;
};
//# sourceMappingURL=ScriptPayload.d.ts.map