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

describe('Document', () => {

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

        it('Retrieves the document list without query', async () => {
            const documentList = await rizeClient.document.getList();
            utils.expectRizeList(documentList);
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
});