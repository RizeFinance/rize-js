const validator = require('validator');
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
     * Validates the parameters for the "view" method
     */
    _validateViewParams(uid, extension) {
        const extensions = [
            'pdf',
            'html',
            'json'
        ];

        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Document "uid" is required.');
        }

        if (!extensions.includes(extension)) {
            throw new Error(`Accepted values in the "extension" query are: ${extensions.join(' | ')}`);
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid 
     */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Document "uid" is required.');
        }
    }

    /** 
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    _validateGetListQuery(query) {
        const scope_types = [
            'customer',
            'synthetic_account',
            'custodial_account'
        ];

        if (!utils.isObject(query)) {
            throw new Error('"query" must be a DocumentListQuery object.');
        } else {
            if ('month' in query && !Number.isInteger(query.month)) {
                throw new Error('"month" query must be an integer.');
            }
            if ('month' in query && (query.month < 1 || query.month > 12)) {
                throw new Error('"month" query value must be from 1 to 12');
            }
            if ('year' in query && !Number.isInteger(query.year)) {
                throw new Error('"year" query must be an integer.');
            }
            if ('scope_type' in query) {
                if (!scope_types.includes(query.scope_type)) {
                    throw new Error(`Accepted values in the "scope_type" query are: ${scope_types.join(' | ')}`);
                }
            }
            if ('custodial_account_uid' in query && !utils.isString(query.custodial_account_uid)) {
                throw new Error('"custodial_account_uid" query must be a string.');
            }
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
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
     * Retrieves a list of Documents filtered by the given parameters. 
     * @param {DocumentListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Document>>} A promise that returns a Document List if resolved.
     * @example
     * const documents = await rize.document.getList({
     *     month: 1,
     *     year: 2021,
     *     scope_type: 'customer',
     *     custodial_account_uid: 'custodial_account_uid1',
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
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

    /**
     * View or download a document
     * 
     * @param {string} uid - Rize-generated unique document id
     * @param {'pdf' | 'html' | 'json'} extension - the type of file to download.
     * @returns {Promise<HTTPResponse>} A promise that returns a downloaded Document if resolved.
     * @example const document = await rize.document.view(documentUid, 'pdf');
     */
    async view(uid, extension = 'pdf') {
        this._validateViewParams(uid, extension);
        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/documents/${uid}/view.${extension}`,
            {
                headers: { 'Authorization': authToken },
                responseType: 'arraybuffer'
            }
        );

        return {
            data: response.data,
            headers: response.headers
        };
    }

    /**
     * View or download a base64-encoded document (image, PDF, etc)
     * @param {string} uid - Rize-generated unique Document id
     * @returns {Promise<string>} A promise that returns a base64-encoded Document string if resolved.
     * @example const document = await rize.document.viewBase64(documentUid);
     */
    async viewBase64(uid, extension = 'pdf') {
        this._validateViewParams(uid, extension);
        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/documents/${uid}/view.${extension}`,
            {
                headers: { 'Authorization': authToken },
                responseType: 'arraybuffer'
            }
        );

        return Buffer.from(response.data, 'binary').toString('base64');
    }

    /**
     * Get a single Document
     * 
     * @param {string} uid - Rize-generated unique document id
     * @returns {Promise<Document>} A promise that returns a Document if resolved.
     * @example const document = await rize.document.get(documentUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/documents/${uid}`,
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

/**
 * @template T @typedef {import('./typedefs/common.typedefs').HTTPResponse<T>} HTTPResponse
 */ 