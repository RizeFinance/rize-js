const Rize = require('../../index');

const options = {
    environment: process.env.RIZE_TIER || 'sandbox',
};

const rizeClient = new Rize(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC,
    options
);

module.exports = rizeClient;