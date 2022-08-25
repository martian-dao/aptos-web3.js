import type { HashValue } from './HashValue';
import type { U64 } from './U64';
import type { WriteSetChange } from './WriteSetChange';
export declare type StateCheckpointTransaction = {
    version: U64;
    hash: HashValue;
    state_root_hash: HashValue;
    event_root_hash: HashValue;
    gas_used: U64;
    success: boolean;
    vm_status: string;
    accumulator_root_hash: HashValue;
    changes: Array<WriteSetChange>;
    timestamp: U64;
};
//# sourceMappingURL=StateCheckpointTransaction.d.ts.map