import type { Address } from './Address';
import type { MoveResource } from './MoveResource';
/**
 * Write a resource or update an existing one
 */
export declare type WriteResource = {
    address: Address;
    /**
     * State key hash
     */
    state_key_hash: string;
    data: MoveResource;
};
//# sourceMappingURL=WriteResource.d.ts.map