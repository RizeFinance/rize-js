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

describe('Transaction', () => {
    let testTransaction;

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.transaction.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a TransactionListQuery object.');
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array.');
        });

        it('Throws an error if "source_synthetic_account_uid" query is not an array', () => {
            const query = { source_synthetic_account_uid: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"source_synthetic_account_uid" query must be an array.');
        });

        it('Throws an error if "destination_synthetic_account_uid" query is not an array', () => {
            const query = { destination_synthetic_account_uid: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"destination_synthetic_account_uid" query must be an array.');
        });

        it('Throws an error if "synthetic_account_uid" query is not an array', () => {
            const query = { synthetic_account_uid: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"synthetic_account_uid" query must be an array.');
        });

        it('Throws an error if "type" query is not an array', () => {
            const query = { type: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"type" query must be an array. Accepted values inside the array are: atm_withdrawal | card_purchase | card_refund | dispute | external_transfer | fee | internal_transfer | other | reversed_transfer | third_party_transfer');
        });

        it('Throws an error if "type" query is not an array of valid values', () => {
            const query = { type: [''] };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('Accepted values in the "type" query are: atm_withdrawal | card_purchase | card_refund | dispute | external_transfer | fee | internal_transfer | other | reversed_transfer | third_party_transfer');
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Throws an error if "sort" query is not on the sort options', () => {
            const query = { sort: null };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"sort" query must be a string. Accepted values are: created_at_asc | created_at_desc | description_asc | description_desc | id_asc | id_desc | settled_index_asc | settled_index_desc | us_dollar_amount_asc | us_dollar_amount_desc');
        });

        it('Retrieves the transaction list without query', async () => {
            const transactionList = await rizeClient.transaction.getList();
            testTransaction = transactionList.data[0];
            utils.expectRizeList(transactionList);
        });

        it('Retrieves the transaction list with query', async () => {
            const query = {
                customer_uid: ['customer_uid1', 'customer_uid2'],
                limit: 50,
                offset: 0,
                sort: 'created_at_asc'
            };
            const transactionList = await rizeClient.transaction.getList(query);
            utils.expectRizeList(transactionList);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.transaction.get('');
            return expect(promise).to.eventually.be.rejectedWith('Transaction "uid" is required.');
        });
    
        it('Retrieves transaction data successfully', async () => {
            const transaction = await rizeClient.transaction.get(testTransaction.uid);
            expect(transaction).to.have.property('uid').that.equals(testTransaction.uid);
        });
    });
});