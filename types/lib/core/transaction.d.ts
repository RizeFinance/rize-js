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
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "getSyntheticLineItem" method
     * @param {string} uid
     */
    protected _validateGetSyntheticLineItemParams(uid: string): void;
    /**
     * @ignore @protected
     * Validates query parameter object for getSyntheticLineItemList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetSyntheticLineItemListQuery(query: any): void;
    /**
     * @ignore @protected
     * Validates query parameter object for getCustodialLineItemList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetCustodialLineItemListQuery(query: any): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "getCustodialLineItem" method
     * @param {string} uid
     */
    protected _validateGetCustodialLineItemParams(uid: string): void;
    /**
     * Retrieves a list of Transactions filtered by the given parameters.
     * @param {TransactionListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Transaction>>} A promise that returns a Transaction List if resolved.
     * @example
     * const transactions = await rize.transaction.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     source_synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     destination_synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     type: ['internal_transfer'],
     *     limit: 50,
     *     offset: 0,
     *     search_description: 'Transfer*',
     *     status: ['settled'],
     *     sort: 'created_at_asc'
     * });
     */
    getList(query?: TransactionListQuery): Promise<RizeList<Transaction>>;
    /**
     * Get a single Transaction
     *
     * @param {string} uid - Rize-generated unique transaction id
     * @returns {Promise<Transaction>} A promise that returns a Transaction if resolved.
     * @example const transaction = await rize.transaction.get(transactionUid);
     */
    get(uid: string): Promise<Transaction>;
    /**
     * Retrieves a list of Synthetic Line Items filtered by the given parameters.
     * @param {SyntheticLineItemListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<SyntheticLineItem>>} A promise that returns a Synthetic Line Item List if resolved.
     * @example
     * const syntheticLineItems = await rize.transaction.getSyntheticLineItemList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     transaction_uid: ['transaction_uid1', 'transaction_uid2'],
     *     status: ['settled'],
     *     sort: 'created_at_asc'
     * });
     */
    getSyntheticLineItemList(query?: SyntheticLineItemListQuery): Promise<RizeList<SyntheticLineItem>>;
    /**
     * Get a single Synthetic Line Item
     *
     * @param {string} uid - Rize-generated unique Synthetic Line Item id
     * @returns {Promise<SyntheticLineItem>} A promise that returns a Synthetic Line Item if resolved.
     * @example const syntheticLineItem = await rize.transaction.getSyntheticLineItem(syntheticLineItemUid);
     */
    getSyntheticLineItem(uid: string): Promise<SyntheticLineItem>;
    /**
     *
     * @param {CustodialLineItemListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<CustodialLineItem>>} A promise that returns a Custodial Line Item List if resolved.
     * @example
     * const custodialLineItems = await rize.transaction.getCustodialLineItemList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     custodial_account_uid: ['custodial_account_uid1', 'custodial_account_uid2'],
     *     status: ['settled'],
     *     us_dollar_amount_max: 100,
     *     us_dollar_amount_min: 10,
     *     transaction_event_uid: ['transaction_event_uid1', 'transaction_event_uid2'],
     *     transaction_uid: ['transaction_uid1', 'transaction_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     sort: 'created_at_asc'
     * });
     */
    getCustodialLineItemList(query?: CustodialLineItemListQuery): Promise<RizeList<CustodialLineItem>>;
    /**
     * Get a single Custodial Line Item
     *
     * @param {string} uid - Rize-generated unique Custodial Line Item id
     * @returns {Promise<CustodialLineItem>} A promise that returns a Custodial Line Item if resolved.
     * @example const custodialLineItem = await rize.transaction.getCustodialLineItem(custodialLineItemUid);
     */
    getCustodialLineItem(uid: string): Promise<CustodialLineItem>;
}
declare namespace TransactionService {
    export { TransactionListQuery, Transaction, SyntheticLineItemListQuery, SyntheticLineItem, CustodialLineItemListQuery, CustodialLineItem, RizeList };
}
type TransactionListQuery = import('./typedefs/transaction.typedefs').TransactionListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type Transaction = import('./typedefs/transaction.typedefs').Transaction;
type SyntheticLineItemListQuery = import('./typedefs/transaction.typedefs').SyntheticLineItemListQuery;
type SyntheticLineItem = import('./typedefs/transaction.typedefs').SyntheticLineItem;
type CustodialLineItemListQuery = import('./typedefs/transaction.typedefs').CustodialLineItemListQuery;
type CustodialLineItem = import('./typedefs/transaction.typedefs').CustodialLineItem;
