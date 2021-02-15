const jws = require('jws');

const TOKEN_MAX_AGE = 82800000;

let tokenCache = {
    data: undefined,
    timestamp: undefined,
    isExpired() {
        return !this.timestamp || new Date() - this.timestamp > TOKEN_MAX_AGE;
    }
};

function Auth(
    programUid,
    hmacKey,
    api
) {
    return {
        getToken: async () => {
            if (!tokenCache.data || tokenCache.isExpired()) {
                // Request for a new token
                const sJwt = jws.sign({
                    header: { alg: 'HS512' },
                    payload: {
                        sub: programUid,
                        iat: Math.floor(+new Date() / 1000)
                    },
                    secret: hmacKey,
                });

                const response = await api.post(
                    '/auth',
                    undefined,
                    { headers: { 'Authorization': sJwt } }
                );

                tokenCache = {
                    data: response.data.token,
                    timestamp: new Date()
                };
            }
            return tokenCache.data;
        }
    };
}

module.exports = Auth;