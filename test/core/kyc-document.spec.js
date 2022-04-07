'use strict';

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const rizeClient = require('../helpers/rizeClient');
const delayAsync = require('../helpers/delayAsync');

const fs = require('fs');
const path = require('path');
const testFilePath = path.resolve(__dirname, '../test-files/rize-logo.png');

describe('KYCDocument', () => {
    let evaluationUid;
    let testKYCDocument;
    let newKYCDocument;
    let testImage;

    before(() => {
        evaluationUid = 'b7xEPnimxzf8gBtR';
    });

    describe('getList', async () => {
        it('Throws an error if "evaluationUid" is empty', () => {
            const promise = rizeClient.kycDocument.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"evaluationUid" is required.');
        });

        it('Retrieves the KYC document list with evaluationUid', async () => {
            const kycDocumentList = await rizeClient.kycDocument.getList(evaluationUid);
            testKYCDocument = kycDocumentList.data[0];
            utils.expectRizeList(kycDocumentList);
        });
    });

    describe('upload', () => {
        it('Throws an error if "evaluationUid" is empty', () => {
            const promise = rizeClient.kycDocument.upload('');
            return expect(promise).to.eventually.be.rejectedWith('"evaluationUid" is required.');
        });

        it('Throws an error if "filename" is empty', () => {
            const promise = rizeClient.kycDocument.upload('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"filename" is required.');
        });

        it('Throws an error if "fileContent" is empty', () => {
            const promise = rizeClient.kycDocument.upload('test', 'test', '');
            return expect(promise).to.eventually.be.rejectedWith('"fileContent" is required.');
        });

        it('Throws an error if "note" is empty', () => {
            const promise = rizeClient.kycDocument.upload('test', 'test', 'test', '');
            return expect(promise).to.eventually.be.rejectedWith('"note" is required.');
        });

        it('Throws an error if "type" is not an accepted value', () => {
            const promise = rizeClient.kycDocument.upload('test', 'test', 'test', 'test', 'test');
            return expect(promise).to.eventually.be.rejectedWith('Accepted values in the "type" parameter are: contract | license | other | passport | utility');
        });

        it('Uploads a KYC document successfully', async () => {
            testImage = fs.readFileSync(testFilePath, { encoding: 'base64' });
            const kycDocument = await rizeClient.kycDocument.upload(
                evaluationUid,
                'rize-logo.png',
                testImage,
                'test upload',
                'other'
            );
            expect(kycDocument).to.have.property('uid');
            expect(kycDocument).to.have.property('type').that.equals('other');
            expect(kycDocument).to.have.property('filename').that.equals('rize-logo');
            expect(kycDocument).to.have.property('note').that.equals('test upload');
            expect(kycDocument).to.have.property('extension').that.equals('png');
            expect(kycDocument).to.have.property('created_at');
            
            newKYCDocument = kycDocument;
        });
    });

    describe('getMetadata', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.kycDocument.getMetadata('');
            return expect(promise).to.eventually.be.rejectedWith('KYC Document "uid" is required.');
        });

        it('Retrieves kyc document metadata successfully', async () => {
            delayAsync(1000);
            const kycDocumentMetadata = await rizeClient.kycDocument.getMetadata(testKYCDocument.uid);
            expect(kycDocumentMetadata).to.have.property('uid').that.equals(testKYCDocument.uid);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.kycDocument.get('');
            return expect(promise).to.eventually.be.rejectedWith('KYC Document "uid" is required.');
        });

        it('Retrieves kyc document successfully', async () => {
            const kycDocument = await rizeClient.kycDocument.get(newKYCDocument.uid);
            expect(kycDocument).to.have.property('data');
            expect(kycDocument).to.have.property('headers');
            expect(kycDocument.headers['content-disposition']).to.contain('rize-logo.png');
        });
    });

    describe('getBase64', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.kycDocument.getBase64('');
            return expect(promise).to.eventually.be.rejectedWith('KYC Document "uid" is required.');
        });

        it('Retrieves kyc document successfully', async () => {
            const kycDocument = await rizeClient.kycDocument.getBase64(newKYCDocument.uid);
            expect(kycDocument).to.equal(testImage);
        });
    });
});
