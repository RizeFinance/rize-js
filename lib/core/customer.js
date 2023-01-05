const validator = require('validator');
const utils = require('../utils');

/**
 * The Customer service class.
 */
class CustomerService {
    /**
   * @hideconstructor
   * @param {import('axios').AxiosInstance} api
   */
    constructor(api) {
    /** @ignore @protected */ this._api = api;
    }

    /**
   * @ignore @protected
   * Validates query parameter object for getList method.
   * @param {CustomerListQuery} query - An object containing key value pair for filtering the results list.
   */
    _validateGetListQuery(query) {
        const statuses = [
            'initiated',
            'queued',
            'identity_verified',
            'active',
            'manual_review',
            'rejected',
            'archived',
            'under_review',
            'pending_archival',
        ];
        const kycStatuses = [
            'approved',
            'denied',
            'documents_provided',
            'documents_rejected',
            'manual_review',
            'pending_documents',
            'ready_for_custodial_partner_review',
            'under_review',
        ];
        const sortOptions = [
            'first_name_asc',
            'first_name_desc',
            'last_name_asc',
            'last_name_desc',
            'email_asc',
            'email_desc',
        ];
        const customer_types = ['primary', 'sole_proprietor', 'secondary', 'sub_ledger'];
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a CustomerListQuery object.');
        } else {
            if ('status' in query && !statuses.includes(query.status)) {
                throw new Error(
                    `"status" query must be a string. Accepted values are: ${statuses.join(
                        ' | '
                    )}`
                );
            }
            if (
                'include_initiated' in query &&
        !utils.isBoolean(query.include_initiated)
            ) {
                throw new Error('"include_initiated" query must be boolean.');
            }
            if ('kyc_status' in query && !kycStatuses.includes(query.kyc_status)) {
                throw new Error(
                    `"kyc_status" query must be a string. Accepted values are: ${kycStatuses.join(
                        ' | '
                    )}`
                );
            }
            if ('first_name' in query && !utils.isString(query.first_name)) {
                throw new Error('"first_name" query must be a string.');
            }
            if ('last_name' in query && !utils.isString(query.last_name)) {
                throw new Error('"last_name" query must be a string.');
            }
            if ('business_name' in query && !utils.isString(query.business_name)) {
                throw new Error('"business_name" query must be a string.');
            }
            if ('email' in query && !utils.isString(query.email)) {
                throw new Error('"email" query must be a string.');
            }
            if ('locked' in query && !utils.isBoolean(query.locked)) {
                throw new Error('"locked" query must be boolean.');
            }
            if ('program_uid' in query && !utils.isString(query.program_uid)) {
                throw new Error('"program_uid" query must be a string.');
            }
            if ('external_uid' in query && !utils.isString(query.external_uid)) {
                throw new Error('"external_uid" query must be a string.');
            }
            if (
                'customer_type' in query &&
        !customer_types.includes(query.customer_type)
            ) {
                throw new Error(
                    `"customer_type" query must be a string. Accepted values are: ${customer_types.join(
                        ' | '
                    )}`
                );
            }
            if ('pool_uid' in query) {
                if (Array.isArray(query.pool_uid) && query.pool_uid.length > 0) {
                    for (let poolUid of query.pool_uid) {
                        if (!utils.isString(poolUid)) {
                            throw new Error('"pool_uid" query must be an array of strings.');
                        }
                    }
                } else {
                    throw new Error('"pool_uid" query must be an array of strings.');
                }
            }
            if ('limit' in query && !Number.isInteger(query.limit)) {
                throw new Error('"limit" query must be an integer.');
            }
            if ('offset' in query && !Number.isInteger(query.offset)) {
                throw new Error('"offset" query must be an integer.');
            }
            if ('sort' in query && !sortOptions.includes(query.sort)) {
                throw new Error(
                    `"sort" query must be a string. Accepted values are: ${sortOptions.join(
                        ' | '
                    )}`
                );
            }
        }
    }

    /**
   * @ignore @protected
   * Validates the parameters for the "get" method
   * @param {string} uid
   */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
    }

    /**
   * @ignore @protected
   * Validates the parameters for the "create" method
   * @param {'primary'|'secondary'|'sole_proprietor'|'sub_ledger'|null} customer_type Default to primary if null
   * @param {CustomerDetailsParams|null} details
   * @param {string|null} email
   * @param {string|null} external_uid
   * @param {string|null} primary_customer_uid Required if secondary type
   */
    _validateCreateParams(customer_type, details, email, external_uid, primary_customer_uid) {

        const customer_types = ['primary', 'sole_proprietor', 'secondary', 'sub_ledger'];
        if (
            customer_type && !customer_types.includes(customer_type)
        ) {
            throw new Error('"customer_type" is invalid.');
        }
        if (details) {
            if (utils.isObject(details)) {
                this._validateDetailParams(details);
            } else {
                throw new Error('"details" should be a CustomerDetailsParams object.');
            }
        }
        if (email && !validator.isEmail(email)) {
            throw new Error('"email" is invalid.');
        }
        if (
            customer_type === 'secondary' && (
                !primary_customer_uid ||
                    validator.isEmpty(primary_customer_uid, { ignore_whitespace: true })
            )
        ) {
            throw new Error('"primary_customer_uid" is required for secondary customer_type.');
        }

    }

    /**
   * @ignore @protected
   * @param {CustomerDetailsParams|null} details
   * @param {string|null} email
   * @param {string|null} external_uid
   * @param {string} uid Customer UID
   */
    _validateUpdateParams(details, email, external_uid, uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
        if (email && !validator.isEmail(email)) {
            throw new Error('"email" is invalid.');
        }
        if (details !== null) {
            if (utils.isObject(details)) {
                this._validateDetailParams(details);
            } else {
                throw new Error('"details" should be a CustomerDetailsParams object.');
            }
        }
    }

    /**
   * @ignore @protected
   * @param {CustomerDetailsParams} details
   */
    _validateDetailParams(details) {
        if ('phone' in details && !details.phone.match(/^\d{10}$/)) {
            throw new Error('"details.phone" should contain exactly 10 digits.');
        }
        if ('ssn' in details && !details.ssn.match(/^\d{3}-\d{2}-\d{4}$/)) {
            throw new Error('"details.ssn" should be formatted as ###-##-####');
        }
        if ('dob' in details && !validator.isDate(details.dob)) {
            throw new Error('"details.dob" is not a valid date.');
        }
        if ('address' in details) {
            if (!utils.isObject(details.address)) {
                throw new Error('"details.address" should be an Address object.');
            } else {
                if ('state' in details.address && !details.address.state.match(/^\w{2}$/)) {
                    throw new Error('"details.address.state" must be a valid US state abbreviation.');
                }
                if ('postal_code' in details.address && !details.address.postal_code.match(/^\d{5}(-\d{4})?$/)) {
                    throw new Error('"details.address.postal_code" must be a valid ZIP code.');
                }
            }
        }
    }

    /**
   * @ignore @protected
   * Validates the parameters for the "archive" method
   * @param {string} uid
   * @param {string} [archiveNote]
   * @param {boolean} canApplyAgain
   */
    _validateArchiveParams(uid, archiveNote, canApplyAgain) {
        if (!uid || validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
        if (archiveNote && !utils.isString(archiveNote)) {
            throw new Error('"archiveNote" must be a string');
        }
        if (canApplyAgain !== null && !utils.isBoolean(canApplyAgain)) {
            throw new Error('"canApplyAgain" must be a boolean');
        }
    }

    /**
   * @ignore @protected
   * Validates the parameters for the "updateProfileAnswers" method
   * @param {string} uid
   */
    _validateUpdateProfileAnswers(uid) {
        if (!uid || validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
    }

    /**
   * @ignore
   * @protected
   * @param {CustomerProfileAnswerDetails} details
   */
    _validateProfileAnswerDetails(details) {
        const { profile_requirement_uid, profile_response } = details;

        if (
            validator.isEmpty(profile_requirement_uid, { ignore_whitespace: true })
        ) {
            throw new Error('"profile_requirement_uid" is required.');
        }
        if (!profile_response) {
            throw new Error('"profile_response" is required.');
        }
    }

    /**
   * @ignore @protected
   * Validates the parameters for the "identityConfirmation" method
   * @param {string} uid
   */
    _validateVerifyIdentityConfirmation(uid) {
        if (!uid || validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
    }

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
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'status',
            'include_initiated',
            'kyc_status',
            'first_name',
            'last_name',
            'email',
            'locked',
            'program_uid',
            'external_uid',
            'customer_type',
            'pool_uid',
            'limit',
            'offset',
            'sort',
            'business_name',
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const response = await this._api.get(`/customers/${queryStr}`);

        return response.data;
    }

    /**
   * Get a single Customer
   *
   * Retrieve overall status about a Customer as well as their total Asset Balances across all accounts.
   * @param {string} uid - Rize-generated unique customer id
   * @returns {Promise<Customer>} - A promise that returns a Customer if resolved.
   * @example const customer = await rize.customer.get(customerUid);
   */
    async get(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(`/customers/${uid}`);

        return response.data;
    }

    /**
   * Create a single Primary or Sole Proprietor Customer
   *
   * Creates a new instance of a customer.
   * @param {string|null} [externalUid] - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers
   * @param {string|null} email - Email of the customer
   * @param {'primary'|'secondary'|'sole_proprietor'|'sub_ledger'} [customer_type='primary'] - Type of customer
   * @param {CustomerDetailsParams|null} details - An object containing the supplied identifying information for the Customer
   * @param {string|null} primary_customer_uid - UID of the primary Customer. Required and only applicable for secondary type
   * @returns {Promise<Customer>} - A promise that returns a Customer if resolved
   * @example const newCustomer = await rize.customer.create(externalUid, email, customer_type);
   */
    async create(externalUid = null, email = null, customer_type = 'primary', details = null, primary_customer_uid = null) {
        this._validateCreateParams(customer_type, details, email, externalUid, primary_customer_uid);

        const response = await this._api.post('/customers', {
            customer_type: customer_type,
            details: details,
            email: email,
            external_uid: externalUid,
            primary_customer_uid: primary_customer_uid
        });

        return response.data;
    }

    /**
   * Adjusts Customer Data
   *
   * This function is used to supply the remaining personally identifiable information (PII) for each Customer after they are created with a new Compliance Workflow.
   * Please refer to Rize API documentation for when changes can be made to a Customer's PII
   * PII can be edited for a Customer up until a valid request is sent using the verifyIdentity function.
   *
   * @param {string} uid - Rize-generated unique customer id
   * @param {string|null} email - Email of the customer
   * @param {CustomerDetailsParams|null} details - An object containing the supplied identifying information for the Customer
   * @param {string|null} [externalUid] - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers
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
   *     },
   *     externalUid
   * );
   */
    async update(uid, email = null, details = null, external_uid = null) {
        this._validateUpdateParams(details, email, external_uid, uid);

        const response = await this._api.put(`/customers/${uid}`, {
            email,
            details,
            external_uid
        });

        return response.data;
    }

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
    async updateProfileAnswers(uid, details) {
        this._validateUpdateProfileAnswers(uid);

        if (!details || details.length === 0) {
            throw new Error('Please submit at least one profile answer.');
        }

        const answers = Array.isArray(details) ? details : [details];
        answers.forEach(this._validateProfileAnswerDetails);

        const response = await this._api.put(
            `/customers/${uid}/update_profile_responses`,
            {
                details: answers.map(answer => ({
                    profile_requirement_uid: answer.profile_requirement_uid,
                    profile_response: answer.profile_response,
                })),
            }
        );

        return response.data;
    }

    /**
   * Archives a customer.
   *
   * A Customer can not be archived until all associated Synthetic and Custodial Accounts have been closed and retain a zero balance.
   * An archived Customer's records will still be available for historical purposes, but they will not be able to open any new Synthetic or Custodial Accounts.
   * @param {string} uid - Rize-generated unique customer id
   * @param {string} [archiveNote] - Reason for archiving
   * @param {boolean} [canApplyAgain=true] - Whether or not the customer can apply to the program again (default is true)
   * @returns {Promise<void>} A promise that returns void if resolved.
   * @example
   * await rize.customer.archive(customerUid);
   */
    async archive(uid, archiveNote = null, canApplyAgain = true) {
        this._validateArchiveParams(uid, archiveNote, canApplyAgain);

        const response = await this._api.delete(
            `/customers/${uid}`,
            {
                data: {
                    archive_note: archiveNote,
                    can_apply_again: canApplyAgain
                
                }
            }
        );

        return response.data;
    }

    /**
   * Submit a request for Identity Confirmation.
   *
   * This method is used to explicitly confirm a Customer's PII data is up-to-date in order to add additional products.
   * @param {string} uid - Rize-generated unique customer id
   * @returns {Promise<Customer>} - A promise that returns the Customer with their pii_confirmed_at updated
   * @example
   * await rize.customer.identityConfirmation(customerUid);
   */
    async identityConfirmation(uid) {
        this._validateVerifyIdentityConfirmation(uid);

        const response = await this._api.put(
            `/customers/${uid}/identity_confirmation`
        );

        return response.data;
    }

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
    async lock(uid, lockReason) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
        if (validator.isEmpty(lockReason, { ignore_whitespace: true })) {
            throw new Error('"lockReason" is required.');
        }

        const response = await this._api.put(`/customers/${uid}/lock`, {
            lock_reason: lockReason,
        });

        return response.data;
    }

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
   * @param {true|false} unlock_all_secondary - allows the requestor to specify whether all secondary customers should be unlocked
   * @returns {Promise<Customer>} A promise that returns the unlocked Customer if resolved.
   * @example const customer = await rize.customer.unlock(customerUid, unlockReason, unlock_all_secondary);
   */
    async unlock(uid, unlockReason = null, unlock_all_secondary = null) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
        if (unlockReason !== null && !utils.isString(unlockReason)) {
            throw new Error('"unlockReason" must be a string.');
        }

        if (unlock_all_secondary !== null) {
            if(!(unlock_all_secondary === true || unlock_all_secondary === false )){
                throw new Error('"unlock_all_secondary" can only be true, false or null.');
            }
        }

        const response = await this._api.put(`/customers/${uid}/unlock`, {
            unlock_reason: unlockReason,
            unlock_all_secondary: unlock_all_secondary,
        });

        return response.data;
    }
}

module.exports = CustomerService;

/**
 * @typedef {import('./typedefs/customer.typedefs').CustomerListQuery} CustomerListQuery
 * @typedef {import('./typedefs/customer.typedefs').CustomerDetails} CustomerDetails
 * @typedef {import('./typedefs/customer.typedefs').CustomerDetailsParams} CustomerDetailsParams
 * @typedef {import('./typedefs/customer.typedefs').Customer} Customer
 * @typedef {import('./typedefs/customer.typedefs').CustomerProfileAnswerDetails} CustomerProfileAnswerDetails
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */
