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

describe('Transfer', () => {
    // let testTransfer;

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.transfer.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a TransferListQuery object.');
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.transfer.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array.');
        });

        it('Throws an error if "pool_uid" query is not an array', () => {
            const query = { pool_uid: '' };
            const promise = rizeClient.transfer.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"pool_uid" query must be an array.');
        });

        it('Throws an error if "synthetic_account_uid" query is not an array', () => {
            const query = { synthetic_account_uid: '' };
            const promise = rizeClient.transfer.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"synthetic_account_uid" query must be an array.');
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.transfer.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.transfer.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Retrieves the transfer list without query', async () => {
            const transferList = await rizeClient.transfer.getList();
            // testTransfer = transferList.data[0];
            utils.expectRizeList(transferList);
        });

        it('Retrieves the transfer list with query', async () => {
            const query = {
                customer_uid: ['customer_uid1', 'customer_uid2'],
                external_uid: 'external_uid1',
                pool_uid: ['pool_uid1', 'pool_uid2'],
                synthetic_account_uid: ['synthetic_account_uid1', 'synthetic_account_uid2'],
                limit: 50,
                offset: 0
            };
            const transferList = await rizeClient.transfer.getList(query);
            utils.expectRizeList(transferList);
        });
    });
});