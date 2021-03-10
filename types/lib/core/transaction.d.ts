export = TransactionService;
/**
 * The Transaction service class
 */
declare class TransactionService {
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
     * Retrieves a list of Transactions filtered by the given parameters.
     * @param {TransactionListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Transaction>>} A promise that returns a Transaction List if resolved.
     */
    getList(query?: TransactionListQuery): Promise<RizeList<Transaction>>;
}
declare namespace TransactionService {
    export { TransactionListQuery, Transaction, RizeList };
}
type TransactionListQuery = import('./typedefs/transaction.typedefs').TransactionListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type Transaction = import('./typedefs/transaction.typedefs').Transaction;
