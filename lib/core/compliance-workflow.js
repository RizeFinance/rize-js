class ComplianceWorkflow {
    constructor(api, auth) {
        /** @protected */ this._api = api;
        /** @protected */ this._auth = auth;
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
}


module.exports = ComplianceWorkflow;