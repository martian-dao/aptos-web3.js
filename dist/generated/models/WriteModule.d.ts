import type { Address } from './Address';
import type { MoveModuleBytecode } from './MoveModuleBytecode';
/**
 * Write a new module or update an existing one
 */
export declare type WriteModule = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    data: MoveModuleBytecode;
};
//# sourceMappingURL=WriteModule.d.ts.map