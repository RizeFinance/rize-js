const validator = require('validator');
const utils = require('../utils');

/**
 * The Product service class.
 */
class ProductService {
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
     * @param {ProductListQuery} query - An object containing key value pair for filtering the results list.
     */
    _validateGetListQuery(query) {
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a ProductListQuery object.');
        } else {
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
            throw new Error('Product "uid" is required.');
        }
    }

    /**
     * Get a single Product
     * @param {string} uid - Rize-generated unique product id
     * @returns {Promise<Product>} - A promise that returns a Product if resolved.
     * @example const product = await rize.product.get(productUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(`/products/${uid}`);

        return response.data;
    }

    /**
     * Retrieves a list of Products filtered by the given parameters.
     * @param {ProductListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Product>>} - A promise that returns a Product list if resolved.
     * @example
     * const productList = await rize.product.getList({
     *     limit: 50,
     *     offset: 0,
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'limit',
            'offset'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const response = await this._api.get(`/products/${queryStr}`);

        return response.data;
    }
}

module.exports = ProductService;

/**
 * @typedef {import('./typedefs/product.typedefs').Product} Product
 * @typedef {import('./typedefs/product.typedefs').ProductListQuery} ProductListQuery
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */
