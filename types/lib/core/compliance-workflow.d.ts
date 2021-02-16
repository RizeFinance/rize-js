export = ComplianceWorkflow;
/**
 * The Compliance Workflow resource class
 */
declare class ComplianceWorkflow {
    /** @hideconstructor */
    constructor(api: any, auth: any);
    /** @ignore @protected */ protected _api: any;
    /** @ignore @protected */ protected _auth: any;
    /**
     * Associate a new Compliance Workflow and set of Compliance Documents (for acknowledgment) with a Customer.
     * @param {string} customerExternalUid
     * @param {string} email
     * @returns {Promise<any>}
     */
    create(customerExternalUid: string, email: string): Promise<any>;
    renew(customerExternalUid: any, email: any, customerUid: any): void;
    /**
     * Retrieves the most recent Compliance Workflow for a Customer. A Customer UID must be supplied as the path parameter.
     * @returns {Promise<string>}
     */
    viewLatest(customerUid: any): Promise<string>;
    acknowledgeComplianceDocument(workflowUid: any, documentUid: any): void;
}
