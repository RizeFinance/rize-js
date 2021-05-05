export = PoolService;
/**
 * The Pool service class.
 */
declare class PoolService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     */
    constructor(api: import('axios').AxiosInstance);
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {PoolListQuery} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: PoolListQuery): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * Get a single Pool
     * @param {string} uid - Rize-generated unique pool id
     * @returns {Promise<Pool>} - A promise that returns a Pool if resolved.
     * @example const pool = await rize.pool.get(poolUid);
     */
    get(uid: string): Promise<Pool>;
    /**
     * Retrieves a list of Pools filtered by the given parameters.
     * @param {PoolListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<PoolList>>} - A promise that returns a Pool list if resolved.
     * @example
     * const poolList = await rize.pool.getList({
     *     customer_uid: ['uKxmLxUEiSj5h4M3', 'y9reyPMNEWuuYSC1'],
     *     external_uid: client-generated-id,
     *     limit: 50,
     *     offset: 0,
     * });
     */
    getList(query?: PoolListQuery): Promise<RizeList<any>>;
}
declare namespace PoolService {
    export { Pool, PoolListQuery, RizeList };
}
type PoolListQuery = import('./typedefs/pool.typedefs').PoolListQuery;
type Pool = import('./typedefs/pool.typedefs').Pool;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
