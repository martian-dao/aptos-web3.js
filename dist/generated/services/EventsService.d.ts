import type { Address } from '../models/Address';
import type { EventKey } from '../models/EventKey';
import type { IdentifierWrapper } from '../models/IdentifierWrapper';
import type { MoveStructTag } from '../models/MoveStructTag';
import type { U64 } from '../models/U64';
import type { VersionedEvent } from '../models/VersionedEvent';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export declare class EventsService {
    readonly httpRequest: BaseHttpRequest;
    constructor(httpRequest: BaseHttpRequest);
    /**
     * Get events by event key
     * This endpoint allows you to get a list of events of a specific type
     * as identified by its event key, which is a globally unique ID.
     * @param eventKey
     * @param start
     * @param limit
     * @returns VersionedEvent
     * @throws ApiError
     */
    getEventsByEventKey(eventKey: EventKey, start?: U64, limit?: number): CancelablePromise<Array<VersionedEvent>>;
    /**
     * Get events by event handle
     * This API extracts event key from the account resource identified
     * by the `event_handle_struct` and `field_name`, then returns
     * events identified by the event key.
     * @param address
     * @param eventHandle
     * @param fieldName
     * @param start
     * @param limit
     * @returns VersionedEvent
     * @throws ApiError
     */
    getEventsByEventHandle(address: Address, eventHandle: MoveStructTag, fieldName: IdentifierWrapper, start?: U64, limit?: number): CancelablePromise<Array<VersionedEvent>>;
}
//# sourceMappingURL=EventsService.d.ts.map