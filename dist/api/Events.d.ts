import { Event, HexEncodedBytes } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";
export declare class Events<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;
    constructor(http: HttpClient<SecurityDataType>);
    /**
     * No description
     *
     * @tags events
     * @name GetEventsByEventKey
     * @summary Get events by event key
     * @request GET:/events/{event_key}
     */
    getEventsByEventKey: (eventKey: HexEncodedBytes, params?: RequestParams) => Promise<import("axios").AxiosResponse<Event[], any>>;
}
//# sourceMappingURL=Events.d.ts.map