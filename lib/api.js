const axios = require('axios').default;

function ApiClient ({
    host,
    basePath,
    timeout
}) {
    return axios.create({
        baseURL: `${host}${basePath}`,
        timeout: timeout
    });
}

module.exports = ApiClient;