const axios = require('axios').default;

function createApiClient ({
    host,
    basePath,
    timeout
}) {
    return axios.create({
        baseURL: `${host}${basePath}`,
        timeout: timeout
    });
}

module.exports = createApiClient;