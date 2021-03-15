const validator = require('validator');
const utils = require('../utils');

/**
 * The Transaction service class
 */
class TransactionService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api 
     * @param {import('./auth')} auth 
     */
    constructor(api, auth) {
        /** @ignore @protected */ this._api = api;
        /** @ignore @protected */ this._auth = auth;
    }

    /** 
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    _validateGetListQuery(query) {
        const types = [
            'atm_withdrawal',
            'card_purchase',
            'card_refund',
            'dispute',
            'external_transfer',
            'fee',
            'internal_transfer',
            'other',
            'reversed_transfer',
            'third_party_transfer'
        ];
        const statuses = [
            'queued',
            'pending',
            'settled',
            'failed'
        ];
        const sortOptions = [
            'created_at_asc',
            'created_at_desc',
            'description_asc',
            'description_desc',
            'id_asc',
            'id_desc',
            'settled_index_asc',
            'settled_index_desc',
            'us_dollar_amount_asc',
            'us_dollar_amount_desc'
        ];
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a TransactionListQuery object.');
        } else {
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
            }
            if ('source_synthetic_account_uid' in query && !Array.isArray(query.source_synthetic_account_uid)) {
                throw new Error('"source_synthetic_account_uid" query must be an array.');
            }
            if ('destination_synthetic_account_uid' in query && !Array.isArray(query.destination_synthetic_account_uid)) {
                throw new Error('"destination_synthetic_account_uid" query must be an array.');
            }
            if ('synthetic_account_uid' in query && !Array.isArray(query.synthetic_account_uid)) {
                throw new Error('"synthetic_account_uid" query must be an array.');
            }
            if ('type' in query) {
                if (!Array.isArray(query.type)) {
                    throw new Error(`"type" query must be an array. Accepted values inside the array are: ${types.join(' | ')}`);
                } else {
                    for (let type of query.type) {
                        if (!types.includes(type)) {
                            throw new Error(`Accepted values in the "type" query are: ${types.join(' | ')}`);
                        }
                    }
                }
            }
            if ('status' in query) {
                if (!Array.isArray(query.status)) {
                    throw new Error(`"status" query must be an array. Accepted values inside the array are: ${statuses.join(' | ')}`);
                } else {
                    for (let status of query.status) {
                        if (!statuses.includes(status)) {
                            throw new Error(`Accepted values in the "status" query are: ${statuses.join(' | ')}`);
                        }
                    }
                }
            }
            if ('limit' in query && !Number.isInteger(query.limit)) {
                throw new Error('"limit" query must be an integer.');
            }
            if ('offset' in query && !Number.isInteger(query.offset)) {
                throw new Error('"offset" query must be an integer.');
            }
            if ('sort' in query && !sortOptions.includes(query.sort)) {
                throw new Error(`"sort" query must be a string. Accepted values are: ${sortOptions.join(' | ')}`);
            }
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid 
     */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Transaction "uid" is required.');
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "getSyntheticLineItem" method
     * @param {string} uid 
     */
    _validateGetSyntheticLineItemParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Synthetic Line Item "uid" is required.');
        }
    }

    /** 
     * @ignore @protected
     * Validates query parameter object for getSyntheticLineItemList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    _validateGetSyntheticLineItemListQuery(query) {
        const statuses = [
            'begun',
            'failed',
            'in_progress',
            'settled'
        ];
        const sortOptions = [
            'created_at_asc',
            'created_at_desc',
            'description_asc',
            'description_desc',
            'settled_index_asc',
            'settled_index_desc',
            'us_dollar_amount_asc',
            'us_dollar_amount_desc'
        ];
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a SyntheticLineItemListQuery object.');
        } else {
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
            }
            if ('pool_uid' in query && !Array.isArray(query.pool_uid)) {
                throw new Error('"pool_uid" query must be an array.');
            }
            if ('synthetic_account_uid' in query && !Array.isArray(query.synthetic_account_uid)) {
                throw new Error('"synthetic_account_uid" query must be an array.');
            }
            if ('transaction_uid' in query && !Array.isArray(query.transaction_uid)) {
                throw new Error('"transaction_uid" query must be an array.');
            }
            if ('status' in query) {
                if (!Array.isArray(query.status)) {
                    throw new Error(`"status" query must be an array. Accepted values inside the array are: ${statuses.join(' | ')}`);
                } else {
                    for (let status of query.status) {
                        if (!statuses.includes(status)) {
                            throw new Error(`Accepted values in the "status" query are: ${statuses.join(' | ')}`);
                        }
                    }
                }
            }
            if ('limit' in query && !Number.isInteger(query.limit)) {
                throw new Error('"limit" query must be an integer.');
            }
            if ('offset' in query && !Number.isInteger(query.offset)) {
                throw new Error('"offset" query must be an integer.');
            }
            if ('sort' in query && !sortOptions.includes(query.sort)) {
                throw new Error(`"sort" query must be a string. Accepted values are: ${sortOptions.join(' | ')}`);
            }
        }
    }

    /** 
     * @ignore @protected
     * Validates query parameter object for getCustodialLineItemList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    _validateGetCustodialLineItemListQuery(query) {
        const statuses = [
            'settled',
            'voided'
        ];
        const sortOptions = [
            'created_at_asc',
            'created_at_desc',
            'description_asc',
            'description_desc',
            'settled_index_asc',
            'settled_index_desc',
            'us_dollar_amount_asc',
            'us_dollar_amount_desc'
        ];
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a CustodialLineItemListQuery object.');
        } else {
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
            }
            if ('custodial_account_uid' in query && !Array.isArray(query.custodial_account_uid)) {
                throw new Error('"custodial_account_uid" query must be an array.');
            }
            if ('status' in query) {
                if (!Array.isArray(query.status)) {
                    throw new Error(`"status" query must be an array. Accepted values inside the array are: ${statuses.join(' | ')}`);
                } else {
                    for (let status of query.status) {
                        if (!statuses.includes(status)) {
                            throw new Error(`Accepted values in the "status" query are: ${statuses.join(' | ')}`);
                        }
                    }
                }
            }
            if ('transaction_event_uid' in query && !Array.isArray(query.transaction_event_uid)) {
                throw new Error('"transaction_event_uid" query must be an array.');
            }
            if ('transaction_uid' in query && !Array.isArray(query.transaction_uid)) {
                throw new Error('"transaction_uid" query must be an array.');
            }
            if ('limit' in query && !Number.isInteger(query.limit)) {
                throw new Error('"limit" query must be an integer.');
            }
            if ('offset' in query && !Number.isInteger(query.offset)) {
                throw new Error('"offset" query must be an integer.');
            }
            if ('sort' in query && !sortOptions.includes(query.sort)) {
                throw new Error(`"sort" query must be a string. Accepted values are: ${sortOptions.join(' | ')}`);
            }
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "getCustodialLineItem" method
     * @param {string} uid 
     */
    _validateGetCustodialLineItemParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Custodial Line Item "uid" is required.');
        }
    }

    /**
     * Retrieves a list of Transactions filtered by the given parameters. 
     * @param {TransactionListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Transaction>>} A promise that returns a Transaction List if resolved.
     * @example
     * const transactions = await rize.transaction.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     source_synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     destination_synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     type: ['internal_transfer'],
     *     limit: 50,
     *     offset: 0,
     *     search_description: 'Transfer*',
     *     status: ['settled'],
     *     sort: 'created_at_asc'
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'source_synthetic_account_uid',
            'destination_synthetic_account_uid',
            'synthetic_account_uid',
            'type',
            'status',
            'search_description',
            'limit',
            'offset',
            'sort'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/transactions/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Get a single Transaction
     * 
     * @param {string} uid - Rize-generated unique transaction id
     * @returns {Promise<Transaction>} A promise that returns a Transaction if resolved.
     * @example const transaction = await rize.transaction.get(transactionUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/transactions/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Retrieves a list of Synthetic Line Items filtered by the given parameters. 
     * @param {SyntheticLineItemListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<SyntheticLineItem>>} A promise that returns a Synthetic Line Item List if resolved.
     * @example
     * const syntheticLineItems = await rize.transaction.getSyntheticLineItemList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     transaction_uid: ['transaction_uid1', 'transaction_uid2'],
     *     status: ['settled'],
     *     sort: 'created_at_asc'
     * });
     */
    async getSyntheticLineItemList(query = {}) {
        this._validateGetSyntheticLineItemListQuery(query);
        const queryParameters = [
            'customer_uid',
            'pool_uid',
            'synthetic_account_uid',
            'status',
            'transaction_uid',
            'limit',
            'offset',
            'sort'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/synthetic_line_items/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Get a single Synthetic Line Item
     * 
     * @param {string} uid - Rize-generated unique Synthetic Line Item id
     * @returns {Promise<SyntheticLineItem>} A promise that returns a Synthetic Line Item if resolved.
     * @example const syntheticLineItem = await rize.transaction.getSyntheticLineItem(syntheticLineItemUid);
     */
    async getSyntheticLineItem(uid) {
        this._validateGetSyntheticLineItemParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/synthetic_line_items/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * 
     * @param {CustodialLineItemListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<CustodialLineItem>>} A promise that returns a Custodial Line Item List if resolved.
     * @example
     * const custodialLineItems = await rize.transaction.getCustodialLineItemList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     custodial_account_uid: ['custodial_account_uid1', 'custodial_account_uid2'],
     *     status: ['settled'],
     *     us_dollar_amount_max: 100,
     *     us_dollar_amount_min: 10,
     *     transaction_event_uid: ['transaction_event_uid1', 'transaction_event_uid2'],
     *     transaction_uid: ['transaction_uid1', 'transaction_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     sort: 'created_at_asc'
     * });
     */
    async getCustodialLineItemList(query = {}) {
        this._validateGetCustodialLineItemListQuery(query);
        const queryParameters = [
            'customer_uid',
            'custodial_account_uid',
            'status',
            'us_dollar_amount_max',
            'us_dollar_amount_min',
            'transaction_event_uid',
            'transaction_uid',
            'limit',
            'offset',
            'sort'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/custodial_line_items/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Get a single Custodial Line Item
     * 
     * @param {string} uid - Rize-generated unique Custodial Line Item id
     * @returns {Promise<CustodialLineItem>} A promise that returns a Custodial Line Item if resolved.
     * @example const custodialLineItem = await rize.transaction.getCustodialLineItem(custodialLineItemUid);
     */
    async getCustodialLineItem(uid) {
        this._validateGetCustodialLineItemParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/custodial_line_items/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = TransactionService;

/**
 * @typedef {import('./typedefs/transaction.typedefs').TransactionListQuery} TransactionListQuery
 * @typedef {import('./typedefs/transaction.typedefs').Transaction} Transaction
 * @typedef {import('./typedefs/transaction.typedefs').SyntheticLineItemListQuery} SyntheticLineItemListQuery
 * @typedef {import('./typedefs/transaction.typedefs').SyntheticLineItem} SyntheticLineItem
 * @typedef {import('./typedefs/transaction.typedefs').CustodialLineItemListQuery} CustodialLineItemListQuery
 * @typedef {import('./typedefs/transaction.typedefs').CustodialLineItem} CustodialLineItem
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */