"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdk = exports.GetUserTransactions = exports.GetTopUserTransactions = exports.GetTokenOwnersData = exports.GetTokenData = exports.GetTokenActivitiesCount = exports.GetTokenActivities = exports.GetNumberOfDelegators = exports.GetIndexerLedgerInfo = exports.GetDelegatedStakingActivities = exports.GetAccountTransactionsData = exports.GetAccountTransactionsCount = exports.GetAccountTokensCount = exports.GetAccountCurrentTokens = exports.GetAccountCoinsData = exports.CollectionDataFieldsFragmentDoc = exports.TokenDataFieldsFragmentDoc = void 0;
exports.TokenDataFieldsFragmentDoc = `
    fragment TokenDataFields on current_token_datas {
  creator_address
  collection_name
  description
  metadata_uri
  name
  token_data_id_hash
  collection_data_id_hash
}
    `;
exports.CollectionDataFieldsFragmentDoc = `
    fragment CollectionDataFields on current_collection_datas {
  metadata_uri
  supply
  description
  collection_name
  collection_data_id_hash
  table_handle
  creator_address
}
    `;
exports.GetAccountCoinsData = `
    query getAccountCoinsData($owner_address: String, $offset: Int, $limit: Int) {
  current_coin_balances(
    where: {owner_address: {_eq: $owner_address}}
    offset: $offset
    limit: $limit
  ) {
    amount
    coin_type
    coin_info {
      name
      decimals
      symbol
    }
  }
}
    `;
exports.GetAccountCurrentTokens = `
    query getAccountCurrentTokens($address: String!, $offset: Int, $limit: Int) {
  current_token_ownerships(
    where: {owner_address: {_eq: $address}, amount: {_gt: 0}}
    order_by: [{last_transaction_version: desc}, {creator_address: asc}, {collection_name: asc}, {name: asc}]
    offset: $offset
    limit: $limit
  ) {
    amount
    current_token_data {
      ...TokenDataFields
    }
    current_collection_data {
      ...CollectionDataFields
    }
    last_transaction_version
    property_version
  }
}
    ${exports.TokenDataFieldsFragmentDoc}
${exports.CollectionDataFieldsFragmentDoc}`;
exports.GetAccountTokensCount = `
    query getAccountTokensCount($owner_address: String) {
  current_token_ownerships_aggregate(
    where: {owner_address: {_eq: $owner_address}, amount: {_gt: "0"}}
  ) {
    aggregate {
      count
    }
  }
}
    `;
exports.GetAccountTransactionsCount = `
    query getAccountTransactionsCount($address: String) {
  move_resources_aggregate(
    where: {address: {_eq: $address}}
    distinct_on: transaction_version
  ) {
    aggregate {
      count
    }
  }
}
    `;
exports.GetAccountTransactionsData = `
    query getAccountTransactionsData($address: String, $limit: Int, $offset: Int) {
  move_resources(
    where: {address: {_eq: $address}}
    order_by: {transaction_version: desc}
    distinct_on: transaction_version
    limit: $limit
    offset: $offset
  ) {
    transaction_version
  }
}
    `;
exports.GetDelegatedStakingActivities = `
    query getDelegatedStakingActivities($delegatorAddress: String, $poolAddress: String) {
  delegated_staking_activities(
    where: {delegator_address: {_eq: $delegatorAddress}, pool_address: {_eq: $poolAddress}}
  ) {
    amount
    delegator_address
    event_index
    event_type
    pool_address
    transaction_version
  }
}
    `;
exports.GetIndexerLedgerInfo = `
    query getIndexerLedgerInfo {
  ledger_infos {
    chain_id
  }
}
    `;
exports.GetNumberOfDelegators = `
    query getNumberOfDelegators($poolAddress: String) {
  num_active_delegator_per_pool(
    where: {pool_address: {_eq: $poolAddress}, num_active_delegator: {_gt: "0"}}
    distinct_on: pool_address
  ) {
    num_active_delegator
  }
}
    `;
exports.GetTokenActivities = `
    query getTokenActivities($idHash: String!, $offset: Int, $limit: Int) {
  token_activities(
    where: {token_data_id_hash: {_eq: $idHash}}
    order_by: {transaction_version: desc}
    offset: $offset
    limit: $limit
  ) {
    creator_address
    collection_name
    name
    token_data_id_hash
    collection_data_id_hash
    from_address
    to_address
    transaction_version
    transaction_timestamp
    property_version
    transfer_type
    event_sequence_number
    token_amount
  }
}
    `;
exports.GetTokenActivitiesCount = `
    query getTokenActivitiesCount($token_id: String) {
  token_activities_aggregate(where: {token_data_id_hash: {_eq: $token_id}}) {
    aggregate {
      count
    }
  }
}
    `;
exports.GetTokenData = `
    query getTokenData($token_id: String) {
  current_token_datas(where: {token_data_id_hash: {_eq: $token_id}}) {
    token_data_id_hash
    name
    collection_name
    creator_address
    default_properties
    largest_property_version
    maximum
    metadata_uri
    payee_address
    royalty_points_denominator
    royalty_points_numerator
    supply
  }
}
    `;
exports.GetTokenOwnersData = `
    query getTokenOwnersData($token_id: String, $property_version: numeric) {
  current_token_ownerships(
    where: {token_data_id_hash: {_eq: $token_id}, property_version: {_eq: $property_version}}
  ) {
    owner_address
  }
}
    `;
exports.GetTopUserTransactions = `
    query getTopUserTransactions($limit: Int) {
  user_transactions(limit: $limit, order_by: {version: desc}) {
    version
  }
}
    `;
exports.GetUserTransactions = `
    query getUserTransactions($limit: Int, $start_version: bigint, $offset: Int) {
  user_transactions(
    limit: $limit
    order_by: {version: desc}
    where: {version: {_lte: $start_version}}
    offset: $offset
  ) {
    version
  }
}
    `;
const defaultWrapper = (action, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_operationName, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_operationType) => action();
function getSdk(client, withWrapper = defaultWrapper) {
    return {
        getAccountCoinsData(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetAccountCoinsData, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getAccountCoinsData", "query");
        },
        getAccountCurrentTokens(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetAccountCurrentTokens, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getAccountCurrentTokens", "query");
        },
        getAccountTokensCount(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetAccountTokensCount, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getAccountTokensCount", "query");
        },
        getAccountTransactionsCount(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetAccountTransactionsCount, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getAccountTransactionsCount", "query");
        },
        getAccountTransactionsData(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetAccountTransactionsData, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getAccountTransactionsData", "query");
        },
        getDelegatedStakingActivities(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetDelegatedStakingActivities, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getDelegatedStakingActivities", "query");
        },
        getIndexerLedgerInfo(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetIndexerLedgerInfo, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getIndexerLedgerInfo", "query");
        },
        getNumberOfDelegators(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetNumberOfDelegators, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getNumberOfDelegators", "query");
        },
        getTokenActivities(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetTokenActivities, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getTokenActivities", "query");
        },
        getTokenActivitiesCount(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetTokenActivitiesCount, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getTokenActivitiesCount", "query");
        },
        getTokenData(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetTokenData, variables, {
                ...requestHeaders,
                ...wrappedRequestHeaders,
            }), "getTokenData", "query");
        },
        getTokenOwnersData(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetTokenOwnersData, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getTokenOwnersData", "query");
        },
        getTopUserTransactions(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetTopUserTransactions, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getTopUserTransactions", "query");
        },
        getUserTransactions(variables, requestHeaders) {
            return withWrapper((wrappedRequestHeaders) => client.request(exports.GetUserTransactions, variables, { ...requestHeaders, ...wrappedRequestHeaders }), "getUserTransactions", "query");
        },
    };
}
exports.getSdk = getSdk;
//# sourceMappingURL=queries.js.map