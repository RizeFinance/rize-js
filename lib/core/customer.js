const validator = require('validator');
const querystring = require('query-string');
const utils = require('../utils');

/**
 * The Customer service class.
 */
class CustomerService {
    /** 
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor(api, auth) {
        /** @ignore @protected */ this._api = api;
        /** @ignore @protected */ this._auth = auth;
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
            'under_review'
        ];
        const kycStatuses = [
            'approved',
            'denied',
            'documents_provided',
            'documents_rejected',
            'manual_review',
            'pending_documents',
            'ready_for_custodial_partner_review',
            'under_review'
        ];
        const sortOptions = [
            'first_name_asc',
            'first_name_desc',
            'last_name_asc',
            'last_name_desc',
            'email_asc',
            'email_desc'
        ];
        if (!utils.isObject(query)) {
            throw new Error('"query" must be a CustomerListQuery object.');
        } else {
            if ('status' in query && !statuses.includes(query.status)) {
                throw new Error(`"status" query must be a string. Accepted values are: ${statuses.join(' | ')}`);
            }
            if ('include_initiated' in query && !utils.isBoolean(query.include_initiated)) {
                throw new Error('"include_initiated" query must be boolean.');
            }
            if ('kyc_status' in query && !kycStatuses.includes(query.kyc_status)) {
                throw new Error(`"kyc_status" query must be a string. Accepted values are: ${kycStatuses.join(' | ')}`);
            }
            if ('first_name' in query && !utils.isString(query.first_name)) {
                throw new Error('"first_name" query must be a string.');
            }
            if ('last_name' in query && !utils.isString(query.last_name)) {
                throw new Error('"last_name" query must be a string.');
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
                throw new Error(`"sort" query must be a string. Accepted values are: ${sortOptions.join(' | ')}`);
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
     * Validates the parameters for the "update" method
     * @param {string} uid 
     * @param {string} email 
     * @param {CustomerDetails} details 
     */
    _validateUpdateParams(uid, email, details) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
        if (email && !validator.isEmail(email)) {
            throw new Error('"email" is invalid.');
        }
        if (!utils.isObject(details)) {
            throw new Error('"details" should be a CustomerDetails object.');
        } else {
            if (!details.first_name || validator.isEmpty(details.first_name, { ignore_whitespace: true })) {
                throw new Error('"details.first_name" is required.');
            }
            if (!details.last_name || validator.isEmpty(details.last_name, { ignore_whitespace: true })) {
                throw new Error('"details.last_name" is required.');
            }
            if (!details.phone || validator.isEmpty(details.phone, { ignore_whitespace: true })) {
                throw new Error('"details.phone" is required.');
            }
            if (!details.ssn || validator.isEmpty(details.ssn, { ignore_whitespace: true })) {
                throw new Error('"details.ssn" is required.');
            }
            if (!details.ssn.match(/\d{3}-\d{2}-\d{4}/g)) {
                throw new Error('"details.ssn" should be formatted as ###-##-####');
            }
            if (!details.dob || validator.isEmpty(details.dob, { ignore_whitespace: true })) {
                throw new Error('"details.dob" is required.');
            }
            if (!validator.isDate(details.dob)) {
                throw new Error('"details.dob" is not a valid date.');
            }
            if (!utils.isObject(details.address)) {
                throw new Error('"details.address" should be an Address object.');
            } else {
                if (!details.address.street1 || validator.isEmpty(details.address.street1, { ignore_whitespace: true })) {
                    throw new Error('"details.address.street1" is required.');
                }
                if (!details.address.city || validator.isEmpty(details.address.city, { ignore_whitespace: true })) {
                    throw new Error('"details.address.city" is required.');
                }
                if (!details.address.state || validator.isEmpty(details.address.state, { ignore_whitespace: true })) {
                    throw new Error('"details.address.state" is required.');
                }
                if (!details.address.postal_code || validator.isEmpty(details.address.postal_code, { ignore_whitespace: true })) {
                    throw new Error('"details.address.postal_code" is required.');
                }
            }
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "archive" method
     * @param {string} uid 
     */
    _validateArchiveParams(uid) {
        if (!uid || validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "verifyIdentity" method
     * @param {string} uid 
     */
    _validateVerifyIdentityParams(uid) {
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
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     limit: 50,
     *     offset: 0,
     *     sort: 'first_name_asc'
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
            'pool_uid',
            'limit',
            'offset',
            'sort'
        ];

        const filteredQuery = utils.filterObjectByKeys(query, queryParameters);
        const queryStr = '?' + querystring.stringify(filteredQuery, { arrayFormat: 'bracket' });

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/customers/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

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

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/customers/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

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
    async update(uid, email, details) {
        this._validateUpdateParams(uid, email, details);

        const authToken = await this._auth.getToken();

        const response = await this._api.put(
            `/customers/${uid}`,
            { email, details },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

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
    async archive (uid) {
        this._validateArchiveParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.delete(
            `/customers/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

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
    async verifyIdentity(uid) {
        this._validateVerifyIdentityParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.put(
            `/customers/${uid}/identity_verification`,
            undefined,
            { headers: { 'Authorization': authToken } }
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

        const authToken = await this._auth.getToken();

        const response = await this._api.put(
            `/customers/${uid}/lock`,
            { lock_reason: lockReason },
            { headers: { 'Authorization': authToken } }
        );

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
     * @returns {Promise<Customer>} A promise that returns the unlocked Customer if resolved.
     * @example const customer = await rize.customer.unlock(customerUid, unlockReason);
     */
    async unlock(uid, unlockReason = null) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Customer "uid" is required.');
        }
        if (unlockReason !== null && !utils.isString(unlockReason)) {
            throw new Error('"unlockReason" must be a string.');
        }

        const authToken = await this._auth.getToken();

        const response = await this._api.put(
            `/customers/${uid}/unlock`,
            { unlock_reason: unlockReason },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = CustomerService;

/**
 * @typedef {import('./typedefs/customer.typedefs').CustomerListQuery} CustomerListQuery
 * @typedef {import('./typedefs/customer.typedefs').CustomerDetails} CustomerDetails
 * @typedef {import('./typedefs/customer.typedefs').Customer} Customer
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList 
 */
