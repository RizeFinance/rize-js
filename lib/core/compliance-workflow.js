function ComplianceWorkflow(
    api,
    auth
) {
    /** @private */
    this._api = api;

    /** @private */
    this._auth = auth;
}

/**
 * Compliance Workflow class
 * @class ComplianceWorkflow
 */
ComplianceWorkflow.prototype = {
    /**
     * Retrieves the most recent Compliance Workflow for a Customer. A Customer UID must be supplied as the path parameter.
     * @returns {Promise<string>}
     */
    viewLatest() {
        // TODO: Actual implementation
        const token = this._auth.getToken();
        return token;
    }
};

module.exports = ComplianceWorkflow;