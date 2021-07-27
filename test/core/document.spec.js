'use strict';

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const rizeClient = require('../helpers/rizeClient');

describe('Document', () => {
    let testDocument;

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.document.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a DocumentListQuery object.');
        });

        it('Throws an error if "month" query is not an number', () => {
            const query = { month: '' };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"month" query must be an integer.');
        });

        it('Throws an error if "month" query is less than 1', () => {
            const query = { month: 0 };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"month" query value must be from 1 to 12');
        });

        it('Throws an error if "month" query is greater than 12', () => {
            const query = { month: 13 };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"month" query value must be from 1 to 12');
        });

        it('Throws an error if "year" query is not an number', () => {
            const query = { year: '' };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"year" query must be an integer.');
        });

        it('Throws an error if "scope_type" query is not an accepted value', () => {
            const query = { scope_type: 'not_exist' };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('Accepted values in the "scope_type" query are: customer | synthetic_account | custodial_account');
        });


        it('Throws an error if "custodial_account_uid" query is not a string', () => {
            const query = { custodial_account_uid: 123 };   
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"custodial_account_uid" query must be a string.');
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array.');
        });

        it('Throws an error if "synthetic_account_uid" query is not an array', () => {
            const query = { synthetic_account_uid: '' };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"synthetic_account_uid" query must be an array.');
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.document.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Retrieves the document list without query', async (done) => {
            const documentList = await rizeClient.document.getList();
            testDocument = documentList.data[0];
            utils.expectRizeList(documentList);
            done();
        });

        it('Retrieves the document list with query', async () => {
            const query = {
                month: 1,
                year: 2021,
                scope_type: 'customer',
                custodial_account_uid: 'custodial_account_uid1',
                customer_uid: ['customer_uid1', 'customer_uid2'],
                synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
                limit: 50,
                offset: 0
            };
            const documentList = await rizeClient.document.getList(query);
            utils.expectRizeList(documentList);
        });
    });

    describe('view', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.document.view('', 'pdf');
            return expect(promise).to.eventually.be.rejectedWith('Document "uid" is required.');
        });

        it('Throws an error if "extension" is not valid', async () => {
            const promise = rizeClient.document.view(testDocument.uid, 'excel');
            return expect(promise).to.eventually.be.rejectedWith('Accepted values in the "extension" query are: pdf | html | json');
        });

        it('Download document data successfully', async () => {
            const promise = await rizeClient.document.view(testDocument.uid, 'pdf');
            expect(promise).to.have.property('data');
            expect(promise).to.have.property('headers');
        });
    });

    describe('viewBase64', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.document.viewBase64('');
            return expect(promise).to.eventually.be.rejectedWith('Document "uid" is required.');
        });

        it('Retrieves document successfully', async () => {
            const document = await rizeClient.document.viewBase64(testDocument.uid, 'pdf');
            expect(document).to.be.a('string');
        }).timeout(5000);
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.document.get('');
            return expect(promise).to.eventually.be.rejectedWith('Document "uid" is required.');
        });

        it('Retrieves document data successfully', async () => {
            const document = await rizeClient.document.get(testDocument.uid);
            expect(document).to.have.property('uid').that.equals(testDocument.uid);
        });
    });
});