import type { Address } from '../models/Address';
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
     * Get events by creation number
     * Event types are globally identifiable by an account `address` and
     * monotonically increasing `creation_number`, one per event type emitted
     * to the given account. This API returns events corresponding to that
     * that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix, for
     * which events are queried. This refers to the account that events were
     * emitted to, not the account hosting the move module that emits that
     * event type.
     * @param creationNumber Creation number corresponding to the event stream originating
     * from the given account.
     * @param start Starting sequence number of events.
     *
     * If unspecified, by default will retrieve the most recent events
     * @param limit Max number of events to retrieve.
     *
     * If unspecified, defaults to default page size
     * @returns VersionedEvent
     * @throws ApiError
     */
    getEventsByCreationNumber(address: Address, creationNumber: U64, start?: U64, limit?: number): CancelablePromise<Array<VersionedEvent>>;
    /**
     * Get events by event handle
     * This API uses the given account `address`, `eventHandle`, and `fieldName`
     * to build a key that can globally identify an event types. It then uses this
     * key to return events emitted to the given account matching that event type.
     * @param address Hex-encoded 32 byte Aptos account, with or without a `0x` prefix, for
     * which events are queried. This refers to the account that events were
     * emitted to, not the account hosting the move module that emits that
     * event type.
     * @param eventHandle Name of struct to lookup event handle e.g. `0x1::account::Account`
     * @param fieldName Name of field to lookup event handle e.g. `withdraw_events`
     * @param start Starting sequence number of events.
     *
     * If unspecified, by default will retrieve the most recent
     * @param limit Max number of events to retrieve.
     *
     * If unspecified, defaults to default page size
     * @returns VersionedEvent
     * @throws ApiError
     */
    getEventsByEventHandle(address: Address, eventHandle: MoveStructTag, fieldName: IdentifierWrapper, start?: U64, limit?: number): CancelablePromise<Array<VersionedEvent>>;
}
//# sourceMappingURL=EventsService.d.ts.map