const utils = require('../utils');

/**
 * The Document service class
 */
class DocumentService {
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
    

    /**
     * Retrieves a list of Documents filtered by the given parameters. 
     * @param {DocumentListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Document>>} A promise that returns a Document List if resolved.
     * @example
     * const documents = await rize.document.getList({
     *     month: ['customer_uid1', 'customer_uid2'],
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
            'month',
            'year',
            'scope_type',
            'custodial_account_uid',
            'customer_uid',
            'synthetic_account_uid',
            'limit',
            'offset'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/documents/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = DocumentService;

/**
 * @typedef {import('./typedefs/document.typedefs').DocumentListQuery} DocumentListQuery
 * @typedef {import('./typedefs/document.typedefs').Document} Document
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */ 