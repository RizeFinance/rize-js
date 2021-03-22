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
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('"uid" is required.');
        }
    }

    /**
     * @ignore @protected
     * Validates parameters for the getList method.
     */
    _validateGetListParams(evaluationUid) {
        if (validator.isEmpty(evaluationUid, { ignore_whitespace: true })) {
            throw new Error('"evaluationUid" is required.');
        }
    }

    /**
     * Retrieves KYC Documents for a given evaluation.
     * @param {string} evaluationUid - An object containing key value pair for getting the results list.
     * @returns {Promise<RizeList<KYCDocument>>} A promise that returns a List of KYC Documents if resolved.
     * @example
     * const kycDocuments = await rize.kycDocument.getList('QSskNJkryskRXeYt');
     */
    async getList(evaluationUid) {
        this._validateGetListParams(evaluationUid);
        const queryParameters = [
            'evaluation_uid'
        ];

        const queryStr = utils.toQueryString({ evaluation_uid: evaluationUid }, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/kyc_documents/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Retrieve metadata for a KYC Document previously uploaded to our KYC partner for evaluation.
     * @param {string} uid - Rize-generated unique id
     * @returns {Promise<KYCDocument>} A promise that returns a KYC Document Metadata if resolved.
     * @example const kycDocumentMetadata = await rize.kycDocument.getMetadata(kycDocumentUid);
     */
    async getMetadata(uid) {
        this._validateGetParams(uid);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/kyc_documents/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = KYCDocumentService;

/**
 * @typedef {import('./typedefs/kyc-document.typedefs').KYCDocument} KYCDocument
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */
