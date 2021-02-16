const jws = require('jws');

const TOKEN_MAX_AGE = 82800000;

let tokenCache = {
    data: undefined,
    timestamp: undefined,
    isExpired(tokenMaxAge = TOKEN_MAX_AGE) {
        return !this.timestamp || new Date() - this.timestamp > tokenMaxAge;
    }
};

function Auth(
    programUid,
    hmac,
    api,
    tokenMaxAge = TOKEN_MAX_AGE
) {
    this.getToken = async () => {
        if (!tokenCache.data || tokenCache.isExpired(tokenMaxAge)) {
            // Request for a new token
            const sJwt = jws.sign({
                header: { alg: 'HS512' },
                payload: {
                    sub: programUid,
                    iat: Math.floor(+new Date() / 1000)
                },
                secret: hmac,
            });

            const response = await api.post(
                '/auth',
                undefined,
                { headers: { 'Authorization': sJwt } }
            );

            tokenCache.data = response.data.token;
            tokenCache.timestamp = new Date();
        }
        return tokenCache.data;
    };
}

module.exports = Auth;