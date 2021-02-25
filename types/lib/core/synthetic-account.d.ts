export = SyntheticAccountService;
/**
 * The Synthetic Account service class.
 */
declare class SyntheticAccountService {
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
     * Validates the parameters for the "getList" method
     * @param {SyntheticAccountListQuery} query
     */
    protected _validateGetListQuery(query: SyntheticAccountListQuery): void;
    /**
     * List Synthetic Accounts
     * @param {SyntheticAccountListQuery} query
     * @returns {Promise<RizeList<SyntheticAccount>>} A promise that returns the unlocked Customer if resolved.
     * @example
     * const customer = await rize.customer.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     external_uid: 'external_uid',
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     synthetic_account_type_uid: 'synthetic_account_type_uid',
     *     synthetic_account_category: 'general',
     *     program_uid: 'program_uid',
     *     liability: true,
     *     sort: 'name_asc'
     * });
     */
    getList(query?: SyntheticAccountListQuery): Promise<RizeList<SyntheticAccount>>;
    /**
     *
     * @param {*} uid
     */
    get(uid: any): Promise<void>;
    /**
     *
     * @param {*} name
     * @param {*} poolUid
     * @param {*} syntheticAccountTypeUid
     * @param {*} options
     */
    create(name: any, poolUid: any, syntheticAccountTypeUid: any, options?: any): Promise<void>;
    /**
     *
     * @param {*} uid
     * @param {*} name
     * @param {*} note
     */
    update(uid: any, name: any, note: any): Promise<void>;
    /**
     *
     * @param {*} uid
     */
    archive(uid: any): Promise<void>;
    /**
     *
     * @param {*} query
     */
    getTypesList(query?: any): Promise<void>;
    /**
     *
     * @param {*} uid
     */
    getType(uid: any): Promise<void>;
}
declare namespace SyntheticAccountService {
    export { SyntheticAccount, SyntheticAccountListQuery, RizeList };
}
type SyntheticAccountListQuery = import('./typedefs/synthetic-account.typedefs').SyntheticAccountListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type SyntheticAccount = import('./typedefs/synthetic-account.typedefs').SyntheticAccount;
