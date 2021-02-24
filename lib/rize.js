'use strict';

const Auth = require('./core/auth');
const ComplianceWorkflowService = require('./core/compliance-workflow');
const CustomerService = require('./core/customer');
const SyntheticAccount = require('./core/synthetic-account');
const createApiClient = require('./api');

const {
    DEFAULT_HOST,
    DEFAULT_BASE_PATH,
    DEFAULT_TIMEOUT
} = require('./constants');

/**
 * @type {Object} RizeOptions
 * @property {'sandbox'|'integration'|'production'} [environment] - The Rize environment to be used. (Default: 'sandbox')
 * @property {number} [timeout] - Specifies the number of milliseconds before the each request times out. (Default: 80000)
 */
const RizeOptions = {
    environment: 'sandbox',
    timeout: DEFAULT_TIMEOUT
};

/**
 * Represents a Rize API client.
 */
class Rize {
    /**
     * Returns a Rize API client.
     * @constructor
     * @param {string} programUid - The Rize Program ID.
     * @param {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
     * @param {RizeOptions} [options] - Configuration options
     */
    constructor(
        programUid,
        hmac,
        {
            environment = RizeOptions.environment,
            timeout = RizeOptions.timeout,
        } = RizeOptions
    ) {
        if (!(this instanceof Rize)) {
            return new Rize(programUid, hmac, {
                environment,
                timeout,
            });
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
         * The Compliance Workflow is where you begin onboarding Customers to your Program.
         * Compliance Workflows are used to group all of the required Compliance Documents together and to ensure they are presented and acknowledged in the correct order.
         * @type {ComplianceWorkflowService}
         */
        this.complianceWorkflow = new ComplianceWorkflowService(api, auth);

        /**
         * A Customer on the Rize Platform is the end user of your application.
         * Customers are unique to each Program and the management of all accounts and identifying information is handled on a Program-by-Program basis.
         * @type {CustomerService}
         */
        this.customer = new CustomerService(api, auth);

        /**
         * Synthetic Accounts are what your application will build around and your Customers will interact with.
         * Synthetic Accounts are designed to track any asset types, for any Customers, at any Custodian. 
         * @type {SyntheticAccount}
         */
        this.syntheticAccount = new SyntheticAccount(api, auth); 
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