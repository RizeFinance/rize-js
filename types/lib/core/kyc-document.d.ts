export = KYCDocumentService;
/**
 * The KYC Document service class
 */
declare class KYCDocumentService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor(api: import('axios').AxiosInstance, auth: import('./auth'));
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /** @ignore @protected */ protected _auth: import("./auth");
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: any): void;
    /**
     * Retrieves KYC Documents for a given evaluation.
     * @param {KYCDocumentListQuery} query - An object containing key value pair for getting the results list.
     * @returns {Promise<RizeList<KYCDocument>>} A promise that returns a List of KYC Documents if resolved.
     * @example
     * const kycDocuments = await rize.kycDocument.getList({
     *     evaluation_uid: 'QSskNJkryskRXeYt'
     * });
     */
    getList(query?: KYCDocumentListQuery): Promise<RizeList<KYCDocument>>;
}
declare namespace KYCDocumentService {
    export { KYCDocumentListQuery, KYCDocument, RizeList };
}
type KYCDocumentListQuery = import('./typedefs/kyc-document.typedefs').KYCDocumentListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type KYCDocument = import('./typedefs/kyc-document.typedefs').KYCDocument;
