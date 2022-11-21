export = TransferService;
/**
 * The Transfer service class
 */
declare class TransferService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     */
    constructor(api: import('axios').AxiosInstance);
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
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
     * Validates the parameters for the "init" method
     * @param {*} externalUid
     * @param {*} sourceSyntheticAccountUid
     * @param {*} destinationSyntheticAccountUid
     * @param {*} initiatingCustomerUid
     * @param {*} usTransferAmount
     */
    protected _validateInitParams(externalUid: any, sourceSyntheticAccountUid: any, destinationSyntheticAccountUid: any, initiatingCustomerUid: any, usTransferAmount: any): void;
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
    /**
     * Get a single Transfer
     *
     * @param {string} uid - Rize-generated unique Transfer id
     * @returns {Promise<Transfer>} A promise that returns a Transfer if resolved.
     * @example const transfer = await rize.transfer.get(transferUid);
     */
    get(uid: string): Promise<Transfer>;
    /**
     * Attempt to initiate a Transfer between two Synthetic Accounts. Before the Transfer will be initiated,
     * several checks will be performed to ensure there is sufficient balance in the source account and that
     * the initiating Customer has all the necessary access to both Synthetic Accounts. Depending on the
     * Synthetic Account Types involved and the Program configuration, a new Transfer could complete instantly
     * or take as many as 6 business days.
     *
     * Note: Rize is working to support any Synthetic Account as the source and destination. Currently, the
     * only Synthetic Accounts allowed in a Transfer request are:
     *
     * - two general liability Synthetic Accounts
     * - Master Synthetic Accounts and external Synthetic Accounts
     * @param {string} externalUid - A unique identifier Client supplies. It should be given when creating a new resource and must be unique within the resource type. If the same value is given, no new resource will be created.
     * @param {string} sourceSyntheticAccountUid - Synthetic Account to pull asset from. Must be an active liability or external-type account. Cannot be equal to `destination_synthetic_account_uid`.
     * @param {string} destinationSyntheticAccountUid - Synthetic Account where the asset should land. Must be an active liability or external-type account. Cannot be equal to `source_synthetic_account_uid`.
     * @param {string} initiatingCustomerUid
     * @param {string} usTransferAmount - The USD amount to transfer.
     * @param {string} destinationCustomerUid - The uid of the owner of the destination Synthetic Account. If not provided, it is assumed to be the initiatingCustomerUid.
     * @returns {Promise<Transfer>} A promise that returns a Transfer if resolved.
     * @example
     * const transfer = await rize.transfer.init(
     *     'external_uid1',
     *     'synthetic_account_uid1',
     *     'synthetic_account_uid2',
     *     'customer_uid1',
     *     100
     * );
     */
    init(externalUid: string, sourceSyntheticAccountUid: string, destinationSyntheticAccountUid: string, initiatingCustomerUid: string, usTransferAmount: string, destinationCustomerUid?: string): Promise<Transfer>;
}
declare namespace TransferService {
    export { TransferListQuery, Transfer, RizeList };
}
type TransferListQuery = import('./typedefs/transfer.typedefs').TransferListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type Transfer = import('./typedefs/transfer.typedefs').Transfer;
