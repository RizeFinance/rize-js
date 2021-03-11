'use strict';

// const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
// const faker = require('faker');

chai.use(chaiAsPromised);
const expect = chai.expect;

const Rize = require('../../index');
const rizeClient = new Rize(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC
);

describe('Transaction', () => {
    
    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.transaction.get('');
            return expect(promise).to.eventually.be.rejectedWith('Transaction "uid" is required.');
        });
    
        it('Retrieves transaction data successfully', async () => {
            const transactionUid = 'cAKtTpKXv57V8k5u';
            const transaction = await rizeClient.transaction.get(transactionUid);
            expect(transaction).to.have.property('uid').that.equals(transactionUid);
        });
    });
});
