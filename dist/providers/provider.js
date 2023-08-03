"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
const aptos_client_1 = require("./aptos_client");
const indexer_1 = require("./indexer");
const utils_1 = require("../utils");
/**
 * Builds a Provider class with an aptos client configured to connect to an Aptos node
 * and indexer client configured to connect to Aptos Indexer.
 *
 * It creates AptosClient and IndexerClient instances based on the network or custom endpoints provided.
 *
 * This class holds both AptosClient and IndexerClient classes's methods and properties so we
 * can instantiate the Provider class and use it to query full node and/or Indexer.
 *
 * @example An example of how to use this class
 * ```
 * const provider = new Provider(Network.DEVNET)
 * const account = await provider.getAccount("0x123");
 * const accountNFTs = await provider.getAccountNFTs("0x123");
 * ```
 *
 * @param network enum of type Network - MAINNET | TESTNET | DEVENET or custom endpoints of type CustomEndpoints
 * @param config AptosClient config arg - additional configuration options for the generated Axios client.
 */
class Provider {
    constructor(network, config, doNotFixNodeUrl = false) {
        let fullNodeUrl = null;
        let indexerUrl = null;
        if (typeof network === "object" && isCustomEndpoints(network)) {
            fullNodeUrl = network.fullnodeUrl;
            indexerUrl = network.indexerUrl;
            this.network = "CUSTOM";
        }
        else {
            fullNodeUrl = utils_1.NetworkToNodeAPI[network];
            indexerUrl = utils_1.NetworkToIndexerAPI[network];
            this.network = network;
        }
        if (!fullNodeUrl || !indexerUrl) {
            throw new Error("network is not provided");
        }
        this.aptosClient = new aptos_client_1.AptosClient(fullNodeUrl, config, doNotFixNodeUrl);
        this.indexerClient = new indexer_1.IndexerClient(indexerUrl, config);
    }
}
exports.Provider = Provider;
/**
In TypeScript, we can’t inherit or extend from more than one class,
Mixins helps us to get around that by creating a partial classes
that we can combine to form a single class that contains all the methods and properties from the partial classes.
{@link https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern}

Here, we combine AptosClient and IndexerClient classes into one Provider class that holds all
methods and properties from both classes.
*/
function applyMixin(targetClass, baseClass, baseClassProp) {
    // Mixin instance methods
    Object.getOwnPropertyNames(baseClass.prototype).forEach((propertyName) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, propertyName);
        if (!propertyDescriptor)
            return;
        // eslint-disable-next-line func-names
        propertyDescriptor.value = function (...args) {
            return this[baseClassProp][propertyName](...args);
        };
        Object.defineProperty(targetClass.prototype, propertyName, propertyDescriptor);
    });
    // Mixin static methods
    Object.getOwnPropertyNames(baseClass).forEach((propertyName) => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(baseClass, propertyName);
        if (!propertyDescriptor)
            return;
        // eslint-disable-next-line func-names
        propertyDescriptor.value = function (...args) {
            return this[baseClassProp][propertyName](...args);
        };
        if (targetClass.hasOwnProperty.call(targetClass, propertyName)) {
            // The mixin has already been applied, so skip applying it again
            return;
        }
        Object.defineProperty(targetClass, propertyName, propertyDescriptor);
    });
}
applyMixin(Provider, aptos_client_1.AptosClient, "aptosClient");
applyMixin(Provider, indexer_1.IndexerClient, "indexerClient");
// use exhaustive type predicates
function isCustomEndpoints(network) {
    return (network.fullnodeUrl !== undefined &&
        typeof network.fullnodeUrl === "string" &&
        network.indexerUrl !== undefined &&
        typeof network.indexerUrl === "string");
}
//# sourceMappingURL=provider.js.map