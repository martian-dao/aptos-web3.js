import { HttpClient, RequestParams } from "./http-client";
export declare class SpecHtml<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;
    constructor(http: HttpClient<SecurityDataType>);
    /**
     * No description
     *
     * @tags general
     * @name GetSpecHtml
     * @summary API document
     * @request GET:/spec.html
     */
    getSpecHtml: (params?: RequestParams) => Promise<import("axios").AxiosResponse<void, any>>;
}
//# sourceMappingURL=SpecHtml.d.ts.map