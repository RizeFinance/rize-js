'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const Rize = require('../../index');
const rizeClient = new Rize(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC
);

describe('Synthetic Account', () => {

    it('Test', async () => {
        const test = await rizeClient.syntheticAccount.getList();
        expect(test).to.not.be.empty;
    });
    
    describe('get', () => {

        const syntheticAccountUid = '1thsM1Xt41RbidiC';

        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.syntheticAccount.get('');
            return expect(promise).to.eventually.be.rejectedWith('Synthetic Account "uid" is required.');
        });
    
        it('Retrieves synthetic account info successfully', async () => {
            const syntheticAccount = await rizeClient.syntheticAccount.get(syntheticAccountUid);
            expect(syntheticAccount).to.have.property('uid').that.equals(syntheticAccountUid);
        });
    });

});
