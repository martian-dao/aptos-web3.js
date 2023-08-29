import * as Types from './types';
export declare type CurrentTokenOwnershipFieldsFragment = {
    __typename?: 'current_token_ownerships_v2';
    token_standard: string;
    is_fungible_v2?: boolean | null;
    is_soulbound_v2?: boolean | null;
    property_version_v1: any;
    table_type_v1?: string | null;
    token_properties_mutated_v1?: any | null;
    amount: any;
    last_transaction_timestamp: any;
    last_transaction_version: any;
    storage_id: string;
    owner_address: string;
    current_token_data?: {
        __typename?: 'current_token_datas_v2';
        token_name: string;
        token_data_id: string;
        token_uri: string;
        token_properties: any;
        supply: any;
        maximum?: any | null;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        largest_property_version_v1?: any | null;
        current_collection?: {
            __typename?: 'current_collections_v2';
            collection_name: string;
            creator_address: string;
            description: string;
            uri: string;
            collection_id: string;
            last_transaction_version: any;
            current_supply: any;
            mutable_description?: boolean | null;
            total_minted_v2?: any | null;
            table_handle_v1?: string | null;
            mutable_uri?: boolean | null;
        } | null;
    } | null;
};
export declare type GetAccountCoinsDataQueryVariables = Types.Exact<{
    owner_address?: Types.InputMaybe<Types.Scalars['String']>;
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetAccountCoinsDataQuery = {
    __typename?: 'query_root';
    current_coin_balances: Array<{
        __typename?: 'current_coin_balances';
        amount: any;
        coin_type: string;
        coin_info?: {
            __typename?: 'coin_infos';
            name: string;
            decimals: number;
            symbol: string;
        } | null;
    }>;
};
export declare type GetAccountCurrentTokensQueryVariables = Types.Exact<{
    address: Types.Scalars['String'];
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetAccountCurrentTokensQuery = {
    __typename?: 'query_root';
    current_token_ownerships: Array<{
        __typename?: 'current_token_ownerships';
        amount: any;
        last_transaction_version: any;
        property_version: any;
        current_token_data?: {
            __typename?: 'current_token_datas';
            creator_address: string;
            collection_name: string;
            description: string;
            metadata_uri: string;
            name: string;
            token_data_id_hash: string;
            collection_data_id_hash: string;
        } | null;
        current_collection_data?: {
            __typename?: 'current_collection_datas';
            metadata_uri: string;
            supply: any;
            description: string;
            collection_name: string;
            collection_data_id_hash: string;
            table_handle: string;
            creator_address: string;
        } | null;
    }>;
};
export declare type TokenDataFieldsFragment = {
    __typename?: 'current_token_datas';
    creator_address: string;
    collection_name: string;
    description: string;
    metadata_uri: string;
    name: string;
    token_data_id_hash: string;
    collection_data_id_hash: string;
};
export declare type CollectionDataFieldsFragment = {
    __typename?: 'current_collection_datas';
    metadata_uri: string;
    supply: any;
    description: string;
    collection_name: string;
    collection_data_id_hash: string;
    table_handle: string;
    creator_address: string;
};
export declare type GetAccountTokensCountQueryVariables = Types.Exact<{
    owner_address?: Types.InputMaybe<Types.Scalars['String']>;
}>;
export declare type GetAccountTokensCountQuery = {
    __typename?: 'query_root';
    current_token_ownerships_aggregate: {
        __typename?: 'current_token_ownerships_aggregate';
        aggregate?: {
            __typename?: 'current_token_ownerships_aggregate_fields';
            count: number;
        } | null;
    };
};
export declare type GetAccountTransactionsCountQueryVariables = Types.Exact<{
    address?: Types.InputMaybe<Types.Scalars['String']>;
}>;
export declare type GetAccountTransactionsCountQuery = {
    __typename?: 'query_root';
    move_resources_aggregate: {
        __typename?: 'move_resources_aggregate';
        aggregate?: {
            __typename?: 'move_resources_aggregate_fields';
            count: number;
        } | null;
    };
};
export declare type GetAccountTransactionsDataQueryVariables = Types.Exact<{
    address?: Types.InputMaybe<Types.Scalars['String']>;
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetAccountTransactionsDataQuery = {
    __typename?: 'query_root';
    move_resources: Array<{
        __typename?: 'move_resources';
        transaction_version: any;
    }>;
};
export declare type GetCollectionDataQueryVariables = Types.Exact<{
    where_condition: Types.Current_Collections_V2_Bool_Exp;
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetCollectionDataQuery = {
    __typename?: 'query_root';
    current_collections_v2: Array<{
        __typename?: 'current_collections_v2';
        collection_id: string;
        token_standard: string;
        collection_name: string;
        creator_address: string;
        current_supply: any;
        description: string;
        uri: string;
    }>;
};
export declare type GetCollectionsWithOwnedTokensQueryVariables = Types.Exact<{
    where_condition: Types.Current_Collection_Ownership_V2_View_Bool_Exp;
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetCollectionsWithOwnedTokensQuery = {
    __typename?: 'query_root';
    current_collection_ownership_v2_view: Array<{
        __typename?: 'current_collection_ownership_v2_view';
        distinct_tokens?: any | null;
        last_transaction_version?: any | null;
        current_collection?: {
            __typename?: 'current_collections_v2';
            creator_address: string;
            collection_name: string;
            token_standard: string;
            collection_id: string;
            description: string;
            table_handle_v1?: string | null;
            uri: string;
            total_minted_v2?: any | null;
            max_supply?: any | null;
        } | null;
    }>;
};
export declare type GetDelegatedStakingActivitiesQueryVariables = Types.Exact<{
    delegatorAddress?: Types.InputMaybe<Types.Scalars['String']>;
    poolAddress?: Types.InputMaybe<Types.Scalars['String']>;
}>;
export declare type GetDelegatedStakingActivitiesQuery = {
    __typename?: 'query_root';
    delegated_staking_activities: Array<{
        __typename?: 'delegated_staking_activities';
        amount: any;
        delegator_address: string;
        event_index: any;
        event_type: string;
        pool_address: string;
        transaction_version: any;
    }>;
};
export declare type GetIndexerLedgerInfoQueryVariables = Types.Exact<{
    [key: string]: never;
}>;
export declare type GetIndexerLedgerInfoQuery = {
    __typename?: 'query_root';
    ledger_infos: Array<{
        __typename?: 'ledger_infos';
        chain_id: any;
    }>;
};
export declare type GetNumberOfDelegatorsQueryVariables = Types.Exact<{
    poolAddress?: Types.InputMaybe<Types.Scalars['String']>;
}>;
export declare type GetNumberOfDelegatorsQuery = {
    __typename?: 'query_root';
    num_active_delegator_per_pool: Array<{
        __typename?: 'num_active_delegator_per_pool';
        num_active_delegator?: any | null;
    }>;
};
export declare type GetOwnedTokensQueryVariables = Types.Exact<{
    where_condition: Types.Current_Token_Ownerships_V2_Bool_Exp;
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetOwnedTokensQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        token_standard: string;
        is_fungible_v2?: boolean | null;
        is_soulbound_v2?: boolean | null;
        property_version_v1: any;
        table_type_v1?: string | null;
        token_properties_mutated_v1?: any | null;
        amount: any;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        storage_id: string;
        owner_address: string;
        current_token_data?: {
            __typename?: 'current_token_datas_v2';
            token_name: string;
            token_data_id: string;
            token_uri: string;
            token_properties: any;
            supply: any;
            maximum?: any | null;
            last_transaction_version: any;
            last_transaction_timestamp: any;
            largest_property_version_v1?: any | null;
            current_collection?: {
                __typename?: 'current_collections_v2';
                collection_name: string;
                creator_address: string;
                description: string;
                uri: string;
                collection_id: string;
                last_transaction_version: any;
                current_supply: any;
                mutable_description?: boolean | null;
                total_minted_v2?: any | null;
                table_handle_v1?: string | null;
                mutable_uri?: boolean | null;
            } | null;
        } | null;
    }>;
};
export declare type GetTokenActivitiesQueryVariables = Types.Exact<{
    idHash: Types.Scalars['String'];
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetTokenActivitiesQuery = {
    __typename?: 'query_root';
    token_activities: Array<{
        __typename?: 'token_activities';
        creator_address: string;
        collection_name: string;
        name: string;
        token_data_id_hash: string;
        collection_data_id_hash: string;
        from_address?: string | null;
        to_address?: string | null;
        transaction_version: any;
        transaction_timestamp: any;
        property_version: any;
        transfer_type: string;
        event_sequence_number: any;
        token_amount: any;
    }>;
};
export declare type GetTokenActivitiesCountQueryVariables = Types.Exact<{
    token_id?: Types.InputMaybe<Types.Scalars['String']>;
}>;
export declare type GetTokenActivitiesCountQuery = {
    __typename?: 'query_root';
    token_activities_aggregate: {
        __typename?: 'token_activities_aggregate';
        aggregate?: {
            __typename?: 'token_activities_aggregate_fields';
            count: number;
        } | null;
    };
};
export declare type GetTokenCurrentOwnerDataQueryVariables = Types.Exact<{
    where_condition: Types.Current_Token_Ownerships_V2_Bool_Exp;
}>;
export declare type GetTokenCurrentOwnerDataQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        owner_address: string;
    }>;
};
export declare type GetTokenDataQueryVariables = Types.Exact<{
    where_condition?: Types.InputMaybe<Types.Current_Token_Datas_V2_Bool_Exp>;
}>;
export declare type GetTokenDataQuery = {
    __typename?: 'query_root';
    current_token_datas_v2: Array<{
        __typename?: 'current_token_datas_v2';
        token_data_id: string;
        token_name: string;
        token_uri: string;
        token_properties: any;
        token_standard: string;
        largest_property_version_v1?: any | null;
        maximum?: any | null;
        is_fungible_v2?: boolean | null;
        supply: any;
        last_transaction_version: any;
        last_transaction_timestamp: any;
        current_collection?: {
            __typename?: 'current_collections_v2';
            collection_id: string;
            collection_name: string;
            creator_address: string;
            uri: string;
            current_supply: any;
        } | null;
    }>;
};
export declare type GetTokenOwnedFromCollectionQueryVariables = Types.Exact<{
    where_condition: Types.Current_Token_Ownerships_V2_Bool_Exp;
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetTokenOwnedFromCollectionQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        token_standard: string;
        is_fungible_v2?: boolean | null;
        is_soulbound_v2?: boolean | null;
        property_version_v1: any;
        table_type_v1?: string | null;
        token_properties_mutated_v1?: any | null;
        amount: any;
        last_transaction_timestamp: any;
        last_transaction_version: any;
        storage_id: string;
        owner_address: string;
        current_token_data?: {
            __typename?: 'current_token_datas_v2';
            token_name: string;
            token_data_id: string;
            token_uri: string;
            token_properties: any;
            supply: any;
            maximum?: any | null;
            last_transaction_version: any;
            last_transaction_timestamp: any;
            largest_property_version_v1?: any | null;
            current_collection?: {
                __typename?: 'current_collections_v2';
                collection_name: string;
                creator_address: string;
                description: string;
                uri: string;
                collection_id: string;
                last_transaction_version: any;
                current_supply: any;
                mutable_description?: boolean | null;
                total_minted_v2?: any | null;
                table_handle_v1?: string | null;
                mutable_uri?: boolean | null;
            } | null;
        } | null;
    }>;
};
export declare type GetTokenOwnersDataQueryVariables = Types.Exact<{
    where_condition: Types.Current_Token_Ownerships_V2_Bool_Exp;
}>;
export declare type GetTokenOwnersDataQuery = {
    __typename?: 'query_root';
    current_token_ownerships_v2: Array<{
        __typename?: 'current_token_ownerships_v2';
        owner_address: string;
    }>;
};
export declare type GetTopUserTransactionsQueryVariables = Types.Exact<{
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetTopUserTransactionsQuery = {
    __typename?: 'query_root';
    user_transactions: Array<{
        __typename?: 'user_transactions';
        version: any;
    }>;
};
export declare type GetUserTransactionsQueryVariables = Types.Exact<{
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
    start_version?: Types.InputMaybe<Types.Scalars['bigint']>;
    offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;
export declare type GetUserTransactionsQuery = {
    __typename?: 'query_root';
    user_transactions: Array<{
        __typename?: 'user_transactions';
        version: any;
    }>;
};
//# sourceMappingURL=operations.d.ts.map