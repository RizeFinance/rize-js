const jws = require('jws');

const DEFAULT_TOKEN_MAX_AGE = 82800000;

let tokenCache = {
    data: undefined,
    timestamp: undefined,
    isExpired(tokenMaxAge = DEFAULT_TOKEN_MAX_AGE) {
        return !this.timestamp || new Date() - this.timestamp > tokenMaxAge;
    }
};

class Auth {
    constructor(
        programUid,
        hmac,
        api,
        tokenMaxAge = DEFAULT_TOKEN_MAX_AGE
    ) {
        /** @protected */ this._programUid = programUid;
        /** @protected */ this._hmac = hmac;
        /** @protected */ this._api = api;
        /** @protected */ this._tokenMaxAge = tokenMaxAge;
    }

    async getToken() {
        // Check if there's no token data or if the token is already expired
        if (!tokenCache.data || tokenCache.isExpired(this._tokenMaxAge)) {
            // Request for a new token
            const sJwt = jws.sign({
                header: { alg: 'HS512' },
                payload: {
                    sub: this._programUid,
                    iat: Math.floor(+new Date() / 1000)
                },
                secret: this._hmac,
            });

            const response = await this._api.post(
                '/auth',
                undefined,
                { headers: { 'Authorization': sJwt } }
            );

            tokenCache.data = response.data.token;
            tokenCache.timestamp = new Date();
        }
        return tokenCache.data;
    }
}

module.exports = Auth;