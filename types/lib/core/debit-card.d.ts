export = DebitCardService;
/**
 * The Debit Card service class
 */
declare class DebitCardService {
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
     * Retrieves a list of Debit Cards filtered by the given parameters.
     * @param {DebitCardListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<DebitCard>>} A promise that returns a Debit Card List if resolved.
     * @example
     * const debitCards = await rize.debitCard.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     external_uid: 'external_uid1',
     *     limit: 50,
     *     offset: 0,
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     locked: false,
     *     status: ['queued', 'issued']
     * });
     */
    getList(query?: DebitCardListQuery): Promise<RizeList<DebitCard>>;
}
declare namespace DebitCardService {
    export { DebitCardListQuery, DebitCard, RizeList };
}
type DebitCardListQuery = import('./typedefs/debit-card.typedefs').DebitCardListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type DebitCard = import('./typedefs/debit-card.typedefs').DebitCard;
