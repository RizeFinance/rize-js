export = CustomerService;
/**
 * The Customer service class.
 */
declare class CustomerService {
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
     * @param {CustomerListQuery} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery: (query: CustomerListQuery) => void;
    /**
     * Retrieves a list of Customers filtered by the given parameters.
     * Filter parameters are not case sensitive, but will only return exact matches.
     * Multiple filter parameters can be provided at once, but a result will not be returned unless there are exact matches for all submitted parameters.
     * @param {CustomerListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<CustomerList>} - A promise that returns a Customer List if resolved.
     */
    getList(query?: CustomerListQuery): Promise<CustomerList>;
    /**
     *
     * @param {*} uid
     */
    get(uid: any): Promise<void>;
    /**
     *
     * @param {*} uid
     * @param {*} email
     * @param {*} details
     */
    update(uid: any, email: any, details: any): Promise<void>;
    /**
     *
     * @param {*} uid
     */
    archive(uid: any): Promise<void>;
    /**
     *
     * @param {*} uid
     */
    verifyIdentity(uid: any): Promise<void>;
    /**
     *
     * @param {*} uid
     * @param {*} lockReason
     */
    lock(uid: any, lockReason: any): Promise<void>;
    /**
     *
     * @param {*} uid
     * @param {*} unlockReason
     */
    unlock(uid: any, unlockReason?: any): Promise<void>;
}
declare namespace CustomerService {
    export { CustomerListQuery, CustomerList };
}
type CustomerListQuery = {
    /**
     * - Filter by onboarding status. Please note that the initiated enum value will not be respected unless the `include_initiated=true` parameter is also provided.
     */
    status?: "active" | "rejected" | "initiated" | "queued" | "identity_verified" | "manual_review" | "archived" | "under_review";
    /**
     * - By default, Customers in initiated status are not shown, even if the `status=initiated` parameter is provided. In order for Customers with status initiated to appear in search results, parameters must include `include_initiated=true`.
     */
    include_initiated?: boolean;
    /**
     * - Filter by KYC status.
     */
    kyc_status?: "denied" | "manual_review" | "under_review" | "approved" | "documents_provided" | "documents_rejected" | "pending_documents" | "ready_for_custodial_partner_review";
    /**
     * - Only return Customers with a first name matching exactly what is submitted
     */
    first_name?: string;
    /**
     * - Only return Customers with a last name matching exactly what is submitted
     */
    last_name?: string;
    /**
     * - Only return Customers with an email address matching exactly what is submitted
     */
    email?: string;
    /**
     * - Only return locked Customers if true and only return unlocked Customers if false
     */
    locked?: boolean;
    /**
     * - Only return Customers belonging to the submitted Program.
     */
    program_uid?: string;
    /**
     * - A unique, immutable id provided by Client.
     */
    external_uid?: string;
    /**
     * - Filter by pool. Multiple values are allowed.
     */
    pool_uid?: string[];
    /**
     * -  Maximum number of items to retrieve. This filter is automatically applied with the default value if not given. Default: 100
     */
    limit?: string;
    /**
     * - Index of the items to start retrieving from. Default: 0
     */
    offset?: string;
    /**
     * - Sort returned items.
     */
    sort?: "first_name_asc" | "first_name_desc" | "last_name_asc" | "last_name_desc" | "email_asc" | "email_desc";
};
type CustomerList = {
    total_count: number;
    count: number;
    limit: number;
    offset: number;
    data: import("./typedefs/customer.typedefs").Customer[];
};
