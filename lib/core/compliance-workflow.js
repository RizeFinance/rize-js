const validator = require('validator');

/**
 * The Compliance Workflow resource class.
 */
class ComplianceWorkflowResource {
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
     * @ignore
     * @protected
     * @param {string} complianceWorkflowUid - A UID referring to the Compliance Workflow.
     * @param {string} customerUid - A UID referring to the Customer.
     */
    _validateAcknowledgeDocumentParams(complianceWorkflowUid, customerUid) {
        if (validator.isEmpty(complianceWorkflowUid, { ignore_whitespace: true })) {
            throw new Error('"complianceWorkflowUid" is required.');
        }
        if (validator.isEmpty(customerUid, { ignore_whitespace: true })) {
            throw new Error('"customerUid" is required.');
        }
    }

    /**
     * @ignore
     * @protected
     * @param {ComplianceDocumentAcknowledgementRequest} document
     */
    _validateAcknowledgeDocumentDocument(document) {
        const { documentUid, accept } = document;
        
        if (validator.isEmpty(documentUid, { ignore_whitespace: true })) {
            throw new Error('"documentUid" is required.');
        }
        if (accept !== 'yes' && accept !== 'no') {
            throw new Error('The value for "accept" is should be either "yes" or "no".');
        }
    }

    /**
     * Creates a new Compliance Workflow.
     * @param {string} customerExternalUid - A Customer identifier supplied by the Partner, unique among the collection of all partner Customers.
     * @param {string} email - Email address associated with the Customer.
     * @returns {Promise<ComplianceWorkflow>} - A promise that returns the new Compliance Workflow entity if resolved.
     * @example
     * const newWorkflow = await rize.complianceWorkflow.create('client-generated-42', 'tomas@example.com'); 
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
     * Retrieves the most recent Compliance Workflow for a Customer.
     * @param {string} customerUid - A UID referring to the Customer
     * @returns {Promise<ComplianceWorkflow>} - A promise that returns the new Compliance Workflow entity if resolved.
     * @example
     * const latestWorkflow = await rize.complianceWorkflow.viewLatest('h9MzupcjtA3LPW2e'); 
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

    /**
     * Indicate acceptance or rejection of Compliance Documents within a given Compliance Workflow.
     * @param {string} complianceWorkflowUid - A UID referring to the Compliance Workflow.
     * @param {string} customerUid - A UID referring to the Customer.
     * @param {...ComplianceDocumentAcknowledgementRequest} documents
     * @returns {Promise<ComplianceWorkflow>} - A promise that returns the new Compliance Workflow entity if resolved.
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
    async acknowledgeComplianceDocuments(
        complianceWorkflowUid,
        customerUid,
        ...documents
    ) {
        this._validateAcknowledgeDocumentParams(complianceWorkflowUid, customerUid);

        if (documents.length === 0) {
            throw new Error('Please submit at least one document.');
        }
        
        documents.forEach(this._validateAcknowledgeDocumentDocument);

        const authToken = await this._auth.getToken();

        const response = await this._api.put(
            `/compliance_workflows/${complianceWorkflowUid}/batch_acknowledge_documents`,
            {
                'customer_uid': customerUid,
                'documents': documents.map(doc => ({
                    'accept': doc.accept,
                    'document_uid': doc.documentUid,
                    'ip_address': doc.ipAddress,
                    'user_name': doc.userName
                }))
            },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = ComplianceWorkflowResource;

/** 
 * @typedef {import('./typedefs/compliance-workflow.typedefs').ComplianceWorkflow} ComplianceWorkflow
 * @typedef {import('./typedefs/compliance-workflow.typedefs').ComplianceDocumentAcknowledgementRequest} ComplianceDocumentAcknowledgementRequest
 */