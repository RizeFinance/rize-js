export = Rize;
/**
 * Represents a Rize API client.
 */
declare class Rize {
    /**
     * Returns a Rize API client.
     * @constructor
     * @param {string} programUid - The Rize Program ID.
     * @param {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
     * @param {RizeOptions} [options] - Configuration options
     */
    constructor(programUid: string, hmac: string, { environment, timeout, }?: any);
    /**
     * The Compliance Workflow is where you begin onboarding Customers to your Program.
     * Compliance Workflows are used to group all of the required Compliance Documents together and to ensure they are presented and acknowledged in the correct order.
     * @type {ComplianceWorkflowService}
     */
    complianceWorkflow: ComplianceWorkflowService;
    /**
     * A Customer on the Rize Platform is the end user of your application.
     * Customers are unique to each Program and the management of all accounts and identifying information is handled on a Program-by-Program basis.
     * @type {CustomerService}
     */
    customer: CustomerService;
}
declare namespace Rize {
    export { PACKAGE_VERSION, Rize, Rize as default };
}
import ComplianceWorkflowService = require("./core/compliance-workflow");
import CustomerService = require("./core/customer");
declare var PACKAGE_VERSION: string;
