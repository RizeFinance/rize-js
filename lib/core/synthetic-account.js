const validator = require('validator');
const utils = require('../utils');

/**
 * The Synthetic Account service class.
 */
class SyntheticAccountService {
    /** 
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor (api, auth) {
        /** @ignore @protected */ this._api = api;
        /** @ignore @protected */ this._auth = auth;
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid 
     */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Synthetic Account "uid" is required.');
        }
    }

    /**
     * Validates the parameters for the "getList" method
     * @param {SyntheticAccountListQuery} query 
     */
    _validateGetListQuery(query) {
        const syntheticAccountCategories = [ 'general', 'external', 'plaid_external'];
        const sortOptions = [
            'name_asc',
            'name_desc',
            'net_usd_balance_asc',
            'net_usd_balance_desc',
            'net_usd_pending_balance_asc',
            'net_usd_pending_balance_desc',
            'net_usd_available_balance_asc',
            'net_usd_available_balance_desc',
        ];

        if (!utils.isObject(query)) {
            throw new Error('"query" must be a SyntheticAccountListQuery object.');
        } else {
            if ('customer_uid' in query) {
                if (Array.isArray(query.customer_uid) && query.customer_uid.length > 0) {
                    for (let customerUid of query.customer_uid) {
                        if (!utils.isString(customerUid)){
                            throw new Error('"customer_uid" query must be an array of strings.');
                        }
                    }
                } else {
                    throw new Error('"customer_uid" query must be an array of strings.');
                }
            }
            if ('external_uid' in query && !utils.isString(query.external_uid)) {
                throw new Error('"external_uid" query must be a string.');
            }
            if ('pool_uid' in query) {
                if (Array.isArray(query.pool_uid) && query.pool_uid.length > 0) {
                    for (let poolUid of query.pool_uid) {
                        if (!utils.isString(poolUid)) {
                            throw new Error('"pool_uid" query must be an array of strings.');
                        }
                    }
                } else {
                    throw new Error('"pool_uid" query must be an array of strings.');
                }
            }
            if ('limit' in query && !Number.isInteger(query.limit)) {
                throw new Error('"limit" query must be an integer.');
            }
            if ('offset' in query && !Number.isInteger(query.offset)) {
                throw new Error('"offset" query must be an integer.');
            }
            if ('synthetic_account_type_uid' in query && !utils.isString(query.synthetic_account_type_uid)) {
                throw new Error('"synthetic_account_type_uid" query must be a string.');
            }
            if ('synthetic_account_category' in query && !syntheticAccountCategories.includes(query.synthetic_account_category)) {
                throw new Error(`"synthetic_account_category" query must be a string. Accepted values are: ${syntheticAccountCategories.join(' | ')}`);
            }
            if ('program_uid' in query && !utils.isString(query.program_uid)) {
                throw new Error('"program_uid" query must be a string.');
            }
            if ('liability' in query && !utils.isBoolean(query.liability)) {
                throw new Error('"liability" query must be boolean.');
            }
            if ('sort' in query && !sortOptions.includes(query.sort)) {
                throw new Error(`"sort" query must be a string. Accepted values are: ${sortOptions.join(' | ')}`);
            }
        }
    }
    
    /**
     * @ignore @protected
     * Validates query parameter object for the "getTypesList" method
     * @param {SyntheticAccountTypeListQuery} query 
     */
    _validateGetTypesListQuery(query) {
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a SyntheticAccountTypeListQuery object.');
        }
        if ('program_uid' in query && !utils.isString(query.program_uid)) {
            throw new Error('"program_uid" must be a string.');
        }
        if ('limit' in query && !Number.isInteger(query.limit)) {
            throw new Error('"limit" query must be an integer.');
        }
        if ('offset' in query && !Number.isInteger(query.offset)) {
            throw new Error('"offset" query must be an integer.');
        }
    }

    /**
     * List Synthetic Accounts 
     * @param {SyntheticAccountListQuery} query 
     * @returns {Promise<RizeList<SyntheticAccount>>} A promise that returns the Synthetic Account list if resolved.
     * @example
     * const customer = await rize.syntheticAccount.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     external_uid: 'external_uid',
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     synthetic_account_type_uid: 'synthetic_account_type_uid',
     *     synthetic_account_category: 'general',
     *     program_uid: 'program_uid',
     *     liability: true,
     *     sort: 'name_asc'
     * });
     */
    async getList(query={}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'external_uid',
            'pool_uid',
            'limit',
            'offset',
            'synthetic_account_type_uid',
            'synthetic_account_category',
            'liability',
            'sort',
        ];
        
        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/synthetic_accounts/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Get a single Synthetic account
     * 
     * Retrieve a single Synthetic Account resource along with supporting details and account balances
     * @param {string} uid - Rize-generated unique synthetic account id
     * @returns {Promise<SyntheticAccount>} - A promise that returns a SyntheticAccount if resolved.
     * @example const syntheticAccount = await rize.syntheticAccount.get(customerUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/synthetic_accounts/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * 
     * @param {*} name 
     * @param {*} poolUid 
     * @param {*} syntheticAccountTypeUid 
     * @param {*} options 
     */
    // eslint-disable-next-line
    async create(name, poolUid, syntheticAccountTypeUid, options={}) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     * @param {*} name 
     * @param {*} note 
     */
    // eslint-disable-next-line
    async update(uid, name, note) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async archive(uid) {
        // TODO: Implementation
    }

    /**
     * Retrieves a list of Synthetic Account Types filtered by the given parameters.
     * @param {SyntheticAccountTypeListQuery} query - An object containing key value paris for filtering the result.
     * @returns {Promise<RizeList<SyntheticAccountType>>} A promise that returns a Synthetic Account Type List if resolved.
     * @example
     * const syntheticAccountTypes = await rize.syntheticAccount.getTypesList({
     *     program_uid: 'EhrQZJNjCd79LLYq',
     *     limit: 10,
     *     offset: 10
     * });
     */
    async getTypesList(query={}) {
        this._validateGetTypesListQuery(query);

        const allowedParameters = [
            'program_uid',
            'limit',
            'offset'
        ];

        const queryString = utils.toQueryString(query, allowedParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/synthetic_account_types${queryString}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Get a single Synthetic Account Type
     * 
     * Returns a single Synthetic Account Type resource along with supporting details
     * @param {string} uid - Rize-generated unique Synthetic Account Type id
     * @returns {Promise<SyntheticAccountType>} A promise that returns a Synthetic Account Type if resolved.
     * @exampls
     * const syntheticAccountType = await rize.syntheticAccount.getType('EhrQZJNjCd79LLYq');
     */
    async getType(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Synthetic Account Type "uid" is required.');
        }

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/synthetic_account_types/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = SyntheticAccountService;

/**
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccount} SyntheticAccount
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccountListQuery} SyntheticAccountListQuery
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccountType} SyntheticAccountType
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccountTypeListQuery} SyntheticAccountTypeListQuery
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList 
 */
