import { FaucetClient } from "../../plugins/faucet_client";
import { CustomEndpoints } from "../../utils/api-endpoints";
export declare const NODE_URL: string;
export declare const FAUCET_URL: string;
export declare const API_TOKEN: string;
export declare const FAUCET_AUTH_TOKEN: string;
export declare const PROVIDER_LOCAL_NETWORK_CONFIG: CustomEndpoints;
export declare const ANS_OWNER_ADDRESS = "0x585fc9f0f0c54183b039ffc770ca282ebd87307916c215a3e692f2f8e4305e82";
export declare const ANS_OWNER_PK = "0x37368b46ce665362562c6d1d4ec01a08c8644c488690df5a17e13ba163e20221";
/**
 * Returns an instance of a FaucetClient with NODE_URL and FAUCET_URL from the
 * environment. If the FAUCET_AUTH_TOKEN environment variable is set, it will
 * pass that along in the header in the format the faucet expects.
 */
export declare function getFaucetClient(): FaucetClient;
export declare function getTransaction(): Promise<Uint8Array>;
export declare const longTestTimeout: number;
//# sourceMappingURL=test_helper.test.d.ts.map