export = Rize;
/**
 * Represents a Rize API client.
 * @constructor
 * @param  {string} programUid - The Rize Program ID.
 * @param  {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
 * @param  {keyof typeof RizeEnvironments} [environment="sandbox"] - The Rize environment to be used.
 * @param  {number} [timeout=DEFAULT_TIMEOUT] - The timeout for each requests.
 */
declare function Rize(programUid: string, hmac: string, environment?: keyof typeof RizeEnvironments, timeout?: number): import("./rize");
declare class Rize {
    /**
     * Represents a Rize API client.
     * @constructor
     * @param  {string} programUid - The Rize Program ID.
     * @param  {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
     * @param  {keyof typeof RizeEnvironments} [environment="sandbox"] - The Rize environment to be used.
     * @param  {number} [timeout=DEFAULT_TIMEOUT] - The timeout for each requests.
     */
    constructor(programUid: string, hmac: string, environment?: keyof typeof RizeEnvironments, timeout?: number);
    complianceWorkflow: ComplianceWorkflow;
}
declare namespace Rize {
    export { PACKAGE_VERSION, Rize, Rize as default };
}
/**
 * Enum for Rize Sandbox environments.
 */
type RizeEnvironments = string;
declare namespace RizeEnvironments {
    const sandbox: string;
    const integration: string;
    const production: string;
}
import ComplianceWorkflow = require("./core/compliance-workflow");
declare var PACKAGE_VERSION: string;
