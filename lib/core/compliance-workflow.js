function ComplianceWorkflow(
    api,
    auth
) {
    /**
     * @returns {Promise<string>}
     */
    this.viewLatest = () => {
        // TODO: Actual implementation
        const token = auth.getToken();
        return token;
    };
}

module.exports = ComplianceWorkflow;