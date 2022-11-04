"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosGeneratedClient = void 0;
const AxiosHttpRequest_1 = require("./core/AxiosHttpRequest");
const AccountsService_1 = require("./services/AccountsService");
const BlocksService_1 = require("./services/BlocksService");
const EventsService_1 = require("./services/EventsService");
const GeneralService_1 = require("./services/GeneralService");
const TablesService_1 = require("./services/TablesService");
const TransactionsService_1 = require("./services/TransactionsService");
class AptosGeneratedClient {
    constructor(config, HttpRequest = AxiosHttpRequest_1.AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '/v1',
            VERSION: config?.VERSION ?? '1.2.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.accounts = new AccountsService_1.AccountsService(this.request);
        this.blocks = new BlocksService_1.BlocksService(this.request);
        this.events = new EventsService_1.EventsService(this.request);
        this.general = new GeneralService_1.GeneralService(this.request);
        this.tables = new TablesService_1.TablesService(this.request);
        this.transactions = new TransactionsService_1.TransactionsService(this.request);
    }
}
exports.AptosGeneratedClient = AptosGeneratedClient;
//# sourceMappingURL=AptosGeneratedClient.js.map