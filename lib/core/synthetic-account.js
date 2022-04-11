const validator = require('validator');
const utils = require('../utils');

/**
 * The Synthetic Account service class.
 */
class SyntheticAccountService {
    /** 
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     */
    constructor(api) {
        /** @ignore @protected */ this._api = api;
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
     * @ignore @protected
     * Validates the parameters for the "getList" method
     */
    _validateGetListQuery(query) {
        const syntheticAccountCategories = ['general', 'external', 'plaid_external', 'outbound_ach'];
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
                        if (!utils.isString(customerUid)) {
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
     * Validates payload parameter object for the "create" method
     */
    _validateCreateParams(request) {

        if (validator.isEmpty(request.external_uid, { ignore_whitespace: true })) {
            throw new Error('Create Synthetic Account "external_uid" is required.');
        }

        if (validator.isEmpty(request.name, { ignore_whitespace: true })) {
            throw new Error('Create Synthetic Account "name" is required.');
        }

        if (validator.isEmpty(request.pool_uid, { ignore_whitespace: true })) {
            throw new Error('Create Synthetic Account "pool_uid" is required.');
        }

        if (validator.isEmpty(request.synthetic_account_type_uid, { ignore_whitespace: true })) {
            throw new Error('Create Synthetic Account "synthetic_account_type_uid" is required.');
        }
    }

    /**
     * @ignore @protected
     * Validates query parameter object for the "getTypesList" method
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
     */
    _validateUpdateParams(uid, name) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Synthetic Account "uid" is required.');
        }
        if (validator.isEmpty(name, { ignore_whitespace: true })) {
            throw new Error('Synthetic Account "name" is required.');
        }
    }


    /**
     * List Synthetic Accounts 
     * @param {SyntheticAccountListQuery} query - An object containing key value paris for filtering the result.
     * @returns {Promise<RizeList<SyntheticAccount>>} A promise that returns the Synthetic Account list if resolved.
     * @example
     * const syntheticAccounts = await rize.syntheticAccount.getList({
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
    async getList(query = {}) {
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

        const response = await this._api.get(`/synthetic_accounts/${queryStr}`);

        return response.data;
    }

    /**
     * Get a single Synthetic account
     * 
     * Retrieve a single Synthetic Account resource along with supporting details and account balances
     * @param {string} uid - Rize-generated unique synthetic account id
     * @returns {Promise<SyntheticAccount>} - A promise that returns a SyntheticAccount if resolved.
     * @example const syntheticAccount = await rize.syntheticAccount.get(syntheticAccountUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(`/synthetic_accounts/${uid}`);

        return response.data;
    }

    /**
     * @param {SyntheticAccountCreateRequest} payload
     * @returns {Promise<SyntheticAccount>} A promise that returns a SyntheticAccount if resolved.
     * @example
     * const syntheticAccountTypes = await rize.syntheticAccount.create({
     *     external_uid: 'partner-generated-id',
     *     name: 'Spinach Fund',
     *     pool_uid: 'wTSMX1GubP21ev2h',
     *     synthetic_account_type_uid: 'fRMwt6H14ovFUz1s'
     * });
     */
    async create(payload) {
        this._validateCreateParams(payload);
        const newRequest = {
            external_uid: payload.external_uid,
            name: payload.name,
            pool_uid: payload.pool_uid,
            synthetic_account_type_uid: payload.synthetic_account_type_uid,
            account_number: payload.account_number,
            routing_number: payload.routing_number,
            plaid_processor_token: payload.plaid_processor_token
        };

        const response = await this._api.post(
            '/synthetic_accounts',
            newRequest
        );

        return response.data;
    }

    /**
     * Enables Synthetic Account name changes for all Synthetic Accounts, including the Master Synthetic Account. 
     * The Master Synthetic Account remains identifiable by the master_account flag stored with the Synthetic Account record.
     * @param {string} uid - Rize-generated unique Synthetic Account id
     * @param {string} name - A unique name to identify the resource
     * @param {string} [note] - A reason for the Synthetic Account name change
     * @returns {Promise<SyntheticAccount>} A promise that returns a Synthetic Account if resolved.
     * @example
     * const syntheticAccountTypes = await rize.syntheticAccount.update({
     *     uid: 'EhrQZJNjCd79LLYq',
     *     name: 'New Resource Name',
     *     note: 'new note'
     * });
     */
    async update(uid, name, note) {
        this._validateUpdateParams(uid, name, note);

        const response = await this._api.put(
            `/synthetic_accounts/${uid}`,
            { name, note }
        );

        return response.data;
    }

    /**
     * In order to archive a Synthetic Account, the account must:
     * - belong to a general Synthetic Account Type
     * - not be a Master Synthetic Account i.e. master_account must be false
     * - have zero balance
     * - have no pending Transfers
     * Master Synthetic Accounts are archived when the Program Customer is archived (customer.archive()). 
     * External Synthetic Accounts cannot be archived through syntheticAccount.archive(). 
     * For on overview of how to archive an external Synthetic Account, please contact your Rize account manager.
     * @param {string} uid - Rize-generated unique Synthetic Account id
     * @returns {Promise<void>} A promise that returns void if resolved.
     * @example
     * await rize.syntheticAccount.archive(syntheticAccountUid);
     */
    async archive(uid) {
        this._validateArchiveParams(uid);

        await this._api.delete(`/synthetic_accounts/${uid}`);
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
    async getTypesList(query = {}) {
        this._validateGetTypesListQuery(query);

        const allowedParameters = [
            'program_uid',
            'limit',
            'offset'
        ];

        const queryString = utils.toQueryString(query, allowedParameters);

        const response = await this._api.get(`/synthetic_account_types${queryString}`);

        return response.data;
    }

    /**
     * Get a single Synthetic Account Type
     * 
     * Returns a single Synthetic Account Type resource along with supporting details
     * @param {string} uid - Rize-generated unique Synthetic Account Type id
     * @returns {Promise<SyntheticAccountType>} A promise that returns a Synthetic Account Type if resolved.
     * @example
     * const syntheticAccountType = await rize.syntheticAccount.getType('EhrQZJNjCd79LLYq');
     */
    async getType(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Synthetic Account Type "uid" is required.');
        }

        const response = await this._api.get(`/synthetic_account_types/${uid}`);

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
