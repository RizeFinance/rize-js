'use strict';

require('./synthetic-account.spec');
require('./secondary-customer.spec');

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { faker } = require('@faker-js/faker');

chai.use(chaiAsPromised);
const expect = chai.expect;
const delayAsync = require('../helpers/delayAsync');

const rizeClient = require('../helpers/rizeClient');

describe('Transfer', () => {
    let customerUid;
    let testTransfer;
    let testExternalSyntheticAccountUid;
    let primarySyntheticAccount;

    before(() => {
        customerUid = process.env.TEST_CUSTOMER_UID;
        testExternalSyntheticAccountUid = process.env.TEST_EXTERNAL_SYNTHETIC_ACCOUNT_UID;
    });

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
            testTransfer = transferList.data[0];
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

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.transfer.get('');
            return expect(promise).to.eventually.be.rejectedWith('Transfer "uid" is required.');
        });
    
        it('Retrieves transfer data successfully', async () => {
            const transfer = await rizeClient.transfer.get(testTransfer.uid);
            expect(transfer).to.have.property('uid').that.equals(testTransfer.uid);
        });
    });

    describe('init', () => {
        it('Throws an error if "externalUid" is empty', () => {
            const promise = rizeClient.transfer.init('');
            return expect(promise).to.eventually.be.rejectedWith('"externalUid" is required.');
        });

        it('Throws an error if "sourceSyntheticAccountUid" is empty', () => {
            const promise = rizeClient.transfer.init('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"sourceSyntheticAccountUid" is required.');
        });

        it('Throws an error if "destinationSyntheticAccountUid" is empty', () => {
            const promise = rizeClient.transfer.init('test', 'test', '');
            return expect(promise).to.eventually.be.rejectedWith('"destinationSyntheticAccountUid" is required.');
        });
        
        it('Throws an error if "initiatingCustomerUid" is empty', () => {
            const promise = rizeClient.transfer.init('test', 'test', 'test', '');
            return expect(promise).to.eventually.be.rejectedWith('"initiatingCustomerUid" is required.');
        });

        it('Throws an error if "usTransferAmount" is empty', () => {
            const promise = rizeClient.transfer.init('test', 'test', 'test', 'test', '');
            return expect(promise).to.eventually.be.rejectedWith('"usTransferAmount" is required.');
        });

        it('Initializes an External-to-PrimaryAccount Transfer successfully', async () => {
            const customerAccounts = await rizeClient.syntheticAccount.getList({
                customer_uid: [customerUid]
            });

            primarySyntheticAccount = customerAccounts.data.find(x => x.master_account && x.liability);

            const newTransferExternalUid = faker.datatype.uuid();

            const transfer = await rizeClient.transfer.init(
                newTransferExternalUid,
                testExternalSyntheticAccountUid,
                primarySyntheticAccount.uid,
                customerUid,
                '100'
            );

            expect(transfer).to.have.property('uid');
            expect(transfer).to.have.property('external_uid').that.equals(newTransferExternalUid);
            expect(transfer).to.have.property('source_synthetic_account_uid').that.equals(testExternalSyntheticAccountUid);
            expect(transfer).to.have.property('destination_synthetic_account_uid').that.equals(primarySyntheticAccount.uid);
            expect(transfer).to.have.property('initiating_customer_uid').that.equals(customerUid);
            expect(transfer).to.have.property('usd_transfer_amount').that.equals('100.0');
            expect(transfer).to.have.property('status').that.equals('queued');
            await delayAsync(70000);

            const updatedTransfer = await rizeClient.transfer.get(transfer.uid);

            expect(updatedTransfer).to.have.property('status').that.equals('settled');
        }).timeout(100000);

        it('Initializes a PrimaryAccount-to-External Transfer successfully', async () => {
            const newTransferExternalUid = faker.datatype.uuid();

            const transfer = await rizeClient.transfer.init(
                newTransferExternalUid,
                primarySyntheticAccount.uid,
                testExternalSyntheticAccountUid,
                customerUid,
                '100'
            );

            expect(transfer).to.have.property('uid');
            expect(transfer).to.have.property('external_uid').that.equals(newTransferExternalUid);
            expect(transfer).to.have.property('source_synthetic_account_uid').that.equals(primarySyntheticAccount.uid);
            expect(transfer).to.have.property('destination_synthetic_account_uid').that.equals(testExternalSyntheticAccountUid);
            expect(transfer).to.have.property('initiating_customer_uid').that.equals(customerUid);
            expect(transfer).to.have.property('usd_transfer_amount').that.equals('100.0');
            expect(transfer).to.have.property('status').that.equals('queued');

            await delayAsync(70000);

            const updatedTransfer = await rizeClient.transfer.get(transfer.uid);

            expect(updatedTransfer).to.have.property('status').that.equals('settled');
        }).timeout(100000);
    });
});