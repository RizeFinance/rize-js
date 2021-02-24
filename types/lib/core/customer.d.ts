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
     * @returns {Promise<RizeList<Customer>>} - A promise that returns a Customer List if resolved.
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
    getList(query?: CustomerListQuery): Promise<RizeList<Customer>>;
    /**
     * Get a single Customer
     *
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
     * @example
     * const updatedCustomer = await rize.customer.verifyIdentity(customerUid);
     */
    verifyIdentity(uid: string): Promise<Customer>;
    /**
     * Lock a Customer
     *
     * This will freeze all activities relating to the Customer. This means, until the customer is unlocked:
     * - No personal information can be edited
     * - The Customer cannot be archived
     * - Any pending enrollment requests are paused or withdrawn
     * - Any transfers requested after the lock is in place will be rejected
     * - (not implemented) Any transfers already in progress when the lock is put in place will be stopped and reversed
     * - (not implemented) Any debit card transactions requested after the lock is in place will be rejected
     * - (not implemented) Any Pool in which this Customer is a member will similarly be locked
     * - The Customer's transfers, transactions, account details, or any other information are still readable
     * @param {string} uid - Rize-generated unique customer id
     * @param {string} lockReason - The reason that the Customer is being locked must be submitted with the request body.
     * @returns {Promise<Customer>} A promise that returns the locked Customer if resolved.
     * @example const customer = await rize.customer.lock(customerUid, lockReason);
     */
    lock(uid: string, lockReason: string): Promise<Customer>;
    /**
     * Unlock a Customer
     *
     * This will remove the Customer lock, returning their state to normal.
     * Note that if the Customer was locked by a Custodial Partner or Rize admin
     * or by an automated system such as fraud transaction monitoring,
     * the Client cannot unlock the Customer from either the API or the Admin UI.
     * If the Customer was locked by the Client either via API or Admin UI,
     * the unlock can be performed by the Custodial Partner, the Client, or Rize.
     * @param {string} uid - Rize-generated unique customer id
     * @param {string} unlockReason - The reason that the Customer is being unlocked.
     * @returns {Promise<Customer>} A promise that returns the unlocked Customer if resolved.
     * @example const customer = await rize.customer.unlock(customerUid, unlockReason);
     */
    unlock(uid: string, unlockReason?: string): Promise<Customer>;
}
declare namespace CustomerService {
    export { CustomerListQuery, CustomerDetails, Customer, RizeList };
}
type CustomerListQuery = import('./typedefs/customer.typedefs').CustomerListQuery;
type CustomerDetails = import('./typedefs/customer.typedefs').CustomerDetails;
type RizeList = any;
type Customer = import('./typedefs/customer.typedefs').Customer;
