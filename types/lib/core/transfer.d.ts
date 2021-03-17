export = TransferService;
/**
 * The Transfer service class
 */
declare class TransferService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor(api: import('axios').AxiosInstance, auth: import('./auth'));
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /** @ignore @protected */ protected _auth: import("./auth");
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: any): void;
    /**
     * Retrieves a list of Tranfers filtered by the given parameters.
     * @param {TransferListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Transfer>>} A promise that returns a Transfer List if resolved.
     * @example
     * const transfers = await rize.transfer.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     external_uid: 'external_uid1',
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     limit: 50,
     *     offset: 0
     * });
     */
    getList(query?: TransferListQuery): Promise<RizeList<Transfer>>;
}
declare namespace TransferService {
    export { TransferListQuery, Transfer, RizeList };
}
type TransferListQuery = import('./typedefs/transfer.typedefs').TransferListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type Transfer = import('./typedefs/transfer.typedefs').Transfer;
