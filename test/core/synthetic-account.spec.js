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
});