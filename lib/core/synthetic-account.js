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
     * @ignore @protected
     * Validates the parameters for the "archive" method
     * @param {string} uid 
     */
    _validateArchiveParams(uid) {
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
     * @ignore @protected
     * Validates query parameter object for the "getTypesList" method
     * @param {SyntheticAccountTypeListQuery} query 
     */
    _validateUpdateParams(uid, name, note) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Synthetic Account "uid" is required.');
        }
        if (validator.isEmpty(name, { ignore_whitespace: true })) {
            throw new Error('Name is required.');
        }
        if (validator.isEmpty(note, { ignore_whitespace: true })) {
            throw new Error('Note is required.');
        }
    }


    /**
     * 
     * @param {*} query 
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
     * @ignore @protected
     * Validates payload parameter object for the "create" method
     * @param {SyntheticAccountCreateRequest} request
     */
    _validateCreateParams(request) {

        if (validator.isEmpty(request.externalUid, { ignore_whitespace: true })) {
            throw new Error('Create Synthetic Account "externalUid" is required.');
        }

        if (validator.isEmpty(request.name, { ignore_whitespace: true })) {
            throw new Error('Create Synthetic Account "name" is required.');
        }

        if (validator.isEmpty(request.poolUid, { ignore_whitespace: true })) {
            throw new Error('Create Synthetic Account "poolUid" is required.');
        }

        if (validator.isEmpty(request.syntheticAccountTypeUid, { ignore_whitespace: true })) {
            throw new Error('Create Synthetic Account "syntheticAccountTypeUid" is required.');
        }
    }

    /**
     * @param {SyntheticAccountCreateRequest} payload - is an JSON object needs to send as body parameters in order to create new synthetic accounts.
     * @returns {Promise<RizeList<SyntheticAccount>>}
     * @example
     * const syntheticAccountTypes = await rize.syntheticAccount.getTypesList({
     *     name: 'Spinach Fund',
     *     poolUid: 'wTSMX1GubP21ev2h',
     *     syntheticAccountTypeUid: 'fRMwt6H14ovFUz1s'
     * });
     */

    async create(payload) {
        this._validateCreateParams(payload);
        const newRequest = {
            external_uid: payload.externalUid,
            name: payload.name,
            pool_uid: payload.poolUid,
            synthetic_account_type_uid: payload.syntheticAccountTypeUid,
            account_number: payload.accountNumber,
            routing_number: payload.routingNumber
        };

        const authToken = await this._auth.getToken();

        const response = await this._api.post(
            '/synthetic_accounts',
            newRequest,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Enables Synthetic Account name changes for all Synthetic Accounts, including the Master Synthetic Account. 
     * The Master Synthetic Account remains identifiable by the master_account flag stored with the Synthetic Account record.
     * @param {*} uid {string} uid - Rize-generated unique Synthetic Account id
     * @param {*} name {string} A unique name to identify the resource
     * @param {*} note {string} A reason for the Synthetic Account name change
     * @returns {Promise<SyntheticAccount>} A promise that returns a Synthetic Account if resolved.
     * @example
     * const syntheticAccountTypes = await rize.syntheticAccount.update({
     *     uid: 'EhrQZJNjCd79LLYq',
     *     name: 'New Resource Name',
     *     note: 'new note'
     * });
     */
    // eslint-disable-next-line
    async update(uid, name, note) {
        this._validateUpdateParams(uid, name, note);

        const authToken = await this._auth.getToken();

        const response = await this._api.put(
            `/synthetic_accounts/${uid}`,
            { name, note },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * In order to archive a Synthetic Account, the account must:
     * - belong to a general Synthetic Account Type
     * - not be a Master Synthetic Account i.e. master_account must be false
     * - have zero balance
     * - have no pending Transfers
     * Master Synthetic Accounts are archived when the Program Customer is archived (DELETE /customers/:uid). 
     * External Synthetic Accounts cannot be archived through DELETE /synthetic_accounts/:uid. 
     * For on overview of how to archive an external Synthetic Account, please contact your Rize account manager.
     * @param {*} uid {string} uid - Rize-generated unique Synthetic Account id
     * @returns {Promise<void>} A promise that returns void if resolved.
     * @example
     * await rize.syntheticAccount.archive(syntheticAccountUid);
     */
    async archive(uid) {
        this._validateArchiveParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.delete(
            `/synthetic_accounts/${uid}`,
            { headers: { 'Authorization': authToken } }
        );
            
        return response.data;
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
 * @typedef {import('./typedefs/synthetic-account.typedefs').SyntheticAccountCreateRequest} SyntheticAccountCreateRequest
 * 
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList 
 */
