'use strict';

const ApiClient = require('./api');
const Auth = require('./core/auth');
const ComplianceWorkflow = require('./core/compliance-workflow');

const DEFAULT_HOST = 'https://sandbox.rizefs.com';
const DEFAULT_BASE_PATH = '/api/v1/';
const DEFAULT_TIMEOUT = 80000;

/**
 * @type {string}
 */
Rize.PACKAGE_VERSION = require('../package.json').version;

/**
 * Enum for Rize Sandbox environments.
 * @readonly
 * @enum {string}
 */
const RizeEnvironments = {
    sandbox: 'sandbox',
    integration: 'integration',
    production: 'production'
};

/**
 * Represents a Rize API client.
 * @constructor
 * @param  {string} programUid - The Rize Program ID.
 * @param  {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
 * @param  {keyof typeof RizeEnvironments} [environment="sandbox"] - The Rize environment to be used.
 * @param  {number} [timeout=DEFAULT_TIMEOUT] - The timeout for each requests.
 */
function Rize (
    programUid,
    hmac,
    environment = RizeEnvironments.sandbox,
    timeout = DEFAULT_TIMEOUT
) {
    if (!(this instanceof Rize)) {
        return new Rize(programUid, hmac, environment);
    }
    
    // Initialize providers
    const api = new ApiClient({
        host: DEFAULT_HOST,
        basePath: DEFAULT_BASE_PATH,
        timeout: timeout || DEFAULT_TIMEOUT
    });
    const auth = new Auth(programUid, hmac, api);

    // Initialize core components
    this.complianceWorkflow = new ComplianceWorkflow(api, auth);
}

module.exports = Rize;
module.exports.Rize = Rize;
module.exports.default = Rize;