/**
 * The Compliance Workflow resource class.
 */
class ComplianceWorkflow {
    /** @hideconstructor */
    constructor(api, auth) {
        /** @ignore @protected */ this._api = api;
        /** @ignore @protected */ this._auth = auth;
    }

    /**
     * Create a new Compliance Workflow.
     * @param {string} customerExternalUid 
     * @param {string} email
     * @returns {Promise<ComplianceWorkflowEntity>}
     */
    // eslint-disable-next-line
    create(customerExternalUid, email) {
        // TODO: Implementation
    }

    // eslint-disable-next-line
    renew(customerExternalUid, email, customerUid) {
        // TODO: Implementation
    }

    /**
     * Retrieves the most recent Compliance Workflow for a Customer. A Customer UID must be supplied as the path parameter.
     * @returns {Promise<string>}
     */
    viewLatest() {
        // TODO: Actual implementation
        const token = this._auth.getToken();
        return token;
    }
    
    // eslint-disable-next-line
    acknowledgeComplianceDocument(workflowUid, documentUid) {

    }
}

module.exports = ComplianceWorkflow;

/** @typedef {import("./typedefs/compliance-workflow.typedefs").ComplianceWorkflowEntity} ComplianceWorkflowEntity */