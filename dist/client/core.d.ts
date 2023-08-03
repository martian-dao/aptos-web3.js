import { AptosRequest, AptosResponse } from "./types";
import "./cookieJar";
/**
 * The main function to use when doing an API request.
 * Wraps axios error response with AptosApiError
 *
 * @param options AptosRequest
 * @returns the response or AptosApiError
 */
export declare function aptosRequest<Req, Res>(options: AptosRequest): Promise<AptosResponse<Req, Res>>;
//# sourceMappingURL=core.d.ts.map