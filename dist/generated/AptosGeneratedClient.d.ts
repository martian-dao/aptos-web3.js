import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AccountsService } from './services/AccountsService';
import { BlocksService } from './services/BlocksService';
import { EventsService } from './services/EventsService';
import { GeneralService } from './services/GeneralService';
import { TablesService } from './services/TablesService';
import { TransactionsService } from './services/TransactionsService';
import { ViewService } from './services/ViewService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export declare class AptosGeneratedClient {
    readonly accounts: AccountsService;
    readonly blocks: BlocksService;
    readonly events: EventsService;
    readonly general: GeneralService;
    readonly tables: TablesService;
    readonly transactions: TransactionsService;
    readonly view: ViewService;
    readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest?: HttpRequestConstructor);
}
export {};
//# sourceMappingURL=AptosGeneratedClient.d.ts.map