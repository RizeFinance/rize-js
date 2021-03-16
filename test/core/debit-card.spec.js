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

describe('DebitCard', () => {
    // let testDebitCard;

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
            // testDebitCard = debitCardList.data[0];
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
});