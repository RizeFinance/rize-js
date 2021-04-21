const validator = require('validator');
const utils = require('../utils');

/**
 * The Pool service class.
 */
class PoolService {
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
     * @param {PoolListQuery} query - An object containing key value pair for filtering the results list.
     */
    _validateGetListQuery(query) {
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a PoolListQuery object.');
        } else {
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
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
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid 
     */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Pool "uid" is required.');
        }
    }

    /**
     * Get a single Pool
     * @param {string} uid - Rize-generated unique pool id
     * @returns {Promise<Pool>} - A promise that returns a Pool if resolved.
     * @example const pool = await rize.pool.get(poolUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(`/pools/${uid}`);

        return response.data;
    }

    /**
     * Retrieves a list of Pools filtered by the given parameters.
     * @param {PoolListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<PoolList>>} - A promise that returns a Pool list if resolved.
     * @example
     * const poolList = await rize.pool.getList({
     *     customer_uid: ['uKxmLxUEiSj5h4M3', 'y9reyPMNEWuuYSC1'],
     *     external_uid: client-generated-id,
     *     limit: 50,
     *     offset: 0,
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'external_uid',
            'limit',
            'offset'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const response = await this._api.get(`/pools/${queryStr}`);

        return response.data;
    }
}

module.exports = PoolService;

/**
 * @typedef {import('./typedefs/pool.typedefs').Pool} Pool
 * @typedef {import('./typedefs/pool.typedefs').PoolListQuery} PoolListQuery
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */
