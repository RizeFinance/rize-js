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
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     *
     * @param {*} query
     */
    getList(query?: any): Promise<string>;
    /**
     * Get a single Synthetic accoutn
     *
     * Retrieve a single Synthetic Account resource along with supporting details and account balances
     * @param {string} uid - Rize-generated unique id
     * @returns {Promise<SyntheticAccount>} - A promise that returns a SyntheticAccount if resolved.
     * @example const syntheticAccount = await rize.syntheticAccount.get(customerUid);
     */
    get(uid: string): Promise<SyntheticAccount>;
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
    export { SyntheticAccount, RizeList };
}
type SyntheticAccount = import('./typedefs/synthetic-account.typedefs').SyntheticAccount;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
