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
        /** @ignore @protected */ this._programUid = programUid;
        /** @ignore @protected */ this._hmac = hmac;
        /** @ignore @protected */ this._api = api;
        /** @ignore @protected */ this._tokenMaxAge = tokenMaxAge;
    }

    /**
     * Gets the Rize auth token.
     * @returns {Promise<string>} A promise that returns the Rize auth token if resolved.
     */
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