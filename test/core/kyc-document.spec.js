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

    describe('getMetadata', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.kycDocument.get('');
            return expect(promise).to.eventually.be.rejectedWith('"uid" is required.');
        });

        it('Retrieves kyc document metadata successfully', async () => {
            const kycDocumentMetadata = await rizeClient.kycDocument.get('kycDocumentUid');
            expect(kycDocumentMetadata).to.have.property('uid').that.equals('kycDocumentUid');
        });
    });
});
