export = CustodialAccountService;
declare class CustodialAccountService {
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
     * @param {CustodialAccountListQuery} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: CustodialAccountListQuery): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * Get a single Custodial Account
     *
     * Returns a single Custodial Account resource along with supporting details and account balances
     * @param {string} uid - Rize-generated unique custodial account id
     * @returns {Promise<CustodialAccount>} - A promise that returns a Custodial Account if resolved.
     * @example const custodialAccount = await rize.custodialAccount.get(custodialAccountUid);
     */
    get(uid: string): Promise<CustodialAccount>;
    /**
     * Retrieves a list of Custodial Accounts filtered by the given parameters.
     * Filter parameters are not case sensitive, but will only return exact matches.
     * Multiple filter parameters can be provided at once, but a result will not be returned unless there are exact matches for all submitted parameters.
     * @param {CustodialAccountListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<CustodialAccountList>>} - A promise that returns a Custodial Account List if resolved.
     * @example
     * const custodialAccountList = await rize.custodialAccount.getList({
     *     customer_uid: ['uKxmLxUEiSj5h4M3', 'y9reyPMNEWuuYSC1'],
     *     external_uid: client-generated-id,
     *     limit: 50,
     *     offset: 0,
     *     liability: false,
     *     type: ['data']
     * });
     */
    getList(query?: CustodialAccountListQuery): Promise<RizeList<any>>;
}
declare namespace CustodialAccountService {
    export { CustodialAccount, CustodialAccountListQuery, RizeList };
}
type CustodialAccountListQuery = import('./typedefs/custodial-account.typedefs').CustodialAccountListQuery;
type CustodialAccount = import('./typedefs/custodial-account.typedefs').CustodialAccount;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
