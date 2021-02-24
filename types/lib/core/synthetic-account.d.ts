export = SyntheticAccountService;
/**
 * The Synthetic Account service class.
 */
declare class SyntheticAccountService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor(api: import('axios').AxiosInstance, auth: import('./auth'));
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /** @ignore @protected */ protected _auth: import("./auth");
    /**
     *
     * @param {*} query
     */
    getList(query?: any): Promise<string>;
    /**
     *
     * @param {*} uid
     */
    get(uid: any): Promise<void>;
    /**
     *
     * @param {*} name
     * @param {*} poolUid
     * @param {*} syntheticAccountTypeUid
     * @param {*} options
     */
    create(name: any, poolUid: any, syntheticAccountTypeUid: any, options?: any): Promise<void>;
    /**
     *
     * @param {*} uid
     * @param {*} name
     * @param {*} note
     */
    update(uid: any, name: any, note: any): Promise<void>;
    /**
     *
     * @param {*} uid
     */
    archive(uid: any): Promise<void>;
    /**
     *
     * @param {*} query
     */
    getTypesList(query?: any): Promise<void>;
    /**
     *
     * @param {*} uid
     */
    getType(uid: any): Promise<void>;
}
