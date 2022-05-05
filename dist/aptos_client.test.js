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
const aptos_client_1 = require("./aptos_client");
const util_test_1 = require("./util.test");
test("gets genesis account", () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const account = yield client.getAccount("0x1");
    expect(account.authentication_key.length).toBe(66);
    expect(account.sequence_number).not.toBeNull();
}));
test("gets transactions", () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const transactions = yield client.getTransactions();
    expect(transactions.length).toBeGreaterThan(0);
}));
test("gets genesis resources", () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const resources = yield client.getAccountResources("0x1");
    const accountResource = resources.find((r) => r.type === "0x1::Account::Account");
    expect(accountResource.data["self_address"]).toBe("0x1");
}));
test("gets the Account resource", () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const accountResource = yield client.getAccountResource("0x1", "0x1::Account::Account");
    expect(accountResource.data["self_address"]).toBe("0x1");
}));
test("gets account modules", () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const modules = yield client.getAccountModules("0x1");
    const module = modules.find((r) => r.abi.name === "TestCoin");
    expect(module.abi.address).toBe("0x1");
}));
test("gets the TestCoin module", () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new aptos_client_1.AptosClient(util_test_1.NODE_URL);
    const module = yield client.getAccountModule("0x1", "TestCoin");
    expect(module.abi.address).toBe("0x1");
}));
test("test raiseForStatus", () => __awaiter(void 0, void 0, void 0, function* () {
    const testData = { hello: "wow" };
    const fakeResponse = {
        status: 200,
        statusText: "Status Text",
        data: "some string",
        request: {
            host: "host",
            path: "/path",
        },
    };
    // Shouldn't throw
    (0, aptos_client_1.raiseForStatus)(200, fakeResponse, testData);
    (0, aptos_client_1.raiseForStatus)(200, fakeResponse);
    // an error, oh no!
    fakeResponse.status = 500;
    expect(() => (0, aptos_client_1.raiseForStatus)(200, fakeResponse, testData)).toThrow('Status Text - "some string" @ host/path : {"hello":"wow"}');
    expect(() => (0, aptos_client_1.raiseForStatus)(200, fakeResponse)).toThrow('Status Text - "some string" @ host/path');
    // Just a wild test to make sure it doesn't break: request is `any`!
    delete fakeResponse.request;
    expect(() => (0, aptos_client_1.raiseForStatus)(200, fakeResponse, testData)).toThrow('Status Text - "some string" : {"hello":"wow"}');
    expect(() => (0, aptos_client_1.raiseForStatus)(200, fakeResponse)).toThrow('Status Text - "some string"');
}));
//# sourceMappingURL=aptos_client.test.js.map