export = ComplianceWorkflow;
declare function ComplianceWorkflow(api: any, auth: any): void;
declare class ComplianceWorkflow {
    constructor(api: any, auth: any);
    /** @private */
    private _api;
    /** @private */
    private _auth;
    /**
     * Retrieves the most recent Compliance Workflow for a Customer. A Customer UID must be supplied as the path parameter.
     * @returns {Promise<string>}
     */
    viewLatest(): Promise<string>;
}
