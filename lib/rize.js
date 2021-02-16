'use strict';

const ApiClient = require('./api');
const Auth = require('./core/auth');
const ComplianceWorkflow = require('./core/compliance-workflow');

const {
    DEFAULT_HOST,
    DEFAULT_BASE_PATH,
    DEFAULT_TIMEOUT
} = require('./constants');

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
    this.compliancWorkflow = new ComplianceWorkflow(api, auth);
}

module.exports = Rize;
module.exports.Rize = Rize;
module.exports.default = Rize;