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
     * 
     * @param {*} query 
     */
    // eslint-disable-next-line
    async getList(query={}) {
        // TODO: Implementation
        const authToken = await this._auth.getToken();

        return authToken;
    }

    /**
     * Get a single Synthetic account
     * 
     * Retrieve a single Synthetic Account resource along with supporting details and account balances
     * @param {string} uid - Rize-generated unique id
     * @returns {Promise<SyntheticAccount>} - A promise that returns a SyntheticAccount if resolved.
     * @example const syntheticAccount = await rize.syntheticAccount.get(customerUid);
     */
    // eslint-disable-next-line
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
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccountType} SyntheticAccountType
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccountTypeListQuery} SyntheticAccountTypeListQuery
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList 
 */
