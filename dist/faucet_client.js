"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaucetClient = void 0;
/** Faucet creates and funds accounts. This is a thin wrapper around that. */
const axios_1 = __importDefault(require("axios"));
const aptos_client_1 = require("./aptos_client");
const hex_string_1 = require("./hex_string");
class FaucetClient extends aptos_client_1.AptosClient {
    constructor(nodeUrl, faucetUrl, config) {
        super(nodeUrl, config);
        this.faucetUrl = faucetUrl;
    }
    /** This creates an account if it does not exist and mints the specified amount of
     coins into that account */
    fundAccount(address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.faucetUrl}/mint?amount=${amount}&address=${hex_string_1.HexString.ensure(address).noPrefix()}`;
            const response = yield axios_1.default.post(url, {}, { validateStatus: () => true });
            (0, aptos_client_1.raiseForStatus)(200, response);
            const tnxHashes = response.data;
            const promises = [];
            for (let i = 0; i < tnxHashes.length; i += 1) {
                const tnxHash = tnxHashes[i];
                promises.push(this.waitForTransaction(tnxHash));
            }
            yield Promise.all(promises);
            return tnxHashes;
        });
    }
}
exports.FaucetClient = FaucetClient;
//# sourceMappingURL=faucet_client.js.map