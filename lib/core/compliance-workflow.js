const validator = require('validator');

/**
 * The Compliance Workflow resource class.
 */
class ComplianceWorkflow {
    /** 
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor(api, auth) {
        /** @ignore @protected */ this._api = api;
        /** @ignore @protected */ this._auth = auth;
    }

    /**
     * Creates a new Compliance Workflow.
     * @param {string} customerExternalUid - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers.
     * @param {string} email - Email address associated with the Customer.
     * @returns {Promise<ComplianceWorkflowEntity>} - A promise that returns the new Compliance Workflow entity if resolved.
     */
    async create(customerExternalUid, email) {
        if (validator.isEmpty(customerExternalUid, { ignore_whitespace: true })) {
            throw new Error('"customerExternalUid" is required.');
        }
        if (!validator.isEmail(email)) {
            throw new Error('"email" is invalid.');
        }

        const authToken = await this._auth.getToken();

        const response = await this._api.post(
            '/compliance_workflows',
            {
                'customer_external_uid': customerExternalUid,
                'email': email
            },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
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

    /**
     * Indicate acceptance or rejection of a Compliance Document within a given Compliance Workflow.
     * @param {string} complianceWorkflowUid - A UID referring to the Compliance Workflow.
     * @param {string} customerUid - A UID referring to the Customer.
     * @param {string} documentUid - A UID referring to the Compliance Document being acknowledged.
     * @param {'yes'|'no'} accept - An indicaation of acceptance or rejection.
     * @param {string} ipAddress - A numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication (required for electronic signing); in this case, the label associated with the computer used by the Customer.
     * @param {string} userName - A label associated with the Customer (required for electronic signing).
     * @returns {Promise<ComplianceWorkflowEntity>} - A promise that returns the new Compliance Workflow entity if resolved.
     */
    async acknowledgeComplianceDocument(
        complianceWorkflowUid,
        customerUid,
        documentUid,
        accept,
        ipAddress = undefined,
        userName = undefined
    ) {
        if (validator.isEmpty(complianceWorkflowUid, { ignore_whitespace: true })) {
            throw new Error('"complianceWorkflowUid" is required.');
        }
        if (validator.isEmpty(customerUid, { ignore_whitespace: true })) {
            throw new Error('"customerUid" is required.');
        }
        if (validator.isEmpty(documentUid, { ignore_whitespace: true })) {
            throw new Error('"documentUid" is required.');
        }
        if (accept !== 'yes' && accept !== 'no') {
            throw new Error('The value for "accept" is should be either "yes" or "no".');
        }

        const authToken = await this._auth.getToken();

        const response = await this._api.post(
            `/compliance_workflows/${complianceWorkflowUid}/acknowledge_document`,
            {
                'customer_uid': customerUid,
                'document_uid': documentUid,
                'accept': accept,
                'ip_address': ipAddress,
                'user_name': userName
            },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = ComplianceWorkflow;

/** @typedef {import('./typedefs/compliance-workflow.typedefs').ComplianceWorkflowEntity} ComplianceWorkflowEntity */