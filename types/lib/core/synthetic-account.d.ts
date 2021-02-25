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
     * Validates query parameter object for the "getTypesList" method
     * @param {SyntheticAccountTypeListQuery} query
     */
    protected _validateGetTypesListQuery(query: SyntheticAccountTypeListQuery): void;
    /**
     * @ignore @protected
     * Validates query parameter object for the "getTypesList" method
     * @param {SyntheticAccountTypeListQuery} query
     */
    protected _validateUpdateParams(uid: any, name: any, note: any): void;
    /**
     *
     * @param {*} query
     */
    getList(query?: any): Promise<string>;
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
     * Enables Synthetic Account name changes for all Synthetic Accounts, including the Master Synthetic Account.
     * The Master Synthetic Account remains identifiable by the master_account flag stored with the Synthetic Account record.
     * @param {*} uid {string} uid - Rize-generated unique Synthetic Account id
     * @param {*} name {string} A unique name to identify the resource
     * @param {*} note {string} A reason for the Synthetic Account name change
     * @returns {Promise<SyntheticAccount>} A promise that returns a Synthetic Account if resolved.
     * @example
     * const syntheticAccountTypes = await rize.syntheticAccount.update({
     *     uid: 'EhrQZJNjCd79LLYq',
     *     name: 'New Resource Name',
     *     note: 'new note'
     * });
     */
    update(uid: any, name: any, note: any): Promise<any>;
    /**
     *
     * @param {*} uid
     */
    archive(uid: any): Promise<void>;
    /**
     * Retrieves a list of Synthetic Account Types filtered by the given parameters.
     * @param {SyntheticAccountTypeListQuery} query - An object containing key value paris for filtering the result.
     * @returns {Promise<RizeList<SyntheticAccountType>>} A promise that returns a Synthetic Account Type List if resolved.
     * @example
     * const syntheticAccountTypes = await rize.syntheticAccount.getTypesList({
     *     program_uid: 'EhrQZJNjCd79LLYq',
     *     limit: 10,
     *     offset: 10
     * });
     */
    getTypesList(query?: SyntheticAccountTypeListQuery): Promise<RizeList<SyntheticAccountType>>;
    /**
     * Get a single Synthetic Account Type
     *
     * Returns a single Synthetic Account Type resource along with supporting details
     * @param {string} uid - Rize-generated unique Synthetic Account Type id
     * @returns {Promise<SyntheticAccountType>} A promise that returns a Synthetic Account Type if resolved.
     * @exampls
     * const syntheticAccountType = await rize.syntheticAccount.getType('EhrQZJNjCd79LLYq');
     */
    getType(uid: string): Promise<SyntheticAccountType>;
}
declare namespace SyntheticAccountService {
    export { SyntheticAccountType, SyntheticAccountTypeListQuery, RizeList };
}
type SyntheticAccountTypeListQuery = import('./typedefs/synthetic-account.typedefs').SyntheticAccountTypeListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type SyntheticAccountType = import('./typedefs/synthetic-account.typedefs').SyntheticAccountType;
