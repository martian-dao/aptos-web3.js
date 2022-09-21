"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
class EventsService {
    constructor(httpRequest) {
        this.httpRequest = httpRequest;
    }
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
    getEventsByEventKey(eventKey, start, limit) {
        return this.httpRequest.request({
            method: 'GET',
            url: '/events/{event_key}',
            path: {
                'event_key': eventKey,
            },
            query: {
                'start': start,
                'limit': limit,
            },
        });
    }
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
    getEventsByEventHandle(address, eventHandle, fieldName, start, limit) {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/{address}/events/{event_handle}/{field_name}',
            path: {
                'address': address,
                'event_handle': eventHandle,
                'field_name': fieldName,
            },
            query: {
                'start': start,
                'limit': limit,
            },
        });
    }
}
exports.EventsService = EventsService;
//# sourceMappingURL=EventsService.js.map