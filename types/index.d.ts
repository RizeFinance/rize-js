import { IComplianceWorkflow } from "./ComplianceWorkflow";

declare enum RizeEnvironments {
    'sandbox',
    'integration',
    'production'
}

export class Rize {
    static Rize: typeof Rize;

    constructor(programUid: string, hmacKey: string, environment?: keyof typeof RizeEnvironments);

    complianceWorkflow: IComplianceWorkflow;
}

export default Rize;