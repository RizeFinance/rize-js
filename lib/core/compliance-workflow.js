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
     * Create a new Compliance Workflow.
     * @param {string} customerExternalUid - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers.
     * @param {string} email - Email address associated with the Customer.
     * @returns {Promise<ComplianceWorkflowEntity>} A promise that returns the new Compliance Workflow entity if resolved.
     */
    async create(customerExternalUid, email) {
        if (validator.isEmpty(customerExternalUid, { ignore_whitespace: true })) {
            throw new Error('customerExternalUid is required.');
        }
        if (!validator.isEmail(email)) {
            throw new Error('email is invalid.');
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
     * @param {string} customerUid - A UID referring to the Customer
     * @returns {Promise<ComplianceWorkflowEntity>}
     */
    async viewLatest(customerUid) {
        if (validator.isEmpty(customerUid, { ignore_whitespace: true })) {
            throw new Error('customerUid is required.');
        }

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/compliance_workflows/latest/${customerUid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    // eslint-disable-next-line
    acknowledgeComplianceDocument(workflowUid, documentUid) {

    }
}

module.exports = ComplianceWorkflow;

/** @typedef {import('./typedefs/compliance-workflow.typedefs').ComplianceWorkflowEntity} ComplianceWorkflowEntity */