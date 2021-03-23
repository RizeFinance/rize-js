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
     * Validates the parameters for the "get" method
     */
    protected _validateGetParams(uid: any): void;
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
    /**
     * Retrieve metadata for a KYC Document previously uploaded to our KYC partner for evaluation.
     * @param {string} uid - Rize-generated unique id
     * @returns {Promise<KYCDocument>} A promise that returns a KYC Document Metadata if resolved.
     * @example const kycDocumentMetadata = await rize.kycDocument.getMetadata(kycDocumentUid);
     */
    getMetadata(uid: string): Promise<KYCDocument>;
}
declare namespace KYCDocumentService {
    export { KYCDocument, RizeList };
}
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type KYCDocument = import('./typedefs/kyc-document.typedefs').KYCDocument;
