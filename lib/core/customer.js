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
        
        /** 
         * @ignore @protected
         * Validates query parameter object for getList method.
         * @param {CustomerListQuery} query - An object containing key value pair for filtering the results list.
         */
        this._validateGetListQuery = (query) => {
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
                throw new Error('"query" should be a CustomerListQuery object.');
            } else {
                if ('status' in query && !validator.isIn(query.status, statuses)) {
                    throw new Error(`"status" query should be a string. Accepted values are: ${statuses.join(' | ')}`);
                }
                if ('include_initiated' in query && !validator.isBoolean(`${query.include_initiated}`)) {
                    throw new Error('"include_initiated" query should be boolean.');
                }
                if ('kyc_status' in query && !validator.isIn(query.kyc_status, kycStatuses)) {
                    throw new Error(`"kyc_status" query should be a string. Accepted values are: ${kycStatuses.join(' | ')}`);
                }
                if ('first_name' in query && !utils.isString(query.first_name)) {
                    throw new Error('"first_name" query should be a string.');
                }
                if ('last_name' in query && !utils.isString(query.last_name)) {
                    throw new Error('"last_name" query should be a string.');
                }
                if ('email' in query && !utils.isString(query.email)) {
                    throw new Error('"email" query should be a string.');
                }
                if ('locked' in query && !validator.isBoolean(`${query.locked}`)) {
                    throw new Error('"locked" query should be boolean.');
                }
                if ('program_uid' in query && !utils.isString(query.program_uid)) {
                    throw new Error('"program_uid" query should be a string.');
                }
                if ('external_uid' in query && !utils.isString(query.external_uid)) {
                    throw new Error('"external_uid" query should be a string.');
                }
                if ('pool_uid' in query) {
                    if (Array.isArray(query.pool_uid) && query.pool_uid.length > 0) {
                        for (let poolUid of query.pool_uid) {
                            if (!utils.isString(poolUid)) {
                                throw new Error('"pool_uid" query should be an array of strings.');
                            }
                        }
                    } else {
                        throw new Error('"pool_uid" query should be an array of strings.');
                    }
                }
                if ('limit' in query && !Number.isInteger(query.limit)) {
                    throw new Error('"limit" query should be an integer.');
                }
                if ('offset' in query && !Number.isInteger(query.offset)) {
                    throw new Error('"offset" query should be an integer.');
                }
                if ('sort' in query && !validator.isIn(query.sort, sortOptions)) {
                    throw new Error(`"sort" query should be a string. Accepted values are: ${sortOptions.join(' | ')}`);
                }
            }
        };
    }

    /**
     * @ignore
     * @protected
     * @param {string} uid 
     * @param {string} email 
     * @param {CustomerDetails} details 
     */
    _validateUpdateParams(uid, email, details) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error ('Customer "uid" is required.');
        }
        if (email && !validator.isEmail(email)) {
            throw new Error ('"email" is invalid.');
        }
        if (!utils.isObject(details)) {
            throw new Error ('"details" should be a CustomerDetails object.');
        } else {
            if (!details.first_name || validator.isEmpty(details.first_name)) {
                throw new Error ('"details.first_name" is required.');
            }
            if (!details.last_name || validator.isEmpty(details.last_name)) {
                throw new Error ('"details.last_name" is required.');
            }
            if (!details.phone || validator.isEmpty(details.phone)) {
                throw new Error ('"details.phone" is required.');
            }
            if (!details.ssn || validator.isEmpty(details.ssn)) {
                throw new Error ('"details.ssn" is required.');
            }
            if (!details.dob || validator.isEmpty(details.dob)) {
                throw new Error ('"details.dob" is required.');
            }
            if (!validator.isDate(details.dob)) {
                throw new Error ('"details.dob" is not a valid date.');
            }
            if (!utils.isObject(details.address)) {
                throw new Error ('"details.address" should be an Address object.');
            } else {
                if (!details.address.street1 || validator.isEmpty(details.address.street1)) {
                    throw new Error ('"details.address.street1" is required.');
                }
                if (!details.address.city || validator.isEmpty(details.address.city)) {
                    throw new Error ('"details.address.city" is required.');
                }
                if (!details.address.state || validator.isEmpty(details.address.state)) {
                    throw new Error ('"details.address.state" is required.');
                }
                if (!details.address.postal_code || validator.isEmpty(details.address.postal_code)) {
                    throw new Error ('"details.address.postal_code" is required.');
                }
            }
        }
    }

    /**
     * Retrieves a list of Customers filtered by the given parameters. 
     * Filter parameters are not case sensitive, but will only return exact matches. 
     * Multiple filter parameters can be provided at once, but a result will not be returned unless there are exact matches for all submitted parameters.
     * @param {CustomerListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<CustomerList>} - A promise that returns a Customer List if resolved.
     */
    async getList (query={}) {
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

        const filteredQuery = Object.keys(query)
            .filter(key => queryParameters.includes(key))
            .reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: query[key]
                };
            }, {});
        let queryStr = '?' + querystring.stringify(filteredQuery, { arrayFormat: 'bracket' });
        
        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/customers/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async get (uid) {
        // TODO: Implementation
    }

    /**
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
    async update (uid, email, details) {
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
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async archive (uid) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async verifyIdentity (uid) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     * @param {*} lockReason 
     */
    // eslint-disable-next-line
    async lock (uid, lockReason) {
        // TODO: Implementation
    }
    
    /**
     * 
     * @param {*} uid 
     * @param {*} unlockReason 
     */
    // eslint-disable-next-line
    async unlock (uid, unlockReason=null) {
        // TODO: Implementation
    }
}

module.exports = CustomerService;

/** 
 * @typedef {import('./typedefs/customer.typedefs').CustomerListQuery} CustomerListQuery 
 * @typedef {import('./typedefs/customer.typedefs').CustomerList} CustomerList 
 * @typedef {import('./typedefs/customer.typedefs').CustomerDetails} CustomerDetails
 * @typedef {import('./typedefs/customer.typedefs').Customer} Customer
 */
