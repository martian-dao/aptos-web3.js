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
exports.TokenClient = void 0;
const assert_1 = __importDefault(require("assert"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
class TokenClient {
    constructor(aptosClient) {
        this.aptosClient = aptosClient;
    }
    submitTransactionHelper(account, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const txnRequest = yield this.aptosClient.generateTransaction(account.address(), payload, {
                max_gas_amount: "4000",
            });
            const signedTxn = yield this.aptosClient.signTransaction(account, txnRequest);
            const res = yield this.aptosClient.submitTransaction(account, signedTxn);
            yield this.aptosClient.waitForTransaction(res.hash);
            return Promise.resolve(res.hash);
        });
    }
    // Creates a new collection within the specified account
    createCollection(account, description, name, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::Token::create_unlimited_collection_script",
                type_arguments: [],
                arguments: [
                    Buffer.from(description).toString("hex"),
                    Buffer.from(name).toString("hex"),
                    Buffer.from(uri).toString("hex"),
                ],
            };
            const transactionHash = yield this.submitTransactionHelper(account, payload);
            return transactionHash;
        });
    }
    // Creates a new token within the specified account
    createToken(account, collectionName, description, name, supply, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::Token::create_token_script",
                type_arguments: [],
                arguments: [
                    Buffer.from(collectionName).toString("hex"),
                    Buffer.from(description).toString("hex"),
                    Buffer.from(name).toString("hex"),
                    supply.toString(),
                    Buffer.from(uri).toString("hex"),
                ],
            };
            const transactionHash = yield this.submitTransactionHelper(account, payload);
            return transactionHash;
        });
    }
    // Offer token to another account
    offerToken(account, receiver, creator, tokenCreationNum, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::TokenTransfers::offer_script",
                type_arguments: [],
                arguments: [receiver, creator, tokenCreationNum.toString(), amount.toString()],
            };
            const transactionHash = yield this.submitTransactionHelper(account, payload);
            return transactionHash;
        });
    }
    // Claim token
    claimToken(account, sender, creator, tokenCreationNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::TokenTransfers::claim_script",
                type_arguments: [],
                arguments: [sender, creator, tokenCreationNum.toString()],
            };
            const transactionHash = yield this.submitTransactionHelper(account, payload);
            return transactionHash;
        });
    }
    // Cancel token
    cancelTokenOffer(account, receiver, creator, tokenCreationNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                type: "script_function_payload",
                function: "0x1::TokenTransfers::cancel_offer_script",
                type_arguments: [],
                arguments: [receiver, creator, tokenCreationNum.toString()],
            };
            const transactionHash = yield this.submitTransactionHelper(account, payload);
            return transactionHash;
        });
    }
    tableItem(handle, keyType, valueType, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, cross_fetch_1.default)(`${this.aptosClient.nodeUrl}/tables/${handle}/item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "key_type": keyType,
                    "value_type": valueType,
                    "key": key
                })
            });
            if (response.status == 404) {
                return null;
            }
            else if (response.status != 200) {
                (0, assert_1.default)(response.status == 200, yield response.text());
            }
            else {
                return yield response.json();
            }
        });
    }
    /** Retrieve the token's creation_num, which is useful for non-creator operations */
    getTokenId(creator, collection_name, token_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.aptosClient.getAccountResources(creator);
            const accountResource = resources.find((r) => r.type === "0x1::Token::Collections");
            let collection = yield this.tableItem(accountResource.data.collections.handle, "0x1::ASCII::String", "0x1::Token::Collection", collection_name);
            let tokenData = yield this.tableItem(collection["tokens"]["handle"], "0x1::ASCII::String", "0x1::Token::TokenData", token_name);
            return tokenData["id"]["creation_num"];
        });
    }
}
exports.TokenClient = TokenClient;
//# sourceMappingURL=token_client.js.map