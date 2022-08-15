export = CustomerService;
/**
 * The Customer service class.
 */
declare class CustomerService {
    /**
   * @hideconstructor
   * @param {import('axios').AxiosInstance} api
   */
    constructor(api: import('axios').AxiosInstance);
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
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
   * Validates the parameters for the "create" method
   * @param {string|null} email Optional for sub_ledger customer type
   * @param {'primary'|'sole_proprietor'|'sub_ledger'} customer_type
   */
    protected _validateCreateParams(email: string | null, customer_type: 'primary' | 'sole_proprietor' | 'sub_ledger'): void;
    /**
   * @ignore @protected
   * @param {string} uid
   * @param {string} email
   * @param {CustomerDetailsParams} details
   */
    protected _validateUpdateParams(uid: string, email: string, details: CustomerDetailsParams): void;
    /**
   * @ignore @protected
   * @param {CustomerDetailsParams} details
   */
    protected _validateDetailParams(details: CustomerDetailsParams): void;
    /**
   * @ignore @protected
   * Validates the parameters for the "archive" method
   * @param {string} uid
   */
    protected _validateArchiveParams(uid: string): void;
    /**
   * @ignore @protected
   * Validates the parameters for the "updateProfileAnswers" method
   * @param {string} uid
   */
    protected _validateUpdateProfileAnswers(uid: string): void;
    /**
   * @ignore
   * @protected
   * @param {CustomerProfileAnswerDetails} details
   */
    protected _validateProfileAnswerDetails(details: CustomerProfileAnswerDetails): void;
    /**
   * @ignore @protected
   * Validates the parameters for the "identityConfirmation" method
   * @param {string} uid
   */
    protected _validateVerifyIdentityConfirmation(uid: string): void;
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
   *     customer_type: 'primary',
   *     pool_uid: ['pool_uid1', 'pool_uid2'],
   *     limit: 50,
   *     offset: 0,
   *     sort: 'first_name_asc'
   *     business_name: 'Wrestler Workshop'
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
   * Create a single Primary or Sole Proprietor Customer
   *
   * Creates a new instance of a customer.
   * @param {string} [externalUid] - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers
   * @param {string} email - Email of the customer
   * @param {'primary'|'sole_proprietor'|'sub_ledger'} [customer_type='primary'] - Type of customer
   * @returns {Promise<Customer>} - A promise that returns a Customer if resolved
   * @example const newCustomer = await rize.customer.create(externalUid, email, customer_type);
   */
    create(externalUid?: string, email: string, customer_type?: 'primary' | 'sole_proprietor' | 'sub_ledger'): Promise<Customer>;
    /**
   * Create a single Secondary Customer
   *
   * Secondary Customers are authorized to spend from the balance of an existing Primary Customer's account. Secondary Customers can request debit cards.
   * Charges from this card debit the associated Primary Customer's account. Secondary Customers require first name, last name, DOB, and address when they are created.
   * Secondary Customers require the Customer UID of the Primary Customer they are associated with.
   *
   * @param {string} [external_uid] - A Customer identifier supplied by the Client, unique among the collection of all Client Customers
   * @param {string} primary_customer_uid - The UID of the Primary Customer with whom this Secondary Customer will be affiliated with
   * @param {string} [email] - Email of the Secondary Customer
   * @param {CustomerDetailsParams} details - An object containing the supplied identifying information for the Customer
   * @returns {Promise<Customer>} - A promise that returns a Customer if resolved.
   * @example const newSecondaryCustomer = await rize.customer.createSecondary(external_uid, primary_customer_uid, details);
   */
    createSecondary(external_uid?: string, primary_customer_uid: string, email?: string, details: CustomerDetailsParams): Promise<Customer>;
    /**
   * Adjusts Customer Data
   *
   * This function is used to supply the remaining personally identifiable information (PII) for each Customer after they are created with a new Compliance Workflow.
   * Please refer to Rize API documentation for when changes can be made to a Customer's PII
   * PII can be edited for a Customer up until a valid request is sent using the verifyIdentity function.
   *
   * @param {string} uid - Rize-generated unique customer id
   * @param {string | null} email - Email of the customer
   * @param {CustomerDetailsParams} details - An object containing the supplied identifying information for the Customer
   * @returns {Promise<Customer>} A promise that returns the updated Customer if resolved.
   * @example
   * const updatedCustomer = await rize.customer.update(
   *     customerUid,
   *     customerEmail,
   *     {
   *         first_name: 'Olive',
   *         middle_name: 'Olivia',
   *         last_name: 'Oyl',
   *         business_name: `Olive's Olive Market`,
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
    update(uid: string, email?: string | null, details?: CustomerDetailsParams): Promise<Customer>;
    /**
   * Used to submit a Customer's Profile Responses to Profile Requirements.
   * @param {string} customerUid - A UID referring to the Customer.
   * @param {CustomerProfileAnswerDetails | Array<CustomerProfileAnswerDetails>} details
   * @returns {Promise<Customer>} - A promise that returns the updated Customer with their Profile Responses updated.
   * @example
   * // Submit a single profile response
   * const updatedCustomerResponse = await rize.customer.updateProfileAnswers(
   *     'h9MzupcjtA3LPW2e', //customerUid
   *     {
   *         profile_requirement_uid: 'Yqyjk5b2xgQ9FrxS',
   *         profile_response: 'yes',
   *     }
   * );
   *
   * // Submit multiple profile responses
   * const updatedCustomerResponses = await rize.customer.updateProfileAnswers(
   *     'h9MzupcjtA3LPW2e', //customerUid
   *     [{
   *         profile_requirement_uid: 'Yqyjk5b2xgQ9FrxS',
   *         profile_response: 'no'
   *     }, {
   *         profile_requirement_uid: 'dc6PApa2nn9K3jwL',
   *         profile_response: 'yes',
   *     }])
   * );
   */
    updateProfileAnswers(uid: any, details: CustomerProfileAnswerDetails | Array<CustomerProfileAnswerDetails>): Promise<Customer>;
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
   * Submit a request for Identity Confirmation.
   *
   * This method is used to explicitly confirm a Customer's PII data is up-to-date in order to add additional products.
   * @param {string} uid - Rize-generated unique customer id
   * @returns {Promise<Customer>} - A promise that returns the Customer with their pii_confirmed_at updated
   * @example
   * await rize.customer.identityConfirmation(customerUid);
   */
    identityConfirmation(uid: string): Promise<Customer>;
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
    export { CustomerListQuery, CustomerDetails, CustomerDetailsParams, Customer, CustomerProfileAnswerDetails, RizeList };
}
type CustomerListQuery = import('./typedefs/customer.typedefs').CustomerListQuery;
type CustomerDetailsParams = import('./typedefs/customer.typedefs').CustomerDetailsParams;
type CustomerProfileAnswerDetails = import('./typedefs/customer.typedefs').CustomerProfileAnswerDetails;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type Customer = import('./typedefs/customer.typedefs').Customer;
type CustomerDetails = import('./typedefs/customer.typedefs').CustomerDetails;
