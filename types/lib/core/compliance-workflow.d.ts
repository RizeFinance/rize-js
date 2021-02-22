export = ComplianceWorkflowService;
/**
 * The Compliance Workflow service class.
 */
declare class ComplianceWorkflowService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor(api: import('axios').AxiosInstance, auth: import('./auth'));
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /** @ignore @protected */ protected _auth: import("./auth");
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
     * Creates a new Compliance Workflow.
     * @param {string} customerExternalUid - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers.
     * @param {string} email - Email address associated with the Customer.
     * @returns {Promise<ComplianceWorkflow>} - A promise that returns the new Compliance Workflow if resolved.
     * @example
     * const newWorkflow = await rize.complianceWorkflow.create('client-generated-42', 'tomas@example.com');
     */
    create(customerExternalUid: string, email: string): Promise<ComplianceWorkflow>;
    /**
     * Renew a Compliance Workflow after it expired the given timeframe
     * @param {string} customerExternalUid - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers.
     * @param {string} customerUid - A UID referring to the Customer generated by Rize
     * @param {string} email - Email address associated with the Customer.
     * @returns {Promise<ComplianceWorkflowEntity>} A promise that returns the new Compliance Workflow entity if resolved.
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
     * @param {...ComplianceDocumentAcknowledgementRequest} documents
     * @returns {Promise<ComplianceWorkflow>} - A promise that returns the updated Compliance Workflow if resolved.
     * @example
     * // Acknowledge a single compliance document
     * const updatedWorkflow = await rize.complianceWorkflow.acknowledgeComplianceDocuments(
     *     'SPbiwv93C6M5pSWu', //complianceWorkflowUid
     *     'h9MzupcjtA3LPW2e', //customerUid
     *     {
     *         documentUid: 'Yqyjk5b2xgQ9FrxS',
     *         accept: 'yes',
     *         userName: 'Olive Oyl',
     *         ipAddress: '152.32.111.61'
     *     }
     * );
     *
     * // Acknowledge multiple compliance documents
     * const documentUidsToAcknowledge = ['Yqyjk5b2xgQ9FrxS', 'dc6PApa2nn9K3jwL'];
     * const updatedWorkflow = await rize.complianceWorkflow.acknowledgeComplianceDocuments(
     *     'SPbiwv93C6M5pSWu', //complianceWorkflowUid
     *     'h9MzupcjtA3LPW2e', //customerUid
     *     ...documentUidsToAcknowledge.map(uid => ({
     *         documentUid: uid,
     *         accept: 'yes',
     *         userName: 'Olive Oyl',
     *         ipAddress: '152.32.111.61'
     *     }))
     * );
     */
    acknowledgeComplianceDocuments(complianceWorkflowUid: string, customerUid: string, ...documents: ComplianceDocumentAcknowledgementRequest[]): Promise<ComplianceWorkflow>;
}
declare namespace ComplianceWorkflowService {
    export { ComplianceWorkflow, ComplianceDocumentAcknowledgementRequest };
}
type ComplianceDocumentAcknowledgementRequest = {
    /**
     * - A UID referring to the Compliance Document being acknowledged.
     */
    documentUid: string;
    /**
     * - An indication of acceptance or rejection.
     */
    accept: "yes" | "no";
    /**
     * - A label associated with the Customer (required for electronic signing).
     */
    userName: string;
    /**
     * - A numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication (required for electronic signing); in this case, the label associated with the computer used by the Customer.
     */
    ipAddress: string;
};
type ComplianceWorkflow = {
    /**
     * - A unique identifier generated by Rize.
     */
    uid: string;
    summary: import("./typedefs/compliance-workflow.typedefs").ComplianceWorkflowSummary;
    customer: import("./typedefs/compliance-workflow.typedefs").ComplianceWorkflowCustomer;
    accepted_documents: import("./typedefs/compliance-workflow.typedefs").ComplianceDocument[];
    /**
     * - Compliance Documents that await acknowledgment in the current Step
     */
    current_step_documents_pending: Pick<import("./typedefs/compliance-workflow.typedefs").ComplianceDocument, "electronic_signature_required" | "external_storage_name" | "compliance_document_url" | "name" | "step" | "version" | "uid">[];
    /**
     * - The set of all Compliance Documents that would require acknowledgment
     */
    all_documents: Pick<import("./typedefs/compliance-workflow.typedefs").ComplianceDocument, "electronic_signature_required" | "external_storage_name" | "compliance_document_url" | "name" | "step" | "version">[];
};
