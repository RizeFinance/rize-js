'use strict';

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const faker = require('faker');

chai.use(chaiAsPromised);
const expect = chai.expect;
const delayAsync = require('../helpers/delayAsync');
const rizeClient = require('../helpers/rizeClient');

describe('DebitCard', () => {
    let testDebitCard;
    let customerUid;
    let customerPoolUid;

    before(() => {
        customerUid = process.env.TEST_CUSTOMER_UID;
        customerPoolUid = process.env.TEST_CUSTOMER_POOL_UID;
    });

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.debitCard.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a DebitCardListQuery object.');
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.debitCard.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array.');
        });

        it('Throws an error if "pool_uid" query is not an array', () => {
            const query = { pool_uid: '' };
            const promise = rizeClient.debitCard.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"pool_uid" query must be an array.');
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.debitCard.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.debitCard.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Throws an error if "locked" query is not boolean', () => {
            const query = { locked: 'true' };
            const promise = rizeClient.debitCard.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"locked" query must be boolean.');
        });

        it('Throws an error if "status" query is not an array', () => {
            const query = { status: '' };
            const promise = rizeClient.debitCard.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"status" query must be an array. Accepted values inside the array are: queued | issued | printing_physical_card | printing_physical_card_replacement | card_replacement_shipped | shipped | usable_without_pin | normal | closed | damaged | lost | stolen | administrative_lock | closed_by_administrator | card_replacement_shipment_returned | shipment_returned');
        });

        it('Throws an error if "status" query is not an array of valid values', () => {
            const query = { status: [''] };
            const promise = rizeClient.debitCard.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('Accepted values in the "status" query are: queued | issued | printing_physical_card | printing_physical_card_replacement | card_replacement_shipped | shipped | usable_without_pin | normal | closed | damaged | lost | stolen | administrative_lock | closed_by_administrator | card_replacement_shipment_returned | shipment_returned');
        });

        it('Retrieves the debitCard list without query', async () => {
            const debitCardList = await rizeClient.debitCard.getList();
            testDebitCard = debitCardList.data[0];
            utils.expectRizeList(debitCardList);
        });

        it('Retrieves the debitCard list with query', async () => {
            const query = {
                customer_uid: ['customer_uid1', 'customer_uid2'],
                external_uid: 'external_uid1',
                limit: 50,
                offset: 0,
                pool_uid: ['pool_uid1', 'pool_uid2'],
                locked: false,
                status: ['queued', 'issued']
            };
            const debitCardList = await rizeClient.debitCard.getList(query);
            utils.expectRizeList(debitCardList);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.debitCard.get('');
            return expect(promise).to.eventually.be.rejectedWith('Debit Card "uid" is required.');
        });

        it('Retrieves debit card data successfully', async () => {
            const debitCard = await rizeClient.debitCard.get(testDebitCard.uid);
            expect(debitCard).to.have.property('uid').that.equals(testDebitCard.uid);
        });
    });

    describe('create', () => {
        it('Throws an error if "externalUid" is empty', () => {
            const promise = rizeClient.debitCard.create('');
            return expect(promise).to.eventually.be.rejectedWith('"externalUid" is required.');
        });

        it('Throws an error if "customerUid" is empty', () => {
            const promise = rizeClient.debitCard.create('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"customerUid" is required.');
        });

        it('Throws an error if "poolUid" is empty', () => {
            const promise = rizeClient.debitCard.create('test', 'test', '');
            return expect(promise).to.eventually.be.rejectedWith('"poolUid" is required.');
        });

        it('Throws an error if "street1" is empty when shippingAddress is supplied', () => {
            const promise = rizeClient.debitCard.create('test', 'test', 'test', {
                street1: ''
            });
            return expect(promise).to.eventually.be.rejectedWith('"shippingAddress.street1" is required if "shippingAddress" is supplied.');
        });

        it('Throws an error if "city" is empty when shippingAddress is supplied', () => {
            const promise = rizeClient.debitCard.create('test', 'test', 'test', {
                street1: 'test',
                city: ''
            });
            return expect(promise).to.eventually.be.rejectedWith('"shippingAddress.city" is required if "shippingAddress" is supplied.');
        });

        it('Throws an error if "state" is empty when shippingAddress is supplied', () => {
            const promise = rizeClient.debitCard.create('test', 'test', 'test', {
                street1: 'test',
                city: 'test',
                state: ''
            });
            return expect(promise).to.eventually.be.rejectedWith('"shippingAddress.state" is required if "shippingAddress" is supplied.');
        });

        it('Throws an error if "postal_code" is empty when shippingAddress is supplied', () => {
            const promise = rizeClient.debitCard.create('test', 'test', 'test', {
                street1: 'test',
                city: 'test',
                state: 'test',
                postal_code: ''
            });
            return expect(promise).to.eventually.be.rejectedWith('"shippingAddress.postal_code" is required if "shippingAddress" is supplied.');
        });

        it('Creates debit card successfully', async () => {
            const externalUid = faker.datatype.uuid();
            const debitCard = await rizeClient.debitCard.create(
                externalUid,
                customerUid,
                customerPoolUid
            );
            expect(debitCard).to.have.property('uid');
            expect(debitCard).to.have.property('external_uid').that.equals(externalUid);
            expect(debitCard).to.have.property('customer_uid').that.equals(customerUid);
            expect(debitCard).to.have.property('pool_uid').that.equals(customerPoolUid);

            testDebitCard = debitCard;
            await delayAsync(1500);
        });
    });

    describe('activate', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.debitCard.activate('');
            return expect(promise).to.eventually.be.rejectedWith('Debit Card "uid" is required.');
        });
        it('Throws an error if "cardLastFourDigits" is empty', () => {
            const promise = rizeClient.debitCard.activate('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"cardLastFourDigits" is required.');
        });
        it('Throws an error if "cvv" is empty', () => {
            const promise = rizeClient.debitCard.activate('test', '5678', '');
            return expect(promise).to.eventually.be.rejectedWith('"cvv" is required.');
        });
        it('Throws an error if "expiryDate" is empty', () => {
            const promise = rizeClient.debitCard.activate('test', '5678', '930', '');
            return expect(promise).to.eventually.be.rejectedWith('"expiryDate" is required.');
        });

        it('Activates a debit card', async () => {
            let testDebitCard;
            const testDebitCards = await rizeClient.debitCard.getList({
                customer_uid: [customerUid]
            });
            testDebitCard = testDebitCards.data[0];
            const activatedCard = await rizeClient.debitCard.activate(
                testDebitCard.uid,
                testDebitCard.card_last_four_digits,
                '321',
                '2025-01'
            );
            expect(activatedCard).to.have.property('status').that.equals('usable_without_pin');
            expect(activatedCard).to.have.property('uid').that.equals(testDebitCard.uid);
        });
    });

    describe('lock', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.debitCard.lock('');
            return expect(promise).to.eventually.be.rejectedWith('Debit Card "uid" is required.');
        });

        it('Throws an error if "lockReason" is empty', () => {
            const promise = rizeClient.debitCard.lock('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"lockReason" is required.');
        });

        it('Locks debit card successfully', async () => {
            const lockReason = 'Fraud detected';
            const updatedDebitCard = await rizeClient.debitCard.lock(
                testDebitCard.uid,
                lockReason
            );
            expect(updatedDebitCard).to.have.property('uid').that.equals(testDebitCard.uid);
            expect(updatedDebitCard).to.have.property('lock_reason').that.equals(lockReason);
            expect(updatedDebitCard).to.have.property('locked_at').that.is.not.empty;

            testDebitCard = updatedDebitCard;
            await delayAsync(1500);
        });
    });

    describe('unlock', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.debitCard.unlock('');
            return expect(promise).to.eventually.be.rejectedWith('Debit Card "uid" is required.');
        });

        it('Unlocks debit card successfully', async () => {
            const updatedDebitCard = await rizeClient.debitCard.unlock(testDebitCard.uid);

            expect(updatedDebitCard).to.have.property('uid').that.equals(testDebitCard.uid);
            expect(updatedDebitCard).to.have.property('lock_reason').that.is.null;
            expect(updatedDebitCard).to.have.property('locked_at').that.is.null;

            testDebitCard = updatedDebitCard;
            await delayAsync(1500);
        });
    });

    describe('reissue', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.debitCard.reissue('');
            return expect(promise).to.eventually.be.rejectedWith('Debit Card "uid" is required.');
        });

        it('Throws an error if "reissueReason" is empty', () => {
            const promise = rizeClient.debitCard.reissue('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"reissueReason" is required.');
        });

        it('Throws an error if "reissueReason" is invalid', () => {
            const promise = rizeClient.debitCard.reissue('test', 'test');
            return expect(promise).to.eventually.be.rejectedWith('Invalid reissueReason. Accepted values are: damaged | lost | stolen');
        });

        it('Reissues debit card successfully', async () => {
            const updatedDebitCard = await rizeClient.debitCard.reissue(
                testDebitCard.uid,
                'damaged'
            );
            expect(updatedDebitCard).to.have.property('uid').that.equals(testDebitCard.uid);

            testDebitCard = updatedDebitCard;
            await delayAsync(1500);
        });
    });
});