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
     */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('KYC Document "uid" is required.');
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
     * @ignore @protected
     * Validates the parameters for the "upload" method
     */
    _validateUploadParams(evaluationUid, filename, fileContent, note, type) {
        const types = [
            'contract',
            'license',
            'other',
            'passport',
            'utility'
        ];

        if (validator.isEmpty(evaluationUid, { ignore_whitespace: true })) {
            throw new Error('"evaluationUid" is required.');
        }

        if (validator.isEmpty(filename, { ignore_whitespace: true })) {
            throw new Error('"filename" is required.');
        }

        if (validator.isEmpty(fileContent, { ignore_whitespace: true })) {
            throw new Error('"fileContent" is required.');
        }

        if (validator.isEmpty(note, { ignore_whitespace: true })) {
            throw new Error('"note" is required.');
        }

        if (!types.includes(type)) {
            throw new Error(`Accepted values in the "type" parameter are: ${types.join(' | ')}`);
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
     * Upload a KYC Document for review. This will upload the Document to our KYC partner,
     * and create a record of the Document on the Rize platform. Preferred file types are JPG, PDF, and PNG.
     * @param {string} evaluationUid - A uid referring to the evaluation with which this document is associated
     * @param {string} filename - The name of the file to be uploaded
     * @param {string} fileContent - The contents of the file to be uploaded, base64-encoded.
     * @param {string} note - A note describing this document
     * @param {'contract' | 'license' | 'other' | 'passport' | 'utility'} type
     * @returns {Promise<KYCDocument>} A promise that returns a KYC Document if resolved.
     * @example
     * const kycDocument = await rize.kycDocument.upload(
     *     'evaluation_uid1',
     *     'file_name1',
     *     '<base64 encoded image>',
     *     'note for the document'
     *     'other'
     * );
     */
    async upload(evaluationUid, filename, fileContent, note, type) {
        this._validateUploadParams(evaluationUid, filename, fileContent, note, type);

        const authToken = await this._auth.getToken();
        const response = await this._api.post(
            '/kyc_documents',
            {
                'evaluation_uid': evaluationUid,
                'filename': filename,
                'file_content': fileContent,
                'note': note,
                'type': type
            },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Retrieve metadata for a KYC Document previously uploaded to our KYC partner for evaluation.
     * @param {string} uid - Rize-generated unique KYC Document id
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
