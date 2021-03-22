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
     * Validates parameters for the getList method.
     */
    protected _validateGetListParams(evaluationUid: any): void;
    /**
     * Retrieves KYC Documents for a given evaluation.
     * @param {string} evaluationUid - An object containing key value pair for getting the results list.
     * @returns {Promise<RizeList<KYCDocument>>} A promise that returns a List of KYC Documents if resolved.
     * @example
     * const kycDocuments = await rize.kycDocument.getList('QSskNJkryskRXeYt');
     */
    getList(evaluationUid: string): Promise<RizeList<KYCDocument>>;
}
declare namespace KYCDocumentService {
    export { KYCDocument, RizeList };
}
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type KYCDocument = import('./typedefs/kyc-document.typedefs').KYCDocument;
