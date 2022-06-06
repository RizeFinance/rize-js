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
    let unaffiliatedCustomer, solePropCustomer;

    const verifyNewCustomer = (customer, external_uid, email) => {
        expect(customer).to.have.property('uid').that.is.not.empty;
        expect(customer).to.have.property('external_uid').that.equals(external_uid);
        expect(customer).to.have.property('email').that.equals(email);
        expect(customer).to.have.property('status').that.equals('initiated');
        expect(customer.customer_type).to.be.oneOf([
            'unaffiliated',
            'sole_proprietor',
        ]);
    };

    describe('create', () => {
        it('Throws an error if "customerExternalUid" is empty', () => {
            const promise = rizeClient.customer.create(' ', '');
            return expect(promise).to.eventually.be.rejectedWith(
                '"externalUid" is required.'
            );
        });

        it('Throws an error if "email" is empty', () => {
            const promise = rizeClient.customer.create('test', '');
            return expect(promise).to.eventually.be.rejectedWith(
                '"email" is required.'
            );
        });

        it('Throws an error if "email" is invalid', () => {
            const promise = rizeClient.customer.create('test', 'test@test');
            return expect(promise).to.eventually.be.rejectedWith(
                '"email" is invalid.'
            );
        });

        it('Creates a new unaffiliated customer', async () => {
            const externalUid = uuid();
            const fakeEmail = faker.internet.email('qa+', null, 'rizemoney.com');
            const customerType = 'unaffiliated';

            const newCustomer = await rizeClient.customer.create(
                externalUid,
                fakeEmail,
                customerType
            );
            verifyNewCustomer(newCustomer, externalUid, fakeEmail);

            mlog.log(`New unaffiliated Customer UID: ${newCustomer.uid}`);
            // Store the customerUid for next tests
            unaffiliatedCustomer = newCustomer;
        });

        it('Creates a new sole proprietor customer', async () => {
            const externalUid = uuid();
            const fakeEmail = faker.internet.email('qa+', null, 'rizemoney.com');
            const customerType = 'sole_proprietor';

            const newCustomer = await rizeClient.customer.create(
                externalUid,
                fakeEmail,
                customerType
            );
            verifyNewCustomer(newCustomer, externalUid, fakeEmail);

            mlog.log(`New Sole Proprietor Customer UID: ${newCustomer.uid}`);
            // Store the customerUid for next tests
            solePropCustomer = newCustomer;
        });
    });

    after(() => {
        process.env.TEST_CUSTOMER_UID = unaffiliatedCustomer.uid;
        process.env.TEST_SOLE_PROP_CUSTOMER_UID = solePropCustomer.uid;
    });
});
