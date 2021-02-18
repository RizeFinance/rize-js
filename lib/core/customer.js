// eslint-disable-next-line
const validator = require('validator');

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
    }

    /**
     * Retrieves a list of Customers filtered by the given parameters. 
     * Filter parameters are not case sensitive, but will only return exact matches. 
     * Multiple filter parameters can be provided at once, but a result will not be returned unless there are exact matches for all submitted parameters.
     * @param {CustomerListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<CustomerList>} - A promise that returns a Customer List if resolved.
     */
    async getList (query={}) {
        const isAnObject = item => !!item && item.constructor === Object;
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
        if (!isAnObject(query)) {
            throw new Error('query is invalid.');
        } else {
            if (!query.status && validator.isIn(query.status, statuses)) {

            }
        }

        let queryStr = '?';
        for (const key in query) {
            if (queryParameters.includes(key)) {
                queryStr += query[key];
            }
        }
        console.log(queryStr);        

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
