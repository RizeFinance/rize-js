export = CustomerProductService;
/**
 * The Customer Product service class.
 */
declare class CustomerProductService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     */
    constructor(api: import('axios').AxiosInstance);
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {CustomerProductListQuery} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: CustomerProductListQuery): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "create" method
     * @param {string} customerUid
     * @param {string} productUid
     */
    protected _validateCreateParams(customerUid: string, productUid: string): void;
    /**
     * Get a single Customer Product
     * @param {string} uid - Rize-generated unique customer product id
     * @returns {Promise<CustomerProduct>} - A promise that returns a Customer Product if resolved.
     * @example const customerProduct = await rize.customerProduct.get(customerProductUid);
     */
    get(uid: string): Promise<CustomerProduct>;
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
    getList(query?: CustomerProductListQuery): Promise<RizeList<CustomerProduct>>;
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
    create(customerUid: string, productUid: string): Promise<CustomerProduct>;
}
declare namespace CustomerProductService {
    export { CustomerProduct, CustomerProductListQuery, RizeList };
}
type CustomerProductListQuery = import('./typedefs/customer-product.typedefs').CustomerProductListQuery;
type CustomerProduct = import('./typedefs/customer-product.typedefs').CustomerProduct;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
