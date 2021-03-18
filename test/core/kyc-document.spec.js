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
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.kycDocument.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a KYCDocumentListQuery object.');
        });

        it('Throws an error if "evaluation_uid" query parameter is invalid', () => {
            const promise = rizeClient.kycDocument.getList({evaluation_uid: ''});
            return expect(promise).to.eventually.be.rejectedWith('"evaluation_uid" query must be a string.');
        });

        it('Retrieves the KYC document list with query', async () => {
            const query = {
                evaluation_uid: 'evaluation_uid1'
            };
            const kycDocumentList = await rizeClient.kycDocument.getList(query);
            utils.expectRizeList(kycDocumentList);
        });
    });
});
