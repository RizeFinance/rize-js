'use strict';

const ApiClient = require('./api');
const Auth = require('./core/auth');
const ComplianceWorkflow = require('./core/compliance-workflow');

const {
    DEFAULT_HOST,
    DEFAULT_BASE_PATH,
    DEFAULT_TIMEOUT
} = require('./constants');

/**
 * The Rize SDK version
 * @type {string}
 */
Rize.PACKAGE_VERSION = require('../package.json').version;

/**
 * Represents a Rize API client.
 * @constructor
 * @param  {string} programUid - The Rize Program ID.
 * @param  {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
 * @param  {"sandbox"|"integration"|"production"} [environment="sandbox"] - The Rize environment to be used.
 * @param  {number} [timeout=DEFAULT_TIMEOUT] - The timeout for each requests.
 */
function Rize (
    programUid,
    hmac,
    environment = 'sandbox',
    timeout = DEFAULT_TIMEOUT
) {
    if (!(this instanceof Rize)) {
        return new Rize(programUid, hmac, environment);
    }

    if (!programUid) {
        throw new Error('programUid is required.');
    }
    
    if (!hmac) {
        throw new Error('hmac is required.');
    }
    
    // Initialize providers
    const api = new ApiClient({
        host: DEFAULT_HOST,
        basePath: DEFAULT_BASE_PATH,
        timeout: timeout || DEFAULT_TIMEOUT
    });
    const auth = new Auth(programUid, hmac, api);

    // Initialize core components
    /**
     * The Compliance Workflow resource is where you begin onboarding Customers to your Program.
     * Compliance Workflows are used to group all of the required Compliance Documents together and to ensure they are presented and acknowledged in the correct order.
     * @type {ComplianceWorkflow}
     */
    this.complianceWorkflow = new ComplianceWorkflow(api, auth);
}

module.exports = Rize;
module.exports.Rize = Rize;
module.exports.default = Rize;