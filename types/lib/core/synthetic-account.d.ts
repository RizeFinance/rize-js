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
     * @ignore @protected
     * Validates the parameters for the "archive" method
     * @param {string} uid
     */
    protected _validateArchiveParams(uid: string): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "getList" method
     * @param {SyntheticAccountListQuery} query
     */
    protected _validateGetListQuery(query: SyntheticAccountListQuery): void;
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
     * List Synthetic Accounts
     * @param {SyntheticAccountListQuery} query
     * @returns {Promise<RizeList<SyntheticAccount>>} A promise that returns the Synthetic Account list if resolved.
     * @example
     * const customer = await rize.syntheticAccount.getList({
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
    getList(query?: any): Promise<RizeList<SyntheticAccount>>;
    /**
     * Get a single Synthetic account
     *
     * Retrieve a single Synthetic Account resource along with supporting details and account balances
     * @param {string} uid - Rize-generated unique synthetic account id
     * @returns {Promise<SyntheticAccount>} - A promise that returns a SyntheticAccount if resolved.
     * @example const syntheticAccount = await rize.syntheticAccount.get(customerUid);
     */
    get(uid: string): Promise<SyntheticAccount>;
    /**
     * @ignore @protected
     * Validates payload parameter object for the "create" method
     * @param {SyntheticAccountCreateRequest} request
     */
    protected _validateCreateParams(request: SyntheticAccountCreateRequest): void;
    /**
     * @param {SyntheticAccountCreateRequest} payload - is a JSON object needs to send as body parameters in order to create new synthetic accounts.
     * @returns {Promise<RizeList<SyntheticAccount>>}
     * @example
     * const syntheticAccountTypes = await rize.syntheticAccount.getTypesList({
     *     name: 'Spinach Fund',
     *     poolUid: 'wTSMX1GubP21ev2h',
     *     syntheticAccountTypeUid: 'fRMwt6H14ovFUz1s'
     * });
     */
    create(payload: SyntheticAccountCreateRequest): Promise<RizeList<SyntheticAccount>>;
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
    update(uid: any, name: any, note: any): Promise<SyntheticAccount>;
    /**
     * In order to archive a Synthetic Account, the account must:
     * - belong to a general Synthetic Account Type
     * - not be a Master Synthetic Account i.e. master_account must be false
     * - have zero balance
     * - have no pending Transfers
     * Master Synthetic Accounts are archived when the Program Customer is archived (DELETE /customers/:uid).
     * External Synthetic Accounts cannot be archived through DELETE /synthetic_accounts/:uid.
     * For on overview of how to archive an external Synthetic Account, please contact your Rize account manager.
     * @param {*} uid {string} uid - Rize-generated unique Synthetic Account id
     * @returns {Promise<void>} A promise that returns void if resolved.
     * @example
     * await rize.syntheticAccount.archive(syntheticAccountUid);
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
    export { SyntheticAccount, SyntheticAccountListQuery, SyntheticAccountType, SyntheticAccountTypeListQuery, SyntheticAccountCreateRequest, RizeList };
}
type SyntheticAccountListQuery = import('./typedefs/synthetic-account.typedefs').SyntheticAccountListQuery;
type SyntheticAccountTypeListQuery = import('./typedefs/synthetic-account.typedefs').SyntheticAccountTypeListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type SyntheticAccount = import('./typedefs/synthetic-account.typedefs').SyntheticAccount;
type SyntheticAccountCreateRequest = import('./typedefs/synthetic-account.typedefs').SyntheticAccountCreateRequest;
type SyntheticAccountType = import('./typedefs/synthetic-account.typedefs').SyntheticAccountType;
