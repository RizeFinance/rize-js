export = DocumentService;
/**
 * The Document service class
 */
declare class DocumentService {
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
     * Validates the parameters for the "view" method
     */
    protected _validateViewParams(uid: any, extension: any): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: any): void;
    /**
     * Retrieves a list of Documents filtered by the given parameters.
     * @param {DocumentListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<Document>>} A promise that returns a Document List if resolved.
     * @example
     * const documents = await rize.document.getList({
     *     month: 1,
     *     year: 2021,
     *     scope_type: 'customer',
     *     custodial_account_uid: 'custodial_account_uid1',
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
     *     limit: 50,
     *     offset: 0
     * });
     */
    getList(query?: DocumentListQuery): Promise<RizeList<Document>>;
    /**
     * View or download a document
     *
     * @param {string} uid - Rize-generated unique document id
     * @param {'pdf' | 'html' | 'json'} extension - the type of file to download.
     * @returns {Promise<HTTPResponse>} A promise that returns a downloaded Document if resolved.
     * @example const document = await rize.document.view(documentUid, 'pdf');
     */
    view(uid: string, extension?: 'pdf' | 'html' | 'json'): Promise<HTTPResponse>;
    /**
     * Retrieve a base64-encoded document (image, PDF, etc)
     * @param {string} uid - Rize-generated unique Document id
     * @returns {Promise<string>} A promise that returns a base64-encoded Document string if resolved.
     * @example const document = await rize.document.viewBase64(documentUid);
     */
    viewBase64(uid: string, extension?: string): Promise<string>;
    /**
     * Get a single Document
     *
     * @param {string} uid - Rize-generated unique document id
     * @returns {Promise<Document>} A promise that returns a Document if resolved.
     * @example const document = await rize.document.get(documentUid);
     */
    get(uid: string): Promise<Document>;
}
declare namespace DocumentService {
    export { DocumentListQuery, Document, RizeList, HTTPResponse };
}
type DocumentListQuery = import('./typedefs/document.typedefs').DocumentListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type Document = import('./typedefs/document.typedefs').Document;
type HTTPResponse<T> = import('./typedefs/common.typedefs').HTTPResponse<T>;
