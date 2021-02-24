const validator = require('validator');
const querystring = require('query-string');
const utils = require('../utils');

class CustodialAccountService {
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
     * @param {CustodialAccountListQuery} query - An object containing key value pair for filtering the results list.
     */
    _validateGetListQuery(query) {
        const types = [
            'dda',
            'dda_cash_external',
            'dda_cash_received',
        ];
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a CustodialAccountListQuery object.');
        } else {
            if ('customer_uid' in query && validator.isEmpty(query.customer_uid)) {
                throw new Error('"customer_uid" query should not be empty.');
            }

            if ('external_uid' in query && (!utils.isString(query.external_uid) || validator.isEmpty(query.external_uid))) {
                throw new Error('"external_uid" query must be a string.');
            }

            if ('limit' in query && !Number.isInteger(query.limit)) {
                throw new Error('"limit" query must be an integer.');
            }

            if ('offset' in query && !Number.isInteger(query.offset)) {
                throw new Error('"offset" query must be an integer.');
            }

            if ('liability' in query && !validator.isBoolean(query.liability)) {
                throw new Error('"liability" query must be a boolean. Accepted values are: true or false');
            }

            if ('type' in query && !validator.isIn(query.type, types)) {
                throw new Error(`"type" query must be a string. Accepted values are: ${types.join(' | ')}`);
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
            throw new Error('Customer "uid" is required.');
        }
    }

    /**
     * Get a single Custodial Account
     * 
     * Returns a single Custodial Account resource along with supporting details and account balances
     * @param {string} uid - Rize-generated unique customer id
     * @returns {Promise<CustodialAccount>} - A promise that returns a Custodial Account if resolved.
     * @example const customer = await rize.customer.get(customerUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/custodial_accounts/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Retrieves a list of Custodial Accounts filtered by the given parameters. 
     * Filter parameters are not case sensitive, but will only return exact matches. 
     * Multiple filter parameters can be provided at once, but a result will not be returned unless there are exact matches for all submitted parameters.
     * @param {CustomerListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<CustodialAccountList>>} - A promise that returns a Custodial Account List if resolved.
     * @example
     * const custodialAccountList = await rize.custodialAccount.getList({
     *     customer_uid: ['uKxmLxUEiSj5h4M3', 'y9reyPMNEWuuYSC1'],
     *     external_uid: client-generated-id,
     *     limit: 50,
     *     offset: 0,
     *     liability: false,
     *     type: ['data']
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'exeternal_uid',
            'limit',
            'offset',
            'liability',
            'type'
        ];

        const filteredQuery = Object.keys(query)
            .filter(key => queryParameters.includes(key))
            .reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: query[key]
                };
            }, {});
        let queryStr = '?' + querystring.stringify(filteredQuery, { arrayFormat: 'bracket' });

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/custodial_accounts/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = CustodialAccountService;

/**
 * @typedef {import('./typedefs/customer.typedefs').CustodialAccount} CustodialAccount
 * @typedef {import('./typedefs/customer.typedefs').CustodialAccountListQuery} CustodialAccountListQuery
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList 
 */
