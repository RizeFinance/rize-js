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
     * @ignore @protected
     * Validates the parameters for the "upload" method
     */
    protected _validateUploadParams(evaluationUid: any, filename: any, fileContent: any, note: any, type: any): void;
    /**
     * Retrieves KYC Documents for a given evaluation.
     * @param {string} evaluationUid - An object containing key value pair for getting the results list.
     * @returns {Promise<RizeList<KYCDocument>>} A promise that returns a List of KYC Documents if resolved.
     * @example
     * const kycDocuments = await rize.kycDocument.getList('QSskNJkryskRXeYt');
     */
    getList(evaluationUid: string): Promise<RizeList<KYCDocument>>;
    /**
     * Upload a KYC Document for review. This will upload the Document to our KYC partner,
     * and create a record of the Document on the Rize platform. Preferred file types are JPG, PDF, and PNG.
     * @param {string} evaluationUid - A uid referring to the evaluation with which this document is associated
     * @param {string} filename - The name of the file to be uploaded
     * @param {string} fileContent - The contents of the file to be uploaded, base64-encoded.
     * @param {string} note - A note describing this document
     * @param {'contract' | 'license' | 'other' | 'passport' | 'utility'} type
     * @returns {Promise<KYCDocument>} A promise that returns a KYC Document if resolved.
     * @example
     * const kycDocument = await rize.kycDocument.upload(
     *     'evaluation_uid1',
     *     'file_name1',
     *     '<base64 encoded image>',
     *     'note for the document'
     *     'other'
     * );
     */
    upload(evaluationUid: string, filename: string, fileContent: string, note: string, type: 'contract' | 'license' | 'other' | 'passport' | 'utility'): Promise<KYCDocument>;
    /**
     * Retrieve metadata for a KYC Document previously uploaded to our KYC partner for evaluation.
     * @param {string} uid - Rize-generated unique KYC Document id
     * @returns {Promise<KYCDocument>} A promise that returns a KYC Document Metadata if resolved.
     * @example const kycDocumentMetadata = await rize.kycDocument.getMetadata(kycDocumentUid);
     */
    getMetadata(uid: string): Promise<KYCDocument>;
    /**
     * Retrieve a document (image, PDF, etc) previously uploaded to our KYC partner for evaluation.
     * The response will include headers that indicate the format of the returned file,
     * e.g. Content-Type: image/jpeg,
     *      Content-Disposition: attachment;
     *      filename="fred.jpg";
     *      filename*=UTF-8''fred.jpg,
     *      Content-Transfer-Encoding: binary
     * @param {string} uid - Rize-generated unique KYC Document id
     * @returns {Promise<HTTPResponse>} A promise that returns a base64-encoded KYC Document string if resolved.
     * @example const kycDocument = await rize.kycDocument.get(kycDocumentUid);
     */
    get(uid: string): Promise<HTTPResponse>;
    /**
     * Retrieve a base64-encoded document (image, PDF, etc) previously uploaded to our KYC partner for evaluation.
     * @param {string} uid - Rize-generated unique KYC Document id
     * @returns {Promise<string>} A promise that returns a base64-encoded KYC Document string if resolved.
     * @example const kycDocument = await rize.kycDocument.getBase64(kycDocumentUid);
     */
    getBase64(uid: string): Promise<string>;
}
declare namespace KYCDocumentService {
    export { KYCDocument, RizeList, HTTPResponse };
}
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type KYCDocument = import('./typedefs/kyc-document.typedefs').KYCDocument;
type HTTPResponse<T> = import('./typedefs/common.typedefs').HTTPResponse<T>;
