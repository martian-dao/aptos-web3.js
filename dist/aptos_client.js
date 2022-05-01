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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosClient = exports.raiseForStatus = exports.RequestError = void 0;
const Accounts_1 = require("./api/Accounts");
const Events_1 = require("./api/Events");
const Transactions_1 = require("./api/Transactions");
const http_client_1 = require("./api/http-client");
const hex_string_1 = require("./hex_string");
const util_1 = require("./util");
class RequestError extends Error {
    constructor(message, response, requestBody) {
        var _a, _b;
        const data = JSON.stringify(response.data);
        const hostAndPath = [(_a = response.request) === null || _a === void 0 ? void 0 : _a.host, (_b = response.request) === null || _b === void 0 ? void 0 : _b.path].filter((e) => !!e).join("");
        super(`${message} - ${data}${hostAndPath ? ` @ ${hostAndPath}` : ""}${requestBody ? ` : ${requestBody}` : ""}`);
        this.response = response;
        this.requestBody = requestBody;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.RequestError = RequestError;
function raiseForStatus(expectedStatus, response, requestContent) {
    if (response.status !== expectedStatus) {
        if (requestContent) {
            throw new RequestError(response.statusText, response, JSON.stringify(requestContent));
        }
        throw new RequestError(response.statusText, response);
    }
}
exports.raiseForStatus = raiseForStatus;
class AptosClient {
    constructor(nodeUrl, config) {
        this.nodeUrl = nodeUrl;
        // `withCredentials` ensures cookie handling
        this.client = new http_client_1.HttpClient(Object.assign({ withCredentials: false, baseURL: nodeUrl, validateStatus: () => true }, (config || {})));
        // Initialize routes
        this.accounts = new Accounts_1.Accounts(this.client);
        this.events = new Events_1.Events(this.client);
        this.transactions = new Transactions_1.Transactions(this.client);
    }
    /** Returns the sequence number and authentication key for an account */
    getAccount(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.accounts.getAccount(hex_string_1.HexString.ensure(accountAddress).hex());
            raiseForStatus(200, response);
            return response.data;
        });
    }
    /** Returns transactions sent by the account */
    getAccountTransactions(accountAddress, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.accounts.getAccountTransactions(hex_string_1.HexString.ensure(accountAddress).hex(), query);
            raiseForStatus(200, response);
            return response.data;
        });
    }
    /** Returns all modules associated with the account */
    getAccountModules(accountAddress, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.accounts.getAccountModules(hex_string_1.HexString.ensure(accountAddress).hex(), query);
            raiseForStatus(200, response);
            return response.data;
        });
    }
    /** Returns the module identified by address and module name */
    getAccountModule(accountAddress, moduleName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.accounts.getAccountModule(hex_string_1.HexString.ensure(accountAddress).hex(), moduleName, query);
            raiseForStatus(200, response);
            return response.data;
        });
    }
    /** Returns all resources associated with the account */
    getAccountResources(accountAddress, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.accounts.getAccountResources(hex_string_1.HexString.ensure(accountAddress).hex(), query);
            raiseForStatus(200, response);
            return response.data;
        });
    }
    /** Returns the resource by the address and resource type */
    getAccountResource(accountAddress, resourceType, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.accounts.getAccountResource(hex_string_1.HexString.ensure(accountAddress).hex(), resourceType, query);
            raiseForStatus(200, response);
            return response.data;
        });
    }
    /** Generates a transaction request that can be submitted to produce a raw transaction that
     * can be signed, which upon being signed can be submitted to the blockchain. */
    generateTransaction(sender, payload, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderAddress = hex_string_1.HexString.ensure(sender);
            const account = yield this.getAccount(senderAddress);
            return Object.assign({ sender: senderAddress.hex(), sequence_number: account.sequence_number, max_gas_amount: "1000", gas_unit_price: "1", gas_currency_code: "XUS", 
                // Unix timestamp, in seconds + 10 minutes
                expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 600).toString(), payload }, (options || {}));
        });
    }
    /** Converts a transaction request by `generate_transaction` into it's binary hex BCS representation, ready for
     * signing and submitting.
     * Generally you may want to use `signTransaction`, as it takes care of this step + signing */
    createSigningMessage(txnRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.transactions.createSigningMessage(txnRequest);
            raiseForStatus(200, response, txnRequest);
            const { message } = response.data;
            return message;
        });
    }
    /** Converts a transaction request produced by `generate_transaction` into a properly signed
     * transaction, which can then be submitted to the blockchain. */
    signTransaction(accountFrom, txnRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.createSigningMessage(txnRequest);
            const signatureHex = accountFrom.signHexString(message.substring(2));
            const transactionSignature = {
                type: "ed25519_signature",
                public_key: accountFrom.pubKey().hex(),
                signature: signatureHex.hex(),
            };
            return Object.assign({ signature: transactionSignature }, txnRequest);
        });
    }
    getEventsByEventKey(eventKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.events.getEventsByEventKey(eventKey);
            raiseForStatus(200, response, `eventKey: ${eventKey}`);
            return response.data;
        });
    }
    getEventsByEventHandle(address, eventHandleStruct, fieldName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.accounts.getEventsByEventHandle(hex_string_1.HexString.ensure(address).hex(), eventHandleStruct, fieldName, query);
            raiseForStatus(200, response, { address, eventHandleStruct, fieldName });
            return response.data;
        });
    }
    /** Submits a signed transaction to the blockchain. */
    submitTransaction(accountFrom, signedTxnRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.transactions.submitTransaction(signedTxnRequest);
            raiseForStatus(202, response, signedTxnRequest);
            return response.data;
        });
    }
    getTransactions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.transactions.getTransactions(query);
            raiseForStatus(200, response);
            return response.data;
        });
    }
    getTransaction(txnHashOrVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.transactions.getTransaction(txnHashOrVersion);
            raiseForStatus(200, response, { txnHashOrVersion });
            return response.data;
        });
    }
    transactionPending(txnHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.transactions.getTransaction(txnHash);
            if (response.status === 404) {
                return true;
            }
            raiseForStatus(200, response, txnHash);
            return response.data.type === "pending_transaction";
        });
    }
    /** Waits up to 10 seconds for a transaction to move past pending state */
    waitForTransaction(txnHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            // eslint-disable-next-line no-await-in-loop
            while (yield this.transactionPending(txnHash)) {
                // eslint-disable-next-line no-await-in-loop
                yield (0, util_1.sleep)(1000);
                count += 1;
                if (count >= 10) {
                    throw new Error(`Waiting for transaction ${txnHash} timed out!`);
                }
            }
        });
    }
}
exports.AptosClient = AptosClient;
//# sourceMappingURL=aptos_client.js.map