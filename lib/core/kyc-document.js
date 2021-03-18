const utils = require('../utils');
const validator = require('validator');

/**
 * The KYC Document service class
 */
class KYCDocumentService {
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
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a KYCDocumentListQuery object.');
        } else {
            if (!('evaluation_uid' in query) || !utils.isString(query.evaluation_uid) || validator.isEmpty(query.evaluation_uid)) {
                throw new Error('"evaluation_uid" query must be a string.');
            }
        }
    }

    /**
     * Retrieves KYC Documents for a given evaluation.
     * @param {KYCDocumentListQuery} query - An object containing key value pair for getting the results list.
     * @returns {Promise<RizeList<KYCDocument>>} A promise that returns a List of KYC Documents if resolved.
     * @example
     * const kycDocuments = await rize.kycDocument.getList({
     *     evaluation_uid: 'QSskNJkryskRXeYt'
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'evaluation_uid'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/kyc_documents/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = KYCDocumentService;

/**
 * @typedef {import('./typedefs/kyc-document.typedefs').KYCDocumentListQuery} KYCDocumentListQuery
 * @typedef {import('./typedefs/kyc-document.typedefs').KYCDocument} KYCDocument
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */
