export = Rize;
/**
 * Represents a Rize API client.
 * @constructor
 * @param  {string} programUid - The Rize Program ID.
 * @param  {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
 * @param  {"sandbox"|"integration"|"production"} [environment="sandbox"] - The Rize environment to be used.
 * @param  {number} [timeout=DEFAULT_TIMEOUT] - The timeout for each requests.
 */
declare function Rize(programUid: string, hmac: string, environment?: "sandbox" | "integration" | "production", timeout?: number): import("./rize");
declare class Rize {
    /**
     * Represents a Rize API client.
     * @constructor
     * @param  {string} programUid - The Rize Program ID.
     * @param  {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
     * @param  {"sandbox"|"integration"|"production"} [environment="sandbox"] - The Rize environment to be used.
     * @param  {number} [timeout=DEFAULT_TIMEOUT] - The timeout for each requests.
     */
    constructor(programUid: string, hmac: string, environment?: "sandbox" | "integration" | "production", timeout?: number);
    /**
     * The Compliance Workflow resource is where you begin onboarding Customers to your Program.
     * Compliance Workflows are used to group all of the required Compliance Documents together and to ensure they are presented and acknowledged in the correct order.
     * @type {ComplianceWorkflow}
     */
    complianceWorkflow: ComplianceWorkflow;
}
declare namespace Rize {
    export { PACKAGE_VERSION, Rize, Rize as default };
}
import ComplianceWorkflow = require("./core/compliance-workflow");
declare var PACKAGE_VERSION: string;
