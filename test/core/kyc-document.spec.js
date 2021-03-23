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
    let testKYCDocument;

    describe('getList', async () => {
        it('Throws an error if "evaluationUid" is empty', () => {
            const promise = rizeClient.kycDocument.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"evaluationUid" is required.');
        });

        it('Retrieves the KYC document list with evaluationUid', async () => {
            const kycDocumentList = await rizeClient.kycDocument.getList('Ct1EY876A47RZkDX');
            testKYCDocument = kycDocumentList.data[0];
            utils.expectRizeList(kycDocumentList);
        });
    });

    describe('getMetadata', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.kycDocument.getMetadata('');
            return expect(promise).to.eventually.be.rejectedWith('KYC Document "uid" is required.');
        });

        it('Retrieves kyc document metadata successfully', async () => {
            const kycDocumentMetadata = await rizeClient.kycDocument.getMetadata(testKYCDocument.uid);
            expect(kycDocumentMetadata).to.have.property('uid').that.equals(testKYCDocument.uid);
        });
    });
});
