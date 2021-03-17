const utils = require('../utils');
const validator = require('validator');

/**
 * The Debit Card service class
 */
class DebitCardService {
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
        const statuses = [
            'queued',
            'issued',
            'printing_physical_card',
            'printing_physical_card_replacement',
            'card_replacement_shipped',
            'shipped',
            'usable_without_pin',
            'normal',
            'closed',
            'damaged',
            'lost',
            'stolen',
            'administrative_lock',
            'closed_by_administrator',
            'card_replacement_shipment_returned',
            'shipment_returned'
        ];

        if (!utils.isObject(query)) {
            throw new Error('"query" must be a DebitCardListQuery object.');
        } else {
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
            }
            if ('pool_uid' in query && !Array.isArray(query.pool_uid)) {
                throw new Error('"pool_uid" query must be an array.');
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
            if ('locked' in query && !utils.isBoolean(query.locked)) {
                throw new Error('"locked" query must be boolean.');
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
            throw new Error('Debit Card "uid" is required.');
        }
    }

    /**
     * Retrieves a list of Debit Cards filtered by the given parameters. 
     * @param {DebitCardListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<DebitCard>>} A promise that returns a Debit Card List if resolved.
     * @example
     * const debitCards = await rize.debitCard.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     external_uid: 'external_uid1',
     *     limit: 50,
     *     offset: 0,
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     locked: false,
     *     status: ['queued', 'issued']
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'external_uid',
            'limit',
            'offset',
            'pool_uid',
            'locked',
            'status'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/debit_cards/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Get a single Debit Card
     * 
     * @param {string} uid - Rize-generated unique debitCard id
     * @returns {Promise<DebitCard>} A promise that returns a Debit Card if resolved.
     * @example const debitCard = await rize.debitCard.get(debitCardUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/debit_cards/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = DebitCardService;

/**
 * @typedef {import('./typedefs/debit-card.typedefs').DebitCardListQuery} DebitCardListQuery
 * @typedef {import('./typedefs/debit-card.typedefs').DebitCard} DebitCard
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */