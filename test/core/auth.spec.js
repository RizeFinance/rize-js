'use strict';

const {
    DEFAULT_HOST,
    DEFAULT_BASE_PATH,
    DEFAULT_TIMEOUT
} = require('../../lib/constants');

const TOKEN_MAX_AGE = 500;

const expect = require('chai').expect;
const ApiClient = require('../../lib/api');
const Auth = require('../../lib/core/auth');
const delayAsync = require('../helpers/delayAsync');

const api = new ApiClient({
    host: DEFAULT_HOST[process.env.RIZE_TIER || 'sandbox'],
    basePath: DEFAULT_BASE_PATH,
    timeout: DEFAULT_TIMEOUT
});

const auth = new Auth(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC,
    api,
    TOKEN_MAX_AGE
);

const invalidAuth = new Auth(
    process.env.RIZE_PROGRAM_ID,
    'fsdafdsa4eea',
    api
);

describe('Auth', () => {
    let token;
    it('Fails to get token if invalid credentials', async () => {
        let token;
        try {
            token = await invalidAuth.getToken();
        } finally {
            expect(token).be.an('error');
        }
    });

    it('Gets a new auth token', async () => {
        token = await auth.getToken();
        expect(token).to.not.be.empty;
    });

    it('Gets the same token if not yet expired', async () => {
        const token2 = await auth.getToken();
        expect(token2).to.not.be.empty;
        expect(token2).to.equal(token);
    });

    it('Gets a new token if the current one is expired', async () => {
        await delayAsync(TOKEN_MAX_AGE + 500);
        const token3 = await auth.getToken();
        expect(token3).to.not.be.empty;
        expect(token3).to.not.equal(token);
    });
});