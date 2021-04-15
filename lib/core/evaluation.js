const validator = require('validator');
const utils = require('../utils');

/**
 * The Evaluation service class
 */
class EvaluationService {
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
     */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Evaluation "uid" is required.');
        }
    }

    /** 
     * @ignore @protected
     * Validates query parameter object for getList method.
     */
    _validateGetListQuery(query) {
        if (!utils.isObject(query)) {
            throw new Error('"query" must be an EvaluationListQuery object.');
        } else {
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
            }
            if ('latest' in query && !utils.isBoolean(query.latest)) {
                throw new Error('"latest" query must be a boolean.');
            }
        }
    }


    /**
     * Retrieves a list of Evaluation filtered by the given parameters. 
     * @param {EvaluationListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Evaluation>>} A promise that returns an Evaluation List if resolved.
     * @example
     * const evaluations = await rize.evaluation.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     latest: true
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'latest',
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const response = await this._api.get(`/evaluations/${queryStr}`);

        return response.data;
    }

    /**
     * Get a single Evaluation
     * 
     * @param {string} uid - Rize-generated unique evaluation id
     * @returns {Promise<Evaluation>} A promise that returns an Evaluation if resolved.
     * @example const evaluation = await rize.evaluation.get(evaludationUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(`/evaluations/${uid}`);

        return response.data;
    }
}

module.exports = EvaluationService;

/**
 * @typedef {import('./typedefs/evaluation.typedefs').EvaluationListQuery} EvaluationListQuery
 * @typedef {import('./typedefs/evaluation.typedefs').Evaluation} Evaluation
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */ 