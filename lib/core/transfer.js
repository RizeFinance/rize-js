const utils = require('../utils');
const validator = require('validator');

/**
 * The Transfer service class
 */
class TransferService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api 
     */
    constructor(api) {
        /** @ignore @protected */ this._api = api;
    }

    /** 
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    _validateGetListQuery(query) {
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a TransferListQuery object.');
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
            if ('limit' in query && !Number.isInteger(query.limit)) {
                throw new Error('"limit" query must be an integer.');
            }
            if ('offset' in query && !Number.isInteger(query.offset)) {
                throw new Error('"offset" query must be an integer.');
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
            throw new Error('Transfer "uid" is required.');
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "init" method
     * @param {*} externalUid 
     * @param {*} sourceSyntheticAccountUid 
     * @param {*} destinationSyntheticAccountUid 
     * @param {*} initiatingCustomerUid 
     * @param {*} usTransferAmount 
     */
    _validateInitParams(
        externalUid,
        sourceSyntheticAccountUid,
        destinationSyntheticAccountUid,
        initiatingCustomerUid,
        usTransferAmount
    ) {
        if (validator.isEmpty(externalUid, { ignore_whitespace: true })) {
            throw new Error('"externalUid" is required.');
        }

        if (validator.isEmpty(sourceSyntheticAccountUid, { ignore_whitespace: true })) {
            throw new Error('"sourceSyntheticAccountUid" is required.');
        }

        if (validator.isEmpty(destinationSyntheticAccountUid, { ignore_whitespace: true })) {
            throw new Error('"destinationSyntheticAccountUid" is required.');
        }

        if (validator.isEmpty(initiatingCustomerUid, { ignore_whitespace: true })) {
            throw new Error('"initiatingCustomerUid" is required.');
        }

        if (validator.isEmpty(usTransferAmount, { ignore_whitespace: true })) {
            throw new Error('"usTransferAmount" is required.');
        }
    }

    /**
     * Retrieves a list of Tranfers filtered by the given parameters. 
     * @param {TransferListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Transfer>>} A promise that returns a Transfer List if resolved.
     * @example
     * const transfers = await rize.transfer.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     external_uid: 'external_uid1',
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     limit: 50,
     *     offset: 0
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'external_uid',
            'pool_uid',
            'synthetic_account_uid',
            'limit',
            'offset',
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const response = await this._api.get(`/transfers/${queryStr}`);

        return response.data;
    }

    /**
     * Get a single Transfer
     * 
     * @param {string} uid - Rize-generated unique Transfer id
     * @returns {Promise<Transfer>} A promise that returns a Transfer if resolved.
     * @example const transfer = await rize.transfer.get(transferUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(`/transfers/${uid}`);

        return response.data;
    }

    /**
     * Attempt to initiate a Transfer between two Synthetic Accounts. Before the Transfer will be initiated, 
     * several checks will be performed to ensure there is sufficient balance in the source account and that 
     * the initiating Customer has all the necessary access to both Synthetic Accounts. Depending on the 
     * Synthetic Account Types involved and the Program configuration, a new Transfer could complete instantly 
     * or take as many as 6 business days.
     * 
     * Note: Rize is working to support any Synthetic Account as the source and destination. Currently, the 
     * only Synthetic Accounts allowed in a Transfer request are:
     * 
     * - two general liability Synthetic Accounts
     * - Master Synthetic Accounts and external Synthetic Accounts
     * @param {string} externalUid - A unique identifier Client supplies. It should be given when creating a new resource and must be unique within the resource type. If the same value is given, no new resource will be created.
     * @param {string} sourceSyntheticAccountUid - Synthetic Account to pull asset from. Must be an active liability or external-type account. Cannot be equal to `destination_synthetic_account_uid`.
     * @param {string} destinationSyntheticAccountUid - Synthetic Account where the asset should land. Must be an active liability or external-type account. Cannot be equal to `source_synthetic_account_uid`.
     * @param {string} initiatingCustomerUid 
     * @param {string} usTransferAmount - The USD amount to transfer.
     * @returns {Promise<Transfer>} A promise that returns a Transfer if resolved.
     * @example
     * const transfer = await rize.transfer.create(
     *     'external_uid1',
     *     'synthetic_account_uid1',
     *     'synthetic_account_uid2',
     *     'customer_uid1',
     *     100
     * );
     */
    async init(
        externalUid,
        sourceSyntheticAccountUid,
        destinationSyntheticAccountUid,
        initiatingCustomerUid,
        usTransferAmount
    ) {
        this._validateInitParams(
            externalUid,
            sourceSyntheticAccountUid,
            destinationSyntheticAccountUid,
            initiatingCustomerUid,
            usTransferAmount
        );

        const response = await this._api.post(
            '/transfers',
            {
                'external_uid': externalUid,
                'source_synthetic_account_uid': sourceSyntheticAccountUid,
                'destination_synthetic_account_uid': destinationSyntheticAccountUid,
                'initiating_customer_uid': initiatingCustomerUid,
                'usd_transfer_amount': usTransferAmount
            }
        );

        return response.data;
    }
}

module.exports = TransferService;

/**
 * @typedef {import('./typedefs/transfer.typedefs').TransferListQuery} TransferListQuery
 * @typedef {import('./typedefs/transfer.typedefs').Transfer} Transfer
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */