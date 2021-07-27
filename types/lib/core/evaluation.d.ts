export = EvaluationService;
/**
 * The Evaluation service class
 */
declare class EvaluationService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     */
    constructor(api: import('axios').AxiosInstance);
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     */
    protected _validateGetParams(uid: any): void;
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     */
    protected _validateGetListQuery(query: any): void;
    /**
     * Retrieves a list of Evaluation filtered by the given parameters.
     * @param {EvaluationListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Evaluation>>} A promise that returns an Evaluation List if resolved.
     * @example
     * const evaluations = await rize.evaluation.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     latest: true
     * });
     */
    getList(query?: EvaluationListQuery): Promise<RizeList<Evaluation>>;
    /**
     * Get a single Evaluation
     *
     * @param {string} uid - Rize-generated unique evaluation id
     * @returns {Promise<Evaluation>} A promise that returns an Evaluation if resolved.
     * @example const evaluation = await rize.evaluation.get(evaludationUid);
     */
    get(uid: string): Promise<Evaluation>;
}
declare namespace EvaluationService {
    export { EvaluationListQuery, Evaluation, RizeList };
}
type EvaluationListQuery = import('./typedefs/evaluation.typedefs').EvaluationListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type Evaluation = import('./typedefs/evaluation.typedefs').Evaluation;
