import type { EventGuid } from './EventGuid';
import type { MoveType } from './MoveType';
import type { U64 } from './U64';
/**
 * An event from a transaction
 */
export declare type Event = {
    guid: EventGuid;
    sequence_number: U64;
    type: MoveType;
    /**
     * The JSON representation of the event
     */
    data: any;
};
//# sourceMappingURL=Event.d.ts.map