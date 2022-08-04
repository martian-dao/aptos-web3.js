import { TableItemRequest } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";
export declare class Tables<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;
    constructor(http: HttpClient<SecurityDataType>);
    /**
     * @description Gets a table item for a table identified by the handle and the key for the item. Key and value types need to be passed in to help with key serialization and value deserialization.
     *
     * @tags state, table
     * @name GetTableItem
     * @summary Get table item by handle and key.
     * @request POST:/tables/{table_handle}/item
     */
    getTableItem: (tableHandle: string, data: TableItemRequest, params?: RequestParams) => Promise<import("axios").AxiosResponse<object, any>>;
}
//# sourceMappingURL=Tables.d.ts.map