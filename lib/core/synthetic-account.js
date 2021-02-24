/**
 * The Synthetic Account service class.
 */
class SyntheticAccountService {
    /** 
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor (api, auth) {
        /** @ignore @protected */ this._api = api;
        /** @ignore @protected */ this._auth = auth;
    }

    /**
     * 
     * @param {*} query 
     */
    // eslint-disable-next-line
    async getList(query={}) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async get(uid) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} name 
     * @param {*} poolUid 
     * @param {*} syntheticAccountTypeUid 
     * @param {*} options 
     */
    // eslint-disable-next-line
    async create(name, poolUid, syntheticAccountTypeUid, options={}) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     * @param {*} name 
     * @param {*} note 
     */
    // eslint-disable-next-line
    async update(uid, name, note) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async archive(uid) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} query 
     */
    // eslint-disable-next-line
    async getTypesList(query={}) {
        // TODO: Implementation
    }

    /**
     * 
     * @param {*} uid 
     */
    // eslint-disable-next-line
    async getType(uid) {
        // TODO: Implementation
    }
}

module.exports = SyntheticAccountService;
