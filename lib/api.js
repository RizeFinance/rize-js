const axios = require('axios').default;

function createApiClient ({
    host,
    basePath,
    timeout
}) {
    const axiosInstance = axios.create({
        baseURL: `${host}${basePath}`,
        timeout: timeout
    });

    axiosInstance.defaults.headers.common['User-Agent'] = process.env.USER_AGENT;

    axiosInstance.interceptors.response.use(undefined, (err) => {
        throw {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
        };
    });

    return axiosInstance;
}

module.exports = createApiClient;