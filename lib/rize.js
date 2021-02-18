'use strict';

const Auth = require('./core/auth');
const ComplianceWorkflow = require('./core/compliance-workflow');
const CustomerService = require('./core/customer');
const createApiClient = require('./api');

const {
    DEFAULT_HOST,
    DEFAULT_BASE_PATH,
    DEFAULT_TIMEOUT
} = require('./constants');

/**
 * Represents a Rize API client.
 */
class Rize {
    /**
     * Returns a Rize API client.
     * @constructor
     * @param  {string} programUid - The Rize Program ID.
     * @param  {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
     * @param  {"sandbox"|"integration"|"production"} [environment="sandbox"] - The Rize environment to be used.
     * @param  {number} [timeout=80000] - Specifies the number of milliseconds before the each request times out.
     */
    constructor(programUid,
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
        const api = new createApiClient({
            host: DEFAULT_HOST,
            basePath: DEFAULT_BASE_PATH,
            timeout: timeout || DEFAULT_TIMEOUT
        });
        const auth = new Auth(programUid, hmac, api);

        /**
         * The Compliance Workflow resource is where you begin onboarding Customers to your Program.
         * Compliance Workflows are used to group all of the required Compliance Documents together and to ensure they are presented and acknowledged in the correct order.
         * @type {ComplianceWorkflow}
         */
        this.complianceWorkflow = new ComplianceWorkflow(api, auth);
        this.customer = new CustomerService(api, auth);
    }
}

/**
 * The Rize SDK version
 * @type {string}
 */
Rize.PACKAGE_VERSION = require('../package.json').version;

module.exports = Rize;
module.exports.Rize = Rize;
module.exports.default = Rize;