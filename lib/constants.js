const DEFAULT_HOST = {
    staging: 'https://staging.rizefs.com',
    release: 'https://release.rizefs.com',
    sandbox: 'https://sandbox.rizefs.com',
    integration: 'https://integration.rizefs.com',
    production: 'https://production.rizefs.com'
};
const DEFAULT_BASE_PATH = '/api/v1/';
const DEFAULT_TIMEOUT = 80000;

module.exports = {
    DEFAULT_HOST,
    DEFAULT_BASE_PATH,
    DEFAULT_TIMEOUT
};