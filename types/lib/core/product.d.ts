export = ProductService;
/**
 * The Product service class.
 */
declare class ProductService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     */
    constructor(api: import('axios').AxiosInstance);
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {ProductListQuery} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: ProductListQuery): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * Get a single Product
     * @param {string} uid - Rize-generated unique product id
     * @returns {Promise<Product>} - A promise that returns a Product if resolved.
     * @example const product = await rize.product.get(productUid);
     */
    get(uid: string): Promise<Product>;
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
    getList(query?: ProductListQuery): Promise<RizeList<Product>>;
}
declare namespace ProductService {
    export { Product, ProductListQuery, RizeList };
}
type ProductListQuery = import('./typedefs/product.typedefs').ProductListQuery;
type Product = import('./typedefs/product.typedefs').Product;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
