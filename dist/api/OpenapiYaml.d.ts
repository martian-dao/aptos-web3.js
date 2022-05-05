import { HttpClient, RequestParams } from "./http-client";
export declare class OpenapiYaml<SecurityDataType = unknown> {
    http: HttpClient<SecurityDataType>;
    constructor(http: HttpClient<SecurityDataType>);
    /**
     * No description
     *
     * @tags general
     * @name GetSpecYaml
     * @summary OpenAPI specification
     * @request GET:/openapi.yaml
     */
    getSpecYaml: (params?: RequestParams) => Promise<import("axios").AxiosResponse<void, any>>;
}
//# sourceMappingURL=OpenapiYaml.d.ts.map