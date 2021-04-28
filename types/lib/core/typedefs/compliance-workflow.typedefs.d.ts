export type ComplianceWorkflowSummary = {
    accepted_quantity: number;
    /**
     * - The DateTime at which this Compliance Workflow was requested
     */
    begun_at: string;
    completed_step: number;
    current_step: number;
    /**
     * A value indicating the current state of this Compliance Workflow:
     * - *accepted* - The Compliance Workflow is complete. All documents in this Compliance Workflow have been accepted.
     * - *in_progress* - The Compliance Workflow is in progress.
     * - *rejected* - The Compliance Workflow is rejected. If Rize receives an acknowledgment to a document in a Compliance Workflow with an 'accept' value of 'no', the Compliance Workflow moves to a status of rejected. The Customer must restart a new Compliance Workflow to gain access to the Program.
     * - *expired* - The Compliance Workflow is expired. Rize did not receive all acknowledgments for this Compliance Workflow in the time period allotted for your Program. The Customer must restart a new Compliance Workflow to gain access to the Program.
     */
    status: 'accepted' | 'in_progress' | 'rejected' | 'expired';
};
export type ComplianceWorkflowCustomer = {
    email: string;
    /**
     * - A Customer identifier supplied by the Client, unique among the collection of all Client Customers
     */
    external_uid: string;
    /**
     * - A UID referring to the Customer
     */
    uid: string;
};
export type ComplianceDocument = {
    electronic_signature_required: 'yes' | 'no';
    /**
     * - Amazon S3 key used to retrieve the contents of a Compliance Document
     */
    external_storage_name: string;
    /**
     * - Amazon S3 URL used to retrieve the contents of a Compliance Document
     */
    compliance_document_url: string;
    name: string;
    /**
     * - Multiple Compliance Documents are grouped into a Step, and Compliance Documents are presented to a Customer, Step-by-Step
     */
    step: number;
    version: number;
    /**
     * - A UID referring to a Compliance Document; note that this UID will be different for each Customer
     */
    uid: string;
    /**
     * - The DateTime at which this Compliance Document was acknowledged
     */
    accepted_at: string;
};
export type ComplianceDocumentAcknowledgementRequest = {
    /**
     * - A UID referring to the Compliance Document being acknowledged.
     */
    document_uid: string;
    /**
     * - An indication of acceptance or rejection.
     */
    accept: 'yes' | 'no';
    /**
     * - A label associated with the Customer (required for electronic signing).
     */
    user_name: string | null;
    /**
     * - A numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication (required for electronic signing); in this case, the label associated with the computer used by the Customer.
     */
    ip_address: string | null;
};
export type ComplianceWorkflow = {
    /**
     * - A unique identifier generated by Rize.
     */
    uid: string;
    summary: ComplianceWorkflowSummary;
    customer: ComplianceWorkflowCustomer;
    accepted_documents: Array<ComplianceDocument>;
    /**
     * - Compliance Documents that await acknowledgment in the current Step
     */
    current_step_documents_pending: Array<Omit<ComplianceDocument, 'accepted_at'>>;
    /**
     * - The set of all Compliance Documents that would require acknowledgment
     */
    all_documents: Array<Omit<ComplianceDocument, 'accepted_at' | 'uid'>>;
};
