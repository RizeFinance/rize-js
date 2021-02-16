export = ComplianceWorkflow;
declare function ComplianceWorkflow(api: any, auth: any): void;
declare class ComplianceWorkflow {
    constructor(api: any, auth: any);
    /**
     * @returns {Promise<string>}
     */
    viewLatest: () => Promise<string>;
}
