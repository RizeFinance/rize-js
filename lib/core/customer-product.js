const validator = require('validator');
const utils = require('../utils');

/**
 * The Customer Product service class.
 */
class CustomerProductService {
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
     * @param {CustomerProductListQuery} query - An object containing key value pair for filtering the results list.
     */
    _validateGetListQuery(query) {
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a CustomerProductListQuery object.');
        } else {
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
            }

            if ('product_uid' in query && (!utils.isString(query.product_uid) || validator.isEmpty(query.product_uid))) {
                throw new Error('"product_uid" query must be a string.');
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
            throw new Error('Customer Product "uid" is required.');
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "create" method
     * @param {string} customerUid 
     * @param {string} productUid 
     */
    _validateCreateParams(customerUid, productUid) {
        if (validator.isEmpty(customerUid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }

        if (validator.isEmpty(productUid, { ignore_whitespace: true })) {
            throw new Error('Product "uid" is required.');
        }
    }

    /**
     * Get a single Customer Product
     * @param {string} uid - Rize-generated unique customer product id
     * @returns {Promise<CustomerProduct>} - A promise that returns a Customer Product if resolved.
     * @example const customerProduct = await rize.customerProduct.get(customerProductUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(`/customer_products/${uid}`);

        return response.data;
    }

    /**
     * Retrieves a list of Customer Products filtered by the given parameters.
     * @param {CustomerProductListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<CustomerProduct>>} - A promise that returns a Customer Product list if resolved.
     * @example
     * const customerProductList = await rize.customerProduct.getList({
     *     customer_uid: customerUid,
     *     limit: 50,
     *     offset: 0,
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'product_uid',
            'customer_uid',
            'limit',
            'offset'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const response = await this._api.get(`/customer_products/${queryStr}`);

        return response.data;
    }

    /**
     * Creates a new instance of a customer product. This will verify that all Product requirements have been met,
     * including confirming all the required PII has been provided and necessary compliance workflow, if any,
     * has been completed.
     * After completion, Rize will automatically kick off the KYC process if it is the customer's first product.
     * Upon KYC approval, all required custodial accounts will be created and the customer will be active.
     * @param {string} customerUid - A UID referring to the Customer.
     * @param {string} productUid - A UID referring to the Product.
     * @returns {Promise<CustomerProduct>} - A promise that returns a Customer Product if resolved.
     * @example
     * const customerProduct = await rize.customerProduct.create({
     *     customer_uid: customer123,
     *     product_uid: product123
     * });
     */
    async create(customerUid, productUid) {
        this._validateCreateParams(customerUid, productUid);

        const response = await this._api.post(
            '/customer_products',
            {
                'customer_uid': customerUid,
                'product_uid': productUid
            }
        );

        return response.data;
    }
}

module.exports = CustomerProductService;

/**
 * @typedef {import('./typedefs/customer-product.typedefs').CustomerProduct} CustomerProduct
 * @typedef {import('./typedefs/customer-product.typedefs').CustomerProductListQuery} CustomerProductListQuery
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */
