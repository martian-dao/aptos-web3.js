"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Transactions_Select_Column = exports.Tokens_Select_Column = exports.Token_Ownerships_Select_Column = exports.Token_Datas_Select_Column = exports.Token_Activities_Select_Column = exports.Table_Metadatas_Select_Column = exports.Table_Items_Select_Column = exports.Proposal_Votes_Select_Column = exports.Processor_Status_Select_Column = exports.Order_By = exports.Num_Active_Delegator_Per_Pool_Select_Column = exports.Move_Resources_Select_Column = exports.Ledger_Infos_Select_Column = exports.Indexer_Status_Select_Column = exports.Events_Select_Column = exports.Delegated_Staking_Pools_Select_Column = exports.Delegated_Staking_Activities_Select_Column = exports.Cursor_Ordering = exports.Current_Token_Pending_Claims_Select_Column = exports.Current_Token_Ownerships_Select_Column = exports.Current_Token_Datas_Select_Column = exports.Current_Table_Items_Select_Column = exports.Current_Staking_Pool_Voter_Select_Column = exports.Current_Delegator_Balances_Select_Column = exports.Current_Collection_Ownership_View_Select_Column = exports.Current_Collection_Datas_Select_Column = exports.Current_Coin_Balances_Select_Column = exports.Current_Ans_Lookup_Select_Column = exports.Collection_Datas_Select_Column = exports.Coin_Supply_Select_Column = exports.Coin_Infos_Select_Column = exports.Coin_Balances_Select_Column = exports.Coin_Activities_Select_Column = exports.Address_Version_From_Move_Resources_Select_Column = exports.Address_Version_From_Events_Select_Column = void 0;
/** select columns of table "address_version_from_events" */
var Address_Version_From_Events_Select_Column;
(function (Address_Version_From_Events_Select_Column) {
    /** column name */
    Address_Version_From_Events_Select_Column["AccountAddress"] = "account_address";
    /** column name */
    Address_Version_From_Events_Select_Column["TransactionVersion"] = "transaction_version";
})(Address_Version_From_Events_Select_Column = exports.Address_Version_From_Events_Select_Column || (exports.Address_Version_From_Events_Select_Column = {}));
/** select columns of table "address_version_from_move_resources" */
var Address_Version_From_Move_Resources_Select_Column;
(function (Address_Version_From_Move_Resources_Select_Column) {
    /** column name */
    Address_Version_From_Move_Resources_Select_Column["Address"] = "address";
    /** column name */
    Address_Version_From_Move_Resources_Select_Column["TransactionVersion"] = "transaction_version";
})(Address_Version_From_Move_Resources_Select_Column = exports.Address_Version_From_Move_Resources_Select_Column || (exports.Address_Version_From_Move_Resources_Select_Column = {}));
/** select columns of table "coin_activities" */
var Coin_Activities_Select_Column;
(function (Coin_Activities_Select_Column) {
    /** column name */
    Coin_Activities_Select_Column["ActivityType"] = "activity_type";
    /** column name */
    Coin_Activities_Select_Column["Amount"] = "amount";
    /** column name */
    Coin_Activities_Select_Column["BlockHeight"] = "block_height";
    /** column name */
    Coin_Activities_Select_Column["CoinType"] = "coin_type";
    /** column name */
    Coin_Activities_Select_Column["EntryFunctionIdStr"] = "entry_function_id_str";
    /** column name */
    Coin_Activities_Select_Column["EventAccountAddress"] = "event_account_address";
    /** column name */
    Coin_Activities_Select_Column["EventCreationNumber"] = "event_creation_number";
    /** column name */
    Coin_Activities_Select_Column["EventIndex"] = "event_index";
    /** column name */
    Coin_Activities_Select_Column["EventSequenceNumber"] = "event_sequence_number";
    /** column name */
    Coin_Activities_Select_Column["IsGasFee"] = "is_gas_fee";
    /** column name */
    Coin_Activities_Select_Column["IsTransactionSuccess"] = "is_transaction_success";
    /** column name */
    Coin_Activities_Select_Column["OwnerAddress"] = "owner_address";
    /** column name */
    Coin_Activities_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Coin_Activities_Select_Column["TransactionVersion"] = "transaction_version";
})(Coin_Activities_Select_Column = exports.Coin_Activities_Select_Column || (exports.Coin_Activities_Select_Column = {}));
/** select columns of table "coin_balances" */
var Coin_Balances_Select_Column;
(function (Coin_Balances_Select_Column) {
    /** column name */
    Coin_Balances_Select_Column["Amount"] = "amount";
    /** column name */
    Coin_Balances_Select_Column["CoinType"] = "coin_type";
    /** column name */
    Coin_Balances_Select_Column["CoinTypeHash"] = "coin_type_hash";
    /** column name */
    Coin_Balances_Select_Column["OwnerAddress"] = "owner_address";
    /** column name */
    Coin_Balances_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Coin_Balances_Select_Column["TransactionVersion"] = "transaction_version";
})(Coin_Balances_Select_Column = exports.Coin_Balances_Select_Column || (exports.Coin_Balances_Select_Column = {}));
/** select columns of table "coin_infos" */
var Coin_Infos_Select_Column;
(function (Coin_Infos_Select_Column) {
    /** column name */
    Coin_Infos_Select_Column["CoinType"] = "coin_type";
    /** column name */
    Coin_Infos_Select_Column["CoinTypeHash"] = "coin_type_hash";
    /** column name */
    Coin_Infos_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Coin_Infos_Select_Column["Decimals"] = "decimals";
    /** column name */
    Coin_Infos_Select_Column["Name"] = "name";
    /** column name */
    Coin_Infos_Select_Column["SupplyAggregatorTableHandle"] = "supply_aggregator_table_handle";
    /** column name */
    Coin_Infos_Select_Column["SupplyAggregatorTableKey"] = "supply_aggregator_table_key";
    /** column name */
    Coin_Infos_Select_Column["Symbol"] = "symbol";
    /** column name */
    Coin_Infos_Select_Column["TransactionCreatedTimestamp"] = "transaction_created_timestamp";
    /** column name */
    Coin_Infos_Select_Column["TransactionVersionCreated"] = "transaction_version_created";
})(Coin_Infos_Select_Column = exports.Coin_Infos_Select_Column || (exports.Coin_Infos_Select_Column = {}));
/** select columns of table "coin_supply" */
var Coin_Supply_Select_Column;
(function (Coin_Supply_Select_Column) {
    /** column name */
    Coin_Supply_Select_Column["CoinType"] = "coin_type";
    /** column name */
    Coin_Supply_Select_Column["CoinTypeHash"] = "coin_type_hash";
    /** column name */
    Coin_Supply_Select_Column["Supply"] = "supply";
    /** column name */
    Coin_Supply_Select_Column["TransactionEpoch"] = "transaction_epoch";
    /** column name */
    Coin_Supply_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Coin_Supply_Select_Column["TransactionVersion"] = "transaction_version";
})(Coin_Supply_Select_Column = exports.Coin_Supply_Select_Column || (exports.Coin_Supply_Select_Column = {}));
/** select columns of table "collection_datas" */
var Collection_Datas_Select_Column;
(function (Collection_Datas_Select_Column) {
    /** column name */
    Collection_Datas_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Collection_Datas_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Collection_Datas_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Collection_Datas_Select_Column["Description"] = "description";
    /** column name */
    Collection_Datas_Select_Column["DescriptionMutable"] = "description_mutable";
    /** column name */
    Collection_Datas_Select_Column["Maximum"] = "maximum";
    /** column name */
    Collection_Datas_Select_Column["MaximumMutable"] = "maximum_mutable";
    /** column name */
    Collection_Datas_Select_Column["MetadataUri"] = "metadata_uri";
    /** column name */
    Collection_Datas_Select_Column["Supply"] = "supply";
    /** column name */
    Collection_Datas_Select_Column["TableHandle"] = "table_handle";
    /** column name */
    Collection_Datas_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Collection_Datas_Select_Column["TransactionVersion"] = "transaction_version";
    /** column name */
    Collection_Datas_Select_Column["UriMutable"] = "uri_mutable";
})(Collection_Datas_Select_Column = exports.Collection_Datas_Select_Column || (exports.Collection_Datas_Select_Column = {}));
/** select columns of table "current_ans_lookup" */
var Current_Ans_Lookup_Select_Column;
(function (Current_Ans_Lookup_Select_Column) {
    /** column name */
    Current_Ans_Lookup_Select_Column["Domain"] = "domain";
    /** column name */
    Current_Ans_Lookup_Select_Column["ExpirationTimestamp"] = "expiration_timestamp";
    /** column name */
    Current_Ans_Lookup_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Ans_Lookup_Select_Column["RegisteredAddress"] = "registered_address";
    /** column name */
    Current_Ans_Lookup_Select_Column["Subdomain"] = "subdomain";
})(Current_Ans_Lookup_Select_Column = exports.Current_Ans_Lookup_Select_Column || (exports.Current_Ans_Lookup_Select_Column = {}));
/** select columns of table "current_coin_balances" */
var Current_Coin_Balances_Select_Column;
(function (Current_Coin_Balances_Select_Column) {
    /** column name */
    Current_Coin_Balances_Select_Column["Amount"] = "amount";
    /** column name */
    Current_Coin_Balances_Select_Column["CoinType"] = "coin_type";
    /** column name */
    Current_Coin_Balances_Select_Column["CoinTypeHash"] = "coin_type_hash";
    /** column name */
    Current_Coin_Balances_Select_Column["LastTransactionTimestamp"] = "last_transaction_timestamp";
    /** column name */
    Current_Coin_Balances_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Coin_Balances_Select_Column["OwnerAddress"] = "owner_address";
})(Current_Coin_Balances_Select_Column = exports.Current_Coin_Balances_Select_Column || (exports.Current_Coin_Balances_Select_Column = {}));
/** select columns of table "current_collection_datas" */
var Current_Collection_Datas_Select_Column;
(function (Current_Collection_Datas_Select_Column) {
    /** column name */
    Current_Collection_Datas_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Current_Collection_Datas_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Current_Collection_Datas_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Current_Collection_Datas_Select_Column["Description"] = "description";
    /** column name */
    Current_Collection_Datas_Select_Column["DescriptionMutable"] = "description_mutable";
    /** column name */
    Current_Collection_Datas_Select_Column["LastTransactionTimestamp"] = "last_transaction_timestamp";
    /** column name */
    Current_Collection_Datas_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Collection_Datas_Select_Column["Maximum"] = "maximum";
    /** column name */
    Current_Collection_Datas_Select_Column["MaximumMutable"] = "maximum_mutable";
    /** column name */
    Current_Collection_Datas_Select_Column["MetadataUri"] = "metadata_uri";
    /** column name */
    Current_Collection_Datas_Select_Column["Supply"] = "supply";
    /** column name */
    Current_Collection_Datas_Select_Column["TableHandle"] = "table_handle";
    /** column name */
    Current_Collection_Datas_Select_Column["UriMutable"] = "uri_mutable";
})(Current_Collection_Datas_Select_Column = exports.Current_Collection_Datas_Select_Column || (exports.Current_Collection_Datas_Select_Column = {}));
/** select columns of table "current_collection_ownership_view" */
var Current_Collection_Ownership_View_Select_Column;
(function (Current_Collection_Ownership_View_Select_Column) {
    /** column name */
    Current_Collection_Ownership_View_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Current_Collection_Ownership_View_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Current_Collection_Ownership_View_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Current_Collection_Ownership_View_Select_Column["DistinctTokens"] = "distinct_tokens";
    /** column name */
    Current_Collection_Ownership_View_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Collection_Ownership_View_Select_Column["OwnerAddress"] = "owner_address";
})(Current_Collection_Ownership_View_Select_Column = exports.Current_Collection_Ownership_View_Select_Column || (exports.Current_Collection_Ownership_View_Select_Column = {}));
/** select columns of table "current_delegator_balances" */
var Current_Delegator_Balances_Select_Column;
(function (Current_Delegator_Balances_Select_Column) {
    /** column name */
    Current_Delegator_Balances_Select_Column["DelegatorAddress"] = "delegator_address";
    /** column name */
    Current_Delegator_Balances_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Delegator_Balances_Select_Column["PoolAddress"] = "pool_address";
    /** column name */
    Current_Delegator_Balances_Select_Column["PoolType"] = "pool_type";
    /** column name */
    Current_Delegator_Balances_Select_Column["Shares"] = "shares";
    /** column name */
    Current_Delegator_Balances_Select_Column["TableHandle"] = "table_handle";
})(Current_Delegator_Balances_Select_Column = exports.Current_Delegator_Balances_Select_Column || (exports.Current_Delegator_Balances_Select_Column = {}));
/** select columns of table "current_staking_pool_voter" */
var Current_Staking_Pool_Voter_Select_Column;
(function (Current_Staking_Pool_Voter_Select_Column) {
    /** column name */
    Current_Staking_Pool_Voter_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Staking_Pool_Voter_Select_Column["OperatorAddress"] = "operator_address";
    /** column name */
    Current_Staking_Pool_Voter_Select_Column["StakingPoolAddress"] = "staking_pool_address";
    /** column name */
    Current_Staking_Pool_Voter_Select_Column["VoterAddress"] = "voter_address";
})(Current_Staking_Pool_Voter_Select_Column = exports.Current_Staking_Pool_Voter_Select_Column || (exports.Current_Staking_Pool_Voter_Select_Column = {}));
/** select columns of table "current_table_items" */
var Current_Table_Items_Select_Column;
(function (Current_Table_Items_Select_Column) {
    /** column name */
    Current_Table_Items_Select_Column["DecodedKey"] = "decoded_key";
    /** column name */
    Current_Table_Items_Select_Column["DecodedValue"] = "decoded_value";
    /** column name */
    Current_Table_Items_Select_Column["IsDeleted"] = "is_deleted";
    /** column name */
    Current_Table_Items_Select_Column["Key"] = "key";
    /** column name */
    Current_Table_Items_Select_Column["KeyHash"] = "key_hash";
    /** column name */
    Current_Table_Items_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Table_Items_Select_Column["TableHandle"] = "table_handle";
})(Current_Table_Items_Select_Column = exports.Current_Table_Items_Select_Column || (exports.Current_Table_Items_Select_Column = {}));
/** select columns of table "current_token_datas" */
var Current_Token_Datas_Select_Column;
(function (Current_Token_Datas_Select_Column) {
    /** column name */
    Current_Token_Datas_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Current_Token_Datas_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Current_Token_Datas_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Current_Token_Datas_Select_Column["DefaultProperties"] = "default_properties";
    /** column name */
    Current_Token_Datas_Select_Column["Description"] = "description";
    /** column name */
    Current_Token_Datas_Select_Column["DescriptionMutable"] = "description_mutable";
    /** column name */
    Current_Token_Datas_Select_Column["LargestPropertyVersion"] = "largest_property_version";
    /** column name */
    Current_Token_Datas_Select_Column["LastTransactionTimestamp"] = "last_transaction_timestamp";
    /** column name */
    Current_Token_Datas_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Token_Datas_Select_Column["Maximum"] = "maximum";
    /** column name */
    Current_Token_Datas_Select_Column["MaximumMutable"] = "maximum_mutable";
    /** column name */
    Current_Token_Datas_Select_Column["MetadataUri"] = "metadata_uri";
    /** column name */
    Current_Token_Datas_Select_Column["Name"] = "name";
    /** column name */
    Current_Token_Datas_Select_Column["PayeeAddress"] = "payee_address";
    /** column name */
    Current_Token_Datas_Select_Column["PropertiesMutable"] = "properties_mutable";
    /** column name */
    Current_Token_Datas_Select_Column["RoyaltyMutable"] = "royalty_mutable";
    /** column name */
    Current_Token_Datas_Select_Column["RoyaltyPointsDenominator"] = "royalty_points_denominator";
    /** column name */
    Current_Token_Datas_Select_Column["RoyaltyPointsNumerator"] = "royalty_points_numerator";
    /** column name */
    Current_Token_Datas_Select_Column["Supply"] = "supply";
    /** column name */
    Current_Token_Datas_Select_Column["TokenDataIdHash"] = "token_data_id_hash";
    /** column name */
    Current_Token_Datas_Select_Column["UriMutable"] = "uri_mutable";
})(Current_Token_Datas_Select_Column = exports.Current_Token_Datas_Select_Column || (exports.Current_Token_Datas_Select_Column = {}));
/** select columns of table "current_token_ownerships" */
var Current_Token_Ownerships_Select_Column;
(function (Current_Token_Ownerships_Select_Column) {
    /** column name */
    Current_Token_Ownerships_Select_Column["Amount"] = "amount";
    /** column name */
    Current_Token_Ownerships_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Current_Token_Ownerships_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Current_Token_Ownerships_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Current_Token_Ownerships_Select_Column["LastTransactionTimestamp"] = "last_transaction_timestamp";
    /** column name */
    Current_Token_Ownerships_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Token_Ownerships_Select_Column["Name"] = "name";
    /** column name */
    Current_Token_Ownerships_Select_Column["OwnerAddress"] = "owner_address";
    /** column name */
    Current_Token_Ownerships_Select_Column["PropertyVersion"] = "property_version";
    /** column name */
    Current_Token_Ownerships_Select_Column["TableType"] = "table_type";
    /** column name */
    Current_Token_Ownerships_Select_Column["TokenDataIdHash"] = "token_data_id_hash";
    /** column name */
    Current_Token_Ownerships_Select_Column["TokenProperties"] = "token_properties";
})(Current_Token_Ownerships_Select_Column = exports.Current_Token_Ownerships_Select_Column || (exports.Current_Token_Ownerships_Select_Column = {}));
/** select columns of table "current_token_pending_claims" */
var Current_Token_Pending_Claims_Select_Column;
(function (Current_Token_Pending_Claims_Select_Column) {
    /** column name */
    Current_Token_Pending_Claims_Select_Column["Amount"] = "amount";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["FromAddress"] = "from_address";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["LastTransactionTimestamp"] = "last_transaction_timestamp";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["LastTransactionVersion"] = "last_transaction_version";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["Name"] = "name";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["PropertyVersion"] = "property_version";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["TableHandle"] = "table_handle";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["ToAddress"] = "to_address";
    /** column name */
    Current_Token_Pending_Claims_Select_Column["TokenDataIdHash"] = "token_data_id_hash";
})(Current_Token_Pending_Claims_Select_Column = exports.Current_Token_Pending_Claims_Select_Column || (exports.Current_Token_Pending_Claims_Select_Column = {}));
/** ordering argument of a cursor */
var Cursor_Ordering;
(function (Cursor_Ordering) {
    /** ascending ordering of the cursor */
    Cursor_Ordering["Asc"] = "ASC";
    /** descending ordering of the cursor */
    Cursor_Ordering["Desc"] = "DESC";
})(Cursor_Ordering = exports.Cursor_Ordering || (exports.Cursor_Ordering = {}));
/** select columns of table "delegated_staking_activities" */
var Delegated_Staking_Activities_Select_Column;
(function (Delegated_Staking_Activities_Select_Column) {
    /** column name */
    Delegated_Staking_Activities_Select_Column["Amount"] = "amount";
    /** column name */
    Delegated_Staking_Activities_Select_Column["DelegatorAddress"] = "delegator_address";
    /** column name */
    Delegated_Staking_Activities_Select_Column["EventIndex"] = "event_index";
    /** column name */
    Delegated_Staking_Activities_Select_Column["EventType"] = "event_type";
    /** column name */
    Delegated_Staking_Activities_Select_Column["PoolAddress"] = "pool_address";
    /** column name */
    Delegated_Staking_Activities_Select_Column["TransactionVersion"] = "transaction_version";
})(Delegated_Staking_Activities_Select_Column = exports.Delegated_Staking_Activities_Select_Column || (exports.Delegated_Staking_Activities_Select_Column = {}));
/** select columns of table "delegated_staking_pools" */
var Delegated_Staking_Pools_Select_Column;
(function (Delegated_Staking_Pools_Select_Column) {
    /** column name */
    Delegated_Staking_Pools_Select_Column["FirstTransactionVersion"] = "first_transaction_version";
    /** column name */
    Delegated_Staking_Pools_Select_Column["StakingPoolAddress"] = "staking_pool_address";
})(Delegated_Staking_Pools_Select_Column = exports.Delegated_Staking_Pools_Select_Column || (exports.Delegated_Staking_Pools_Select_Column = {}));
/** select columns of table "events" */
var Events_Select_Column;
(function (Events_Select_Column) {
    /** column name */
    Events_Select_Column["AccountAddress"] = "account_address";
    /** column name */
    Events_Select_Column["CreationNumber"] = "creation_number";
    /** column name */
    Events_Select_Column["Data"] = "data";
    /** column name */
    Events_Select_Column["EventIndex"] = "event_index";
    /** column name */
    Events_Select_Column["SequenceNumber"] = "sequence_number";
    /** column name */
    Events_Select_Column["TransactionBlockHeight"] = "transaction_block_height";
    /** column name */
    Events_Select_Column["TransactionVersion"] = "transaction_version";
    /** column name */
    Events_Select_Column["Type"] = "type";
})(Events_Select_Column = exports.Events_Select_Column || (exports.Events_Select_Column = {}));
/** select columns of table "indexer_status" */
var Indexer_Status_Select_Column;
(function (Indexer_Status_Select_Column) {
    /** column name */
    Indexer_Status_Select_Column["Db"] = "db";
    /** column name */
    Indexer_Status_Select_Column["IsIndexerUp"] = "is_indexer_up";
})(Indexer_Status_Select_Column = exports.Indexer_Status_Select_Column || (exports.Indexer_Status_Select_Column = {}));
/** select columns of table "ledger_infos" */
var Ledger_Infos_Select_Column;
(function (Ledger_Infos_Select_Column) {
    /** column name */
    Ledger_Infos_Select_Column["ChainId"] = "chain_id";
})(Ledger_Infos_Select_Column = exports.Ledger_Infos_Select_Column || (exports.Ledger_Infos_Select_Column = {}));
/** select columns of table "move_resources" */
var Move_Resources_Select_Column;
(function (Move_Resources_Select_Column) {
    /** column name */
    Move_Resources_Select_Column["Address"] = "address";
    /** column name */
    Move_Resources_Select_Column["TransactionVersion"] = "transaction_version";
})(Move_Resources_Select_Column = exports.Move_Resources_Select_Column || (exports.Move_Resources_Select_Column = {}));
/** select columns of table "num_active_delegator_per_pool" */
var Num_Active_Delegator_Per_Pool_Select_Column;
(function (Num_Active_Delegator_Per_Pool_Select_Column) {
    /** column name */
    Num_Active_Delegator_Per_Pool_Select_Column["NumActiveDelegator"] = "num_active_delegator";
    /** column name */
    Num_Active_Delegator_Per_Pool_Select_Column["PoolAddress"] = "pool_address";
})(Num_Active_Delegator_Per_Pool_Select_Column = exports.Num_Active_Delegator_Per_Pool_Select_Column || (exports.Num_Active_Delegator_Per_Pool_Select_Column = {}));
/** column ordering options */
var Order_By;
(function (Order_By) {
    /** in ascending order, nulls last */
    Order_By["Asc"] = "asc";
    /** in ascending order, nulls first */
    Order_By["AscNullsFirst"] = "asc_nulls_first";
    /** in ascending order, nulls last */
    Order_By["AscNullsLast"] = "asc_nulls_last";
    /** in descending order, nulls first */
    Order_By["Desc"] = "desc";
    /** in descending order, nulls first */
    Order_By["DescNullsFirst"] = "desc_nulls_first";
    /** in descending order, nulls last */
    Order_By["DescNullsLast"] = "desc_nulls_last";
})(Order_By = exports.Order_By || (exports.Order_By = {}));
/** select columns of table "processor_status" */
var Processor_Status_Select_Column;
(function (Processor_Status_Select_Column) {
    /** column name */
    Processor_Status_Select_Column["LastSuccessVersion"] = "last_success_version";
    /** column name */
    Processor_Status_Select_Column["Processor"] = "processor";
})(Processor_Status_Select_Column = exports.Processor_Status_Select_Column || (exports.Processor_Status_Select_Column = {}));
/** select columns of table "proposal_votes" */
var Proposal_Votes_Select_Column;
(function (Proposal_Votes_Select_Column) {
    /** column name */
    Proposal_Votes_Select_Column["NumVotes"] = "num_votes";
    /** column name */
    Proposal_Votes_Select_Column["ProposalId"] = "proposal_id";
    /** column name */
    Proposal_Votes_Select_Column["ShouldPass"] = "should_pass";
    /** column name */
    Proposal_Votes_Select_Column["StakingPoolAddress"] = "staking_pool_address";
    /** column name */
    Proposal_Votes_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Proposal_Votes_Select_Column["TransactionVersion"] = "transaction_version";
    /** column name */
    Proposal_Votes_Select_Column["VoterAddress"] = "voter_address";
})(Proposal_Votes_Select_Column = exports.Proposal_Votes_Select_Column || (exports.Proposal_Votes_Select_Column = {}));
/** select columns of table "table_items" */
var Table_Items_Select_Column;
(function (Table_Items_Select_Column) {
    /** column name */
    Table_Items_Select_Column["DecodedKey"] = "decoded_key";
    /** column name */
    Table_Items_Select_Column["DecodedValue"] = "decoded_value";
    /** column name */
    Table_Items_Select_Column["Key"] = "key";
    /** column name */
    Table_Items_Select_Column["TableHandle"] = "table_handle";
    /** column name */
    Table_Items_Select_Column["TransactionVersion"] = "transaction_version";
    /** column name */
    Table_Items_Select_Column["WriteSetChangeIndex"] = "write_set_change_index";
})(Table_Items_Select_Column = exports.Table_Items_Select_Column || (exports.Table_Items_Select_Column = {}));
/** select columns of table "table_metadatas" */
var Table_Metadatas_Select_Column;
(function (Table_Metadatas_Select_Column) {
    /** column name */
    Table_Metadatas_Select_Column["Handle"] = "handle";
    /** column name */
    Table_Metadatas_Select_Column["KeyType"] = "key_type";
    /** column name */
    Table_Metadatas_Select_Column["ValueType"] = "value_type";
})(Table_Metadatas_Select_Column = exports.Table_Metadatas_Select_Column || (exports.Table_Metadatas_Select_Column = {}));
/** select columns of table "token_activities" */
var Token_Activities_Select_Column;
(function (Token_Activities_Select_Column) {
    /** column name */
    Token_Activities_Select_Column["CoinAmount"] = "coin_amount";
    /** column name */
    Token_Activities_Select_Column["CoinType"] = "coin_type";
    /** column name */
    Token_Activities_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Token_Activities_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Token_Activities_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Token_Activities_Select_Column["EventAccountAddress"] = "event_account_address";
    /** column name */
    Token_Activities_Select_Column["EventCreationNumber"] = "event_creation_number";
    /** column name */
    Token_Activities_Select_Column["EventIndex"] = "event_index";
    /** column name */
    Token_Activities_Select_Column["EventSequenceNumber"] = "event_sequence_number";
    /** column name */
    Token_Activities_Select_Column["FromAddress"] = "from_address";
    /** column name */
    Token_Activities_Select_Column["Name"] = "name";
    /** column name */
    Token_Activities_Select_Column["PropertyVersion"] = "property_version";
    /** column name */
    Token_Activities_Select_Column["ToAddress"] = "to_address";
    /** column name */
    Token_Activities_Select_Column["TokenAmount"] = "token_amount";
    /** column name */
    Token_Activities_Select_Column["TokenDataIdHash"] = "token_data_id_hash";
    /** column name */
    Token_Activities_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Token_Activities_Select_Column["TransactionVersion"] = "transaction_version";
    /** column name */
    Token_Activities_Select_Column["TransferType"] = "transfer_type";
})(Token_Activities_Select_Column = exports.Token_Activities_Select_Column || (exports.Token_Activities_Select_Column = {}));
/** select columns of table "token_datas" */
var Token_Datas_Select_Column;
(function (Token_Datas_Select_Column) {
    /** column name */
    Token_Datas_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Token_Datas_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Token_Datas_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Token_Datas_Select_Column["DefaultProperties"] = "default_properties";
    /** column name */
    Token_Datas_Select_Column["Description"] = "description";
    /** column name */
    Token_Datas_Select_Column["DescriptionMutable"] = "description_mutable";
    /** column name */
    Token_Datas_Select_Column["LargestPropertyVersion"] = "largest_property_version";
    /** column name */
    Token_Datas_Select_Column["Maximum"] = "maximum";
    /** column name */
    Token_Datas_Select_Column["MaximumMutable"] = "maximum_mutable";
    /** column name */
    Token_Datas_Select_Column["MetadataUri"] = "metadata_uri";
    /** column name */
    Token_Datas_Select_Column["Name"] = "name";
    /** column name */
    Token_Datas_Select_Column["PayeeAddress"] = "payee_address";
    /** column name */
    Token_Datas_Select_Column["PropertiesMutable"] = "properties_mutable";
    /** column name */
    Token_Datas_Select_Column["RoyaltyMutable"] = "royalty_mutable";
    /** column name */
    Token_Datas_Select_Column["RoyaltyPointsDenominator"] = "royalty_points_denominator";
    /** column name */
    Token_Datas_Select_Column["RoyaltyPointsNumerator"] = "royalty_points_numerator";
    /** column name */
    Token_Datas_Select_Column["Supply"] = "supply";
    /** column name */
    Token_Datas_Select_Column["TokenDataIdHash"] = "token_data_id_hash";
    /** column name */
    Token_Datas_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Token_Datas_Select_Column["TransactionVersion"] = "transaction_version";
    /** column name */
    Token_Datas_Select_Column["UriMutable"] = "uri_mutable";
})(Token_Datas_Select_Column = exports.Token_Datas_Select_Column || (exports.Token_Datas_Select_Column = {}));
/** select columns of table "token_ownerships" */
var Token_Ownerships_Select_Column;
(function (Token_Ownerships_Select_Column) {
    /** column name */
    Token_Ownerships_Select_Column["Amount"] = "amount";
    /** column name */
    Token_Ownerships_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Token_Ownerships_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Token_Ownerships_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Token_Ownerships_Select_Column["Name"] = "name";
    /** column name */
    Token_Ownerships_Select_Column["OwnerAddress"] = "owner_address";
    /** column name */
    Token_Ownerships_Select_Column["PropertyVersion"] = "property_version";
    /** column name */
    Token_Ownerships_Select_Column["TableHandle"] = "table_handle";
    /** column name */
    Token_Ownerships_Select_Column["TableType"] = "table_type";
    /** column name */
    Token_Ownerships_Select_Column["TokenDataIdHash"] = "token_data_id_hash";
    /** column name */
    Token_Ownerships_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Token_Ownerships_Select_Column["TransactionVersion"] = "transaction_version";
})(Token_Ownerships_Select_Column = exports.Token_Ownerships_Select_Column || (exports.Token_Ownerships_Select_Column = {}));
/** select columns of table "tokens" */
var Tokens_Select_Column;
(function (Tokens_Select_Column) {
    /** column name */
    Tokens_Select_Column["CollectionDataIdHash"] = "collection_data_id_hash";
    /** column name */
    Tokens_Select_Column["CollectionName"] = "collection_name";
    /** column name */
    Tokens_Select_Column["CreatorAddress"] = "creator_address";
    /** column name */
    Tokens_Select_Column["Name"] = "name";
    /** column name */
    Tokens_Select_Column["PropertyVersion"] = "property_version";
    /** column name */
    Tokens_Select_Column["TokenDataIdHash"] = "token_data_id_hash";
    /** column name */
    Tokens_Select_Column["TokenProperties"] = "token_properties";
    /** column name */
    Tokens_Select_Column["TransactionTimestamp"] = "transaction_timestamp";
    /** column name */
    Tokens_Select_Column["TransactionVersion"] = "transaction_version";
})(Tokens_Select_Column = exports.Tokens_Select_Column || (exports.Tokens_Select_Column = {}));
/** select columns of table "user_transactions" */
var User_Transactions_Select_Column;
(function (User_Transactions_Select_Column) {
    /** column name */
    User_Transactions_Select_Column["BlockHeight"] = "block_height";
    /** column name */
    User_Transactions_Select_Column["EntryFunctionIdStr"] = "entry_function_id_str";
    /** column name */
    User_Transactions_Select_Column["Epoch"] = "epoch";
    /** column name */
    User_Transactions_Select_Column["ExpirationTimestampSecs"] = "expiration_timestamp_secs";
    /** column name */
    User_Transactions_Select_Column["GasUnitPrice"] = "gas_unit_price";
    /** column name */
    User_Transactions_Select_Column["MaxGasAmount"] = "max_gas_amount";
    /** column name */
    User_Transactions_Select_Column["ParentSignatureType"] = "parent_signature_type";
    /** column name */
    User_Transactions_Select_Column["Sender"] = "sender";
    /** column name */
    User_Transactions_Select_Column["SequenceNumber"] = "sequence_number";
    /** column name */
    User_Transactions_Select_Column["Timestamp"] = "timestamp";
    /** column name */
    User_Transactions_Select_Column["Version"] = "version";
})(User_Transactions_Select_Column = exports.User_Transactions_Select_Column || (exports.User_Transactions_Select_Column = {}));
//# sourceMappingURL=types.js.map