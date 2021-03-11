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
     * Validates query parameter object for getTransactionEventList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    _validateGetTransactionEventListQuery(query) {
        const types = [
            'odfi_ach_deposit',
            'odfi_ach_withdrawal',
            'rdfi_ach_deposit',
            'rdfi_ach_withdrawal'
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
            throw new Error('"query" must be a TransactionEventListQuery object.');
        } else {
            if ('source_custodial_account_uid' in query && !Array.isArray(query.source_custodial_account_uid)) {
                throw new Error('"source_custodial_account_uid" query must be an array.');
            }
            if ('destination_custodial_account_uid' in query && !Array.isArray(query.destination_custodial_account_uid)) {
                throw new Error('"destination_custodial_account_uid" query must be an array.');
            }
            if ('custodial_account_uid' in query && !Array.isArray(query.custodial_account_uid)) {
                throw new Error('"custodial_account_uid" query must be an array.');
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
     * Validates the parameters for the "getTransactionEvent" method
     * @param {string} uid 
     */
    _validateGetTransactionEventParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('TransactionEvent "uid" is required.');
        }
    }

    /**
     * Retrieves a list of Transactions filtered by the given parameters. 
     * @param {TransactionListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Transaction>>} A promise that returns a Transaction List if resolved.
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
     * Retrieves a list of TransactionEvents filtered by the given parameters. 
     * @param {TransactionEventListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<TransactionEvent>>} A promise that returns a TransactionEvent List if resolved.
     * @example
     * const transactionEventList = await rize.transaction.getTransactionEventList({
     *     source_custodial_account_uid: ['custodial_account_uid1', 'custodial_account_uid2'],
     *     destination_custodial_account_uid: ['custodial_account_uid1', 'custodial_account_uid2'],
     *     custodial_account_uid: ['custodial_account_uid1', 'custodial_account_uid2'],
     *     type: ['odfi_ach_deposit'],
     *     transaction_uid: ['transaction_uid1'],
     *     limit: 50,
     *     offset: 0,
     *     sort: 'created_at_asc'
     * });
     */
    async getTransactionEventList(query = {}) {
        this._validateGetTransactionEventListQuery(query);
        const queryParameters = [
            'source_custodial_account_uid',
            'destination_custodial_account_uid',
            'custodial_account_uid',
            'type',
            'transaction_uid',
            'limit',
            'offset',
            'sort'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/transaction_events/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Get a single Transaction
     * 
     * @param {string} uid - Rize-generated unique transaction id
     * @returns {Promise<Transaction>} - A promise that returns a Transaction if resolved.
     * @example const transaction = await rize.Transaction.get(transactionUid);
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
     * Get a single Transaction Event
     * 
     * @param {string} uid - Rize-generated unique transaction id
     * @returns {Promise<TransactionEvent>} - A promise that returns a Transaction Event if resolved.
     * @example const transaction = await rize.transaction.getTransactionEvent(transactionUid);
     */
    async getTransactionEvent(uid) {
        this._validateGetTransactionEventParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/transaction_events/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = TransactionService;

/**
 * @typedef {import('./typedefs/transaction.typedefs').TransactionListQuery} TransactionListQuery
 * @typedef {import('./typedefs/transaction.typedefs').Transaction} Transaction
 * @typedef {import('./typedefs/transaction.typedefs').TransactionEvent} TransactionEvent
 * @typedef {import('./typedefs/transaction.typedefs').TransactionEventListQuery} TransactionEventListQuery
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList 
 */