'use strict';

require('./auth.spec');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const mlog = require('mocha-logger');
const uuid = require('uuid').v4;
const { faker } = require('@faker-js/faker');

const rizeClient = require('../helpers/rizeClient');

describe('Customer', () => {
    let primaryCustomer, solePropCustomer, subLedger;

    const verifyNewCustomer = (customer, external_uid, email) => {
        expect(customer).to.have.property('uid').that.is.not.empty;
        expect(customer).to.have.property('external_uid').that.equals(external_uid);
        expect(customer).to.have.property('email').that.equals(email);
        expect(customer).to.have.property('status').that.equals('initiated');
        expect(customer.customer_type).to.be.oneOf([
            'primary',
            'sole_proprietor',
            'sub-ledger'
        ]);
    };

    describe('create', () => {
        it('Throws an error if "customer_type" is invalid', () => {
            const promise = rizeClient.customer.create(null, null, 'invalid_type');
            return expect(promise).to.eventually.be.rejectedWith(
                '"customer_type" is invalid.'
            );
        });

        it('Throws an error if "detail" is not an object', () => {
            const promise = rizeClient.customer.create(null, null, null, 'bad detail');
            return expect(promise).to.eventually.be.rejectedWith(
                '"details" should be a CustomerDetailsParams object.'
            );
        });

        it('Throws an error if "email" is invalid', () => {
            const promise = rizeClient.customer.create('test', 'test@test');
            return expect(promise).to.eventually.be.rejectedWith(
                '"email" is invalid.'
            );
        });

        it('Throws an error if "primary_customer_uid" is blank for secondary customers', () => {
            const promise = rizeClient.customer.create(null, null, 'secondary', null, null);
            return expect(promise).to.eventually.be.rejectedWith(
                '"primary_customer_uid" is required for secondary customer_type.'
            );
        });


        it('Creates a new primary customer', async () => {
            const externalUid = uuid();
            const fakeEmail = `qa+${externalUid}@rizemoney.com`;
            const customerType = 'primary';

            const newCustomer = await rizeClient.customer.create(
                externalUid,
                fakeEmail,
                customerType
            );
            verifyNewCustomer(newCustomer, externalUid, fakeEmail);

            mlog.log(`New primary Customer UID: ${newCustomer.uid}`);
            // Store the customerUid for next tests
            primaryCustomer = newCustomer;
        });

        it('Creates a new sole proprietor customer', async () => {
            const externalUid = uuid();
            const fakeSolePropEmail = `qa+${externalUid}@rizemoney.com`;
            const customerType = 'sole_proprietor';

            const newCustomer = await rizeClient.customer.create(
                externalUid,
                fakeSolePropEmail,
                customerType
            );
            verifyNewCustomer(newCustomer, externalUid, fakeSolePropEmail);

            mlog.log(`New Sole Proprietor Customer UID: ${newCustomer.uid}`);
            // Store the customerUid for next tests
            solePropCustomer = newCustomer;
        });

        it('Creates a new sub_ledger customer', async () => {
            const customerType = 'sub_ledger';

            const newCustomer = await rizeClient.customer.create(
                null,
                null,
                customerType
            );

            mlog.log(`New Sub-Ledger Customer UID: ${newCustomer.uid}`);
            // Store the customerUid for next tests
            subLedger = newCustomer;
        });
    });

    after(() => {
        process.env.TEST_CUSTOMER_UID = primaryCustomer.uid;
        process.env.TEST_SOLE_PROP_CUSTOMER_UID = solePropCustomer.uid;
        process.env.TEST_SUB_LEDGER_CUSTOMER_UID = subLedger.uid;
    });
});
