import type { DeletedTableData } from './DeletedTableData';
import type { HexEncodedBytes } from './HexEncodedBytes';
/**
 * Delete a table item
 */
export declare type DeleteTableItem = {
    state_key_hash: string;
    handle: HexEncodedBytes;
    key: HexEncodedBytes;
    data?: DeletedTableData;
};
//# sourceMappingURL=DeleteTableItem.d.ts.map