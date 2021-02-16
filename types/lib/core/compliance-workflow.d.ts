export = ComplianceWorkflow;
declare class ComplianceWorkflow {
    constructor(api: any, auth: any);
    /** @protected */ protected _api: any;
    /** @protected */ protected _auth: any;
    /**
     * Retrieves the most recent Compliance Workflow for a Customer. A Customer UID must be supplied as the path parameter.
     * @returns {Promise<string>}
     */
    viewLatest(): Promise<string>;
}
