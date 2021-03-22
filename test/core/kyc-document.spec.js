'use strict';

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const Rize = require('../../index');
const rizeClient = new Rize(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC
);

describe('KYCDocument', () => {

    describe('getList', async () => {
        it('Throws an error if "evaluationUid" is empty', () => {
            const promise = rizeClient.kycDocument.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"evaluationUid" is required.');
        });

        it('Retrieves the KYC document list with evaluationUid', async () => {
            const kycDocumentList = await rizeClient.kycDocument.getList('evaluation_uid1');
            utils.expectRizeList(kycDocumentList);
        });
    });
});
