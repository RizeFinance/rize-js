'use strict';

require('./transfer.spec');
require('./debit-card.spec');
require('./transaction.spec');
require('./kyc-document.spec');
require('./document.spec');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;
const delayAsync = require('../helpers/delayAsync');
const rizeClient = require('../helpers/rizeClient');

describe('Customer', () => {
    let customerUid, secondaryCustomerUid;

    before(() => {
        customerUid = process.env.TEST_CUSTOMER_UID;
        secondaryCustomerUid = process.env.TEST_SECONDARY_CUSTOMER_UID;

    });

    describe('archive', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.customer.archive(' ');
            return expect(promise).to.eventually.be.rejectedWith('Customer "uid" is required.');
        });

        it('Archives the secondary customer', async () => {
            await delayAsync(60000);
            await rizeClient.customer.archive(secondaryCustomerUid);
            const updatedCustomer = await rizeClient.customer.get(secondaryCustomerUid);
            expect(updatedCustomer.status).equals('archived');
        }).timeout(100000);

        it('Archives the primary customer', async () => {
            await delayAsync(60000);
            await rizeClient.customer.archive(customerUid);
            const updatedCustomer = await rizeClient.customer.get(customerUid);
            expect(updatedCustomer.status).equals('archived');
        }).timeout(100000);
    });
});