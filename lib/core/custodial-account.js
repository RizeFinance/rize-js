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
     * @returns {Promise<CustomerList>} - A promise that returns a Customer List if resolved.
     * @example
     * const customerList = await rize.customer.getList({
     *     status: 'initiated',
     *     include_initiated: true,
     *     kyc_status: 'approved'.
     *     first_name: 'John',
     *     last_name: 'Cena',
     *     email: 'test@test.com',
     *     locked: false,
     *     program_uid: 'program_uid',
     *     external_uid: 'external_uid',
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     sort: 'first_name_asc'
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'exeternal_uid',
            'limit',
            'offset',
            'sort',
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
 */