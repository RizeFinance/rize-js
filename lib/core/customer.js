const validator = require('validator');
const querystring = require('query-string');

/**
 * The Customer resource class.
 */
class Customer {
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
            const isObject = item => !!item && item.constructor === Object;
            const isString = item => typeof item === 'string' || item instanceof String;
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
            if (!isObject(query)) {
                throw new Error('query is invalid.');
            } else {
                if ('status' in query && !validator.isIn(query.status, statuses)) {
                    throw new Error('"status" query is invalid.');
                }
                if ('include_initiated' in query && !validator.isBoolean(`${query.include_initiated}`)) {
                    throw new Error('"include_initiated" query is invalid.');
                }
                if ('kyc_status' in query && !validator.isIn(query.kyc_status, kycStatuses)) {
                    throw new Error('"kyc_status" query is invalid.');
                }
                if ('first_name' in query && !isString(query.first_name)) {
                    throw new Error('"first_name" query is invalid.');
                }
                if ('last_name' in query && !isString(query.last_name)) {
                    throw new Error('"last_name" query is invalid.');
                }
                if ('email' in query && !isString(query.email)) {
                    throw new Error('"email" query is invalid.');
                }
                if ('locked' in query && !validator.isBoolean(`${query.locked}`)) {
                    throw new Error('"locked" query is invalid.');
                }
                if ('program_uid' in query && !isString(query.program_uid)) {
                    throw new Error('"program_uid" query is invalid.');
                }
                if ('external_uid' in query && !isString(query.external_uid)) {
                    throw new Error('"external_uid" query is invalid.');
                }
                if ('pool_uid' in query) {
                    if (Array.isArray(query.pool_uid) && query.pool_uid.length > 0) {
                        for (let poolUid of query.pool_uid) {
                            if (!isString(poolUid)) {
                                throw new Error('"pool_uid" query is invalid.');
                            }
                        }
                    } else {
                        throw new Error('"pool_uid" query is invalid.');
                    }
                }
                if ('limit' in query && !Number.isInteger(query.limit)) {
                    throw new Error('"limit" query is invalid.');
                }
                if ('offset' in query && !Number.isInteger(query.offset)) {
                    throw new Error('"offset" query is invalid.');
                }
                if ('sort' in query && !validator.isIn(query.sort, sortOptions)) {
                    throw new Error('"sort" query is invalid.');
                }
            }
        };
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
     * 
     * @param {*} uid 
     * @param {*} email 
     * @param {*} details 
     */
    // eslint-disable-next-line
    async update (uid, email, details) {
        // TODO: Implementation
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

module.exports = Customer;

/** 
 * @typedef {import('./typedefs/customer.typedefs').CustomerListQuery} CustomerListQuery 
 * @typedef {import('./typedefs/customer.typedefs').CustomerList} CustomerList 
 */
