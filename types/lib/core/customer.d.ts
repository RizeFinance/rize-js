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
    protected _validateGetListQuery(query: CustomerListQuery): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "update" method
     * @param {string} uid
     * @param {string} email
     * @param {CustomerDetails} details
     */
    protected _validateUpdateParams(uid: string, email: string, details: CustomerDetails): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "archive" method
     * @param {string} uid
     */
    protected _validateArchiveParams(uid: string): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "verifyIdentity" method
     * @param {string} uid
     */
    protected _validateVerifyIdentityParams(uid: string): void;
    /**
     * Retrieves a list of Customers filtered by the given parameters.
     * Filter parameters are not case sensitive, but will only return exact matches.
     * Multiple filter parameters can be provided at once, but a result will not be returned unless there are exact matches for all submitted parameters.
     * @param {CustomerListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<CustomerList>} - A promise that returns a Customer List if resolved.
     * @example
     * const customerList = await rize.customer.getList({
     *     status: 'initiated',
     *     include_initiated: true,
     *     kyc_status: 'approved'.
     *     first_name: 'John',
     *     last_name: 'Cena',
     *     email: 'test@test.com',
     *     locked: false,
     *     program_uid: 'program_uid',
     *     external_uid: 'external_uid',
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     sort: 'first_name_asc'
     * });
     */
    getList(query?: CustomerListQuery): Promise<CustomerList>;
    /**
     * Retrieve overall status about a Customer as well as their total Asset Balances across all accounts.
     * @param {string} uid - Rize-generated unique customer id
     * @returns {Promise<Customer>} - A promise that returns a Customer if resolved.
     * @example const customer = await rize.customer.get(customerUid);
     */
    get(uid: string): Promise<Customer>;
    /**
     * Adjusts Customer Data
     *
     * This function is used to supply the remaining personally identifiable information (PII) for each Customer after they are created with a new Compliance Workflow.
     * The PII for a Customer must be submitted in full. Rize will not accept your request if any field is incomplete or missing.
     * PII can be edited for a Customer up until a valid request is sent using the verifyIdentity function.
     * @param {string} uid - Rize-generated unique customer id
     * @param {string} email - Email of the customer
     * @param {CustomerDetails} details - An object containing the supplied identifying information for the Customer
     * @returns {Promise<Customer>} A promise that returns the updated Customer if resolved.
     * @example
     * const updatedCustomer = await rize.customer.update(
     *     customerUid,
     *     customerEmail,
     *     {
     *         first_name: 'Olive',
     *         middle_name: 'Olivia',
     *         last_name: 'Oyl',
     *         suffix: 'Jr.',
     *         phone: '5555551212',
     *         ssn: '111-22-3333',
     *         dob: '1919-12-08',
     *         address: {
     *             street1: '123 Abc St.',
     *             street2: 'Apt 2',
     *             city: 'Chicago',
     *             state: 'IL',
     *             postal_code: '12345',
     *         }
     *     }
     * );
     */
    update(uid: string, email: string, details: CustomerDetails): Promise<Customer>;
    /**
     * Archives a customer.
     *
     * A Customer can not be archived until all associated Synthetic and Custodial Accounts have been closed and retain a zero balance.
     * An archived Customer's records will still be available for historical purposes, but they will not be able to open any new Synthetic or Custodial Accounts.
     * @param {string} uid - Rize-generated unique customer id
     * @returns {Promise<void>} A promise that returns void if resolved.
     * @example
     * await rize.customer.archive(customerUid);
     */
    archive(uid: string): Promise<void>;
    /**
     * Submit a request for Identity Verification
     *
     * The Identity Verification of a customer serves as explicit confirmation from you that the Customer is ready for account opening.
     * This event initiates the KYC/AML verification process and account opening at the Custodian(s) in your Program.
     * This is a billable event and is isolated intentionally for you to confirm that the Customer record is complete.
     *
     * Identity Verification is the event that locks the customer PII from further edits.
     *
     * Identity Verification is designed to work as follows:
     *
     * - The Customer completes the Compliance Workflow initiated from the Compliance Workflows endpoint and all documents are acknowledged.
     * - The Customer provides complete PII as defined by the Customers endpoint
     * - You submit a request to Identity Verification
     * - Rize performs a validation on the PII provided and the Compliance Workflow to confirm both are valid.
     * - If the Customer passes these validations and meets the duration requirements described below, the Customer record is submitted to the KYC process.
     *
     * Duration Requirements:
     *
     * You have a set duration to submit to Identity Verification for a Customer.
     * Rize measures the duration from the begun_at timestamp of the current Compliance Workflow returned from the Compliance Workflows endpoint to the time Rize receives the Identity Verification request.
     *
     * If the Identity Verification request falls outside of the set duration, your request will fail.
     * If your request fails, a new Compliance Workflow must be started for this Customer.
     * This will restart the duration available for a valid submission to Identity Verification.
     *
     * The previously submitted Customer PII remains editable for this customer after a failed submission to Identity Verification.
     * @param {string} uid - Rize-generated unique customer id.
     * @returns {Promise<Customer>} A promise that returns the updated Customer if resolved.
     */
    verifyIdentity(uid: string): Promise<Customer>;
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
    export { CustomerListQuery, CustomerList, CustomerDetails, Customer };
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
type CustomerDetails = {
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    phone: string;
    ssn: string;
    dob: string;
    address: import("./typedefs/customer.typedefs").Address;
};
type CustomerList = {
    /**
     * - Total count of items available to retrieve
     */
    total_count: number;
    /**
     * - Number of items retrieved
     */
    count: number;
    /**
     * - Maximum number of items to retrieve
     */
    limit: number;
    /**
     * - Index of the first item to retrieve
     */
    offset: number;
    data: import("./typedefs/customer.typedefs").Customer[];
};
type Customer = {
    /**
     * - A unique identifier generated by Rize
     */
    uid: string;
    /**
     * - A unique identifier Client supplies. It should be given when creating a new resource and must be unique within the resource type. If the same value is given, no new resource will be created.
     */
    external_uid: string;
    /**
     * - A uid referring to the program this customer belongs to.
     */
    program_uid: string;
    /**
     * - A list of uids referring to Pools belonging to this Customer.
     */
    pool_uids: string[];
    /**
     * - Email of the customer
     */
    email: string;
    /**
     * A value indicating the overall state of this Customer:
     * - ***initiated*** - Rize has created the Customer as a result of a post to the Compliance Workflows endpoint. This status will persist until Rize receives a successful request to perform Identity Verification. The Customer status will move to 'queued' after a successful request to perform Identity Verification.
     * - ***queued*** - Rize has determined that the required Customer PII has been provided and the Compliance Workflow is complete. The Customer record has been sent for KYC/AML partner verification. If the KYC/AML verification returns 'approved' the Customer status will move to 'identity_verified'. If the KYC/AML verification returns 'denied' the Customer status will move to 'rejected'. If the KYC/AML verification status returns 'manual_review' the Customer status will move to 'manual_review'.
     * - ***identity_verified*** - The Customer has been approved by the KYC/AML partner's verification process. This Customer's Master Synthetic Account and Custodial Account(s) are in the process of being opened.
     * - ***active*** - The Customer has been created on the Rize platform. The default Custodial Account(s) and Master Synthetic Account for this Customer have been opened per your Program configuration.
     * - ***manual_review*** - The Customer record is under review. A Manual Review status indicates a kyc_status that is not 'approved' or 'denied'. The Status will move from 'manual_review' to either 'identity_verified' or 'rejected' depending on the outcome of the review. See the KYC_Status values for additional states pertaining to Manual Review.
     * - ***rejected*** - The Customer is not eligible for an account on this Program.
     * - ***archived*** - The Customer is archived; no actions are available for this Customer. All archived accounts have a $0.00 balance.
     * - ***under_review*** - The Customer's account balances are under review. Rize will not accept Transfer requests for this Customer until their status returns to 'active'. The Customer can continue using their Debit Card while in a status of 'under_review'. The Customer status must be 'active' before entering a status of 'under_review'. Rize will not return an 'under_review' status during any portion of creating a Customer or a Compliance Workflow.
     */
    status: "active" | "rejected" | "initiated" | "queued" | "identity_verified" | "manual_review" | "archived" | "under_review";
    /**
     * A value indicating the state of KYC/AML evaluation:
     * - ***manual_review*** - The Customer has been selected for manual review by the KYC/AML partner supporting the Program. This is an interim step and the Customer KYC Status will likely be moved to Pending Documents.
     * - ***approved*** - The Customer has been approved by the KYC/AML partner supporting your Program. This KYC Status will prompt a change to the customer status to 'identity_verified'.
     * - ***denied*** - The Customer has been denied access by the KYC/AML partner supporting your Program. A Denied KYC Status will result in a Rejected customer status.
     * - ***pending_documents*** - The reviewer cannot adjudicate the Customer without identity verification documents. The Customer must supply identity verification documents before the review can be completed. The types of documents required will be defined during Program setup.
     * - ***documents_provided*** - The Customer has supplied identity verification documents.
     * - ***documents_rejected*** - The identity verification documents are not valid. Please request valid/clear images of the identity verification documents from the Customer.
     * - ***under_review*** - The Customer is being reviewed.
     * - ***ready_for_custodial_partner_review*** - The Customer is being reviewed by the Custodial Partner participating in the Program. Not all Customers that are reviewed will enter this state but some records will require Custodial Partner inputs.
     */
    kyc_status?: "denied" | "manual_review" | "under_review" | "approved" | "documents_provided" | "documents_rejected" | "pending_documents" | "ready_for_custodial_partner_review";
    /**
     * - Total asset owned by the customer in US dollars.
     */
    total_balance: string;
    created_at: Date;
    /**
     * - The date and time when the Customer was locked. This field will be null if and only if the lock_reason is null.
     */
    locked_at?: Date;
    /**
     * - The lock reason provided by the Client, an admin User, or the system at the time the Customer was locked. This field will be null if and only if the locked_at is null.
     */
    lock_reason?: string;
    /**
     * - An object containing the supplied identifying information for the Customer.
     */
    details: import("./typedefs/customer.typedefs").CustomerDetails;
};
