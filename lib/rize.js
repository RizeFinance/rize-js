'use strict';

// const DEFAULT_HOST = 'sandbox.rizefs.com';
// const DEFAULT_PORT = '443';
// const DEFAULT_BASE_PATH = '/api/v1/';
// const DEFAULT_API_VERSION = null;
// const DEFAULT_TIMEOUT = 80000;

Rize.PACKAGE_VERSION = require('../package.json').version;

function Rize (programUid, hmacKey, environment) {
    if (!(this instanceof Rize)) {
        return new Rize(programUid, hmacKey, environment);
    }
}

module.exports = Rize;
module.exports.Rize = Rize;
module.exports.default = Rize;