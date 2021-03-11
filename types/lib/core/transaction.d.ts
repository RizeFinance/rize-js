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
     * @ignore @protected
     * Validates query parameter object for getSyntheticLineItemList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetSyntheticLineItemListQuery(query: any): void;
    /**
     * Retrieves a list of Transactions filtered by the given parameters.
     * @param {TransactionListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Transaction>>} A promise that returns a Transaction List if resolved.
     */
    getList(query?: TransactionListQuery): Promise<RizeList<Transaction>>;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * Get a single Transaction
     *
     * @param {string} uid - Rize-generated unique transaction id
     * @returns {Promise<Transaction>} - A promise that returns a Transaction if resolved.
     * @example const transaction = await rize.Transaction.get(transactionUid);
     */
    get(uid: string): Promise<Transaction>;
}
declare namespace TransactionService {
    export { TransactionListQuery, Transaction, SyntheticLineItemListQuery, SyntheticLineItem, RizeList };
}
type TransactionListQuery = import('./typedefs/transaction.typedefs').TransactionListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type Transaction = import('./typedefs/transaction.typedefs').Transaction;
type SyntheticLineItemListQuery = import('./typedefs/transaction.typedefs').SyntheticLineItemListQuery;
type SyntheticLineItem = import('./typedefs/transaction.typedefs').SyntheticLineItem;
