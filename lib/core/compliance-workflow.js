function ComplianceWorkflow (
    api,
    auth
) {
    return {
        viewLatest: () => {
            // TODO: Actual implementation
            const token = auth.getToken();
            return token;
        }
    };
}

module.exports = ComplianceWorkflow;