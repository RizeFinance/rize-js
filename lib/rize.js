'use strict';

const ApiClient = require('./api');
const Auth = require('./core/auth');
const ComplianceWorkflow = require('./core/compliance-workflow');

const DEFAULT_HOST = 'https://sandbox.rizefs.com';
const DEFAULT_BASE_PATH = '/api/v1/';
const DEFAULT_TIMEOUT = 80000;

Rize.PACKAGE_VERSION = require('../package.json').version;

function Rize (
    programUid,
    hmacKey,
    environment = 'sandbox',
    timeout = DEFAULT_TIMEOUT
) {
    if (!(this instanceof Rize)) {
        return new Rize(programUid, hmacKey, environment);
    }
    
    // Initialize providers
    const api = new ApiClient({
        host: DEFAULT_HOST,
        basePath: DEFAULT_BASE_PATH,
        timeout: timeout || DEFAULT_TIMEOUT
    });
    const auth = new Auth(programUid, hmacKey, api);

    // Initialize core components
    const compliancWorkflowComponent = new ComplianceWorkflow(api, auth);

    return {
        complianceWorkflow: compliancWorkflowComponent,
    };
}

module.exports = Rize;
module.exports.Rize = Rize;
module.exports.default = Rize;