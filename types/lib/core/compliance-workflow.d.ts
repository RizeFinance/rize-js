export = ComplianceWorkflowService;
/**
 * The Compliance Workflow service class.
 */
declare class ComplianceWorkflowService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     */
    constructor(api: import('axios').AxiosInstance);
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {ComplianceWorkflowListQuery} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: ComplianceWorkflowListQuery): void;
    /**
     * @ignore
     * @protected
     * @param {string} complianceWorkflowUid - A UID referring to the Compliance Workflow.
     * @param {string} customerUid - A UID referring to the Customer.
     */
    protected _validateAcknowledgeDocumentParams(complianceWorkflowUid: string, customerUid: string): void;
    /**
     * @ignore
     * @protected
     * @param {ComplianceDocumentAcknowledgementRequest} document
     */
    protected _validateAcknowledgeDocumentDocument(document: ComplianceDocumentAcknowledgementRequest): void;
    /**
     * Retrieves a list of Compliance Workflows filtered by the given parameters.
     * Filter parameters are not case sensitive, but will only return exact matches.
     * Multiple filter parameters can be provided at once, but a result will not be returned unless there are exact matches for all submitted parameters.
     * @param {ComplianceWorkflowListQuery} query - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<ComplianceWorkflow>>} - A promise that returns a Compliance Workflow list if resolved.
     * @example
     * const complianceWorkflowList = await rize.complianceWorkflow.getList({
     *     customer_uid: [customerUid],
     *     product_uid: [productUid],
     *     limit: 50,
     *     offset: 0,
     * });
     */
    getList(query?: ComplianceWorkflowListQuery): Promise<RizeList<ComplianceWorkflow>>;
    /**
     * Creates a new Compliance Workflow.
     * @param {string} customerUid - A UID referring to the Customer generated by Rize
     * @param {string} productCompliancePlanUid - A unique identifier for a Compliance Plan
     * @returns {Promise<ComplianceWorkflow>} - A promise that returns the new Compliance Workflow if resolved.
     * @example
     * const newWorkflow = await rize.complianceWorkflow.create('4Qp6ytVLKg4tvR112', 'compliance-plan-123');
     */
    create(customerUid: string, productCompliancePlanUid: string): Promise<ComplianceWorkflow>;
    /**
     * @deprecated
     * Renew a Compliance Workflow after it expired the given timeframe
     * @param {string} customerExternalUid - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers.
     * @param {string} customerUid - A UID referring to the Customer generated by Rize
     * @param {string} email - Email address associated with the Customer.
     * @returns {Promise<ComplianceWorkflow>} A promise that returns the new Compliance Workflow entity if resolved.
     */
    renew(customerExternalUid: string, customerUid: string, email: string): Promise<ComplianceWorkflow>;
    /**
     * Retrieves the most recent Compliance Workflow for a Customer.
     * @param {string} customerUid - A UID referring to the Customer
     * @returns {Promise<ComplianceWorkflow>} - A promise that returns the latest Compliance Workflow if resolved.
     * @example
     * const latestWorkflow = await rize.complianceWorkflow.viewLatest('h9MzupcjtA3LPW2e');
     */
    viewLatest(customerUid: string): Promise<ComplianceWorkflow>;
    /**
     * Indicate acceptance or rejection of Compliance Documents within a given Compliance Workflow.
     * @param {string} complianceWorkflowUid - A UID referring to the Compliance Workflow.
     * @param {string} customerUid - A UID referring to the Customer.
     * @param {ComplianceDocumentAcknowledgementRequest | Array<ComplianceDocumentAcknowledgementRequest>} documents
     * @returns {Promise<ComplianceWorkflow>} - A promise that returns the updated Compliance Workflow if resolved.
     * @example
     * // Acknowledge a single compliance document
     * const updatedWorkflow = await rize.complianceWorkflow.acknowledgeComplianceDocuments(
     *     'SPbiwv93C6M5pSWu', //complianceWorkflowUid
     *     'h9MzupcjtA3LPW2e', //customerUid
     *     {
     *         document_uid: 'Yqyjk5b2xgQ9FrxS',
     *         accept: 'yes',
     *         user_name: 'Olive Oyl',
     *         ip_address: '152.32.111.61'
     *     }
     * );
     *
     * // Acknowledge multiple compliance documents
     * const updatedWorkflow = await rize.complianceWorkflow.acknowledgeComplianceDocuments(
     *     'SPbiwv93C6M5pSWu', //complianceWorkflowUid
     *     'h9MzupcjtA3LPW2e', //customerUid
     *     [{
     *         document_uid: 'Yqyjk5b2xgQ9FrxS',
     *         accept: 'yes',
     *         user_name: 'Olive Oyl',
     *         ip_address: '152.32.111.61'
     *     }, {
     *         document_uid: 'dc6PApa2nn9K3jwL',
     *         accept: 'yes',
     *         user_name: 'Olive Oyl',
     *         ip_address: '152.32.111.61'
     *     }])
     * );
     */
    acknowledgeComplianceDocuments(complianceWorkflowUid: string, customerUid: string, documents: ComplianceDocumentAcknowledgementRequest | Array<ComplianceDocumentAcknowledgementRequest>): Promise<ComplianceWorkflow>;
}
declare namespace ComplianceWorkflowService {
    export { ComplianceWorkflow, ComplianceDocumentAcknowledgementRequest, RizeList };
}
type ComplianceDocumentAcknowledgementRequest = import('./typedefs/compliance-workflow.typedefs').ComplianceDocumentAcknowledgementRequest;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type ComplianceWorkflow = import('./typedefs/compliance-workflow.typedefs').ComplianceWorkflow;
