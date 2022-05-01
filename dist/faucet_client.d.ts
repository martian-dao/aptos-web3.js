import { AptosClient, AptosClientConfig } from "./aptos_client";
import { Types } from "./types";
import { MaybeHexString } from "./hex_string";
export declare class FaucetClient extends AptosClient {
    faucetUrl: string;
    constructor(nodeUrl: string, faucetUrl: string, config?: AptosClientConfig);
    /** This creates an account if it does not exist and mints the specified amount of
     coins into that account */
    fundAccount(address: MaybeHexString, amount: number): Promise<Types.HexEncodedBytes[]>;
}
//# sourceMappingURL=faucet_client.d.ts.map