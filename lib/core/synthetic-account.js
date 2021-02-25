const querystring = require('query-string');
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
     * List Synthetic Accounts 
     * @param {SyntheticAccountListQuery} query 
     * @returns {Promise<RizeList<SyntheticAccount>>} A promise that returns the unlocked Customer if resolved.
     * @example
     * const customer = await rize.customer.getList({
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
        
        const filteredQuery = utils.filterObjectByKeys(query, queryParameters);
        const queryStr = '?' + querystring.stringify(filteredQuery, { arrayFormat: 'bracket' });

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/synthetic_accounts/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async get(uid) {
        // TODO: Implementation
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
     * 
     * @param {*} query 
     */
    // eslint-disable-next-line
    async getTypesList(query={}) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async getType(uid) {
        // TODO: Implementation
    }
}

module.exports = SyntheticAccountService;

/**
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccount} SyntheticAccount
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccountListQuery} SyntheticAccountListQuery
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList 
 */