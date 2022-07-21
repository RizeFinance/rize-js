'use strict';

require('./synthetic-account.spec');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;
const mlog = require('mocha-logger');
const uuid = require('uuid').v4;
const { faker } = require('@faker-js/faker');
const delayAsync = require('../helpers/delayAsync');

const rizeClient = require('../helpers/rizeClient');

describe('Secondary Customer', () => {
    let secondaryCustomer, primaryCustomerUid;
    before(() => {
        primaryCustomerUid = process.env.TEST_CUSTOMER_UID;
    });

    describe('create', () => {
        it('Throws an error if "primary customer UID" is empty', () => {
            const promise = rizeClient.customer.createSecondary('test', '');
            return expect(promise).to.eventually.be.rejectedWith(
                'Customer "uid" is required.'
            );
        });

        it('Throws an error if "email" is invalid', () => {
            const promise = rizeClient.customer.createSecondary('test', primaryCustomerUid, 'bad_email');
            return expect(promise).to.eventually.be.rejectedWith(
                '"email" is invalid.'
            );
        });

        it('Throws an error if "details" is invalid', () => {
            const promise = rizeClient.customer.createSecondary('test', primaryCustomerUid);
            return expect(promise).to.eventually.be.rejectedWith(
                '"details" should be a CustomerDetailsParams object.'
            );
        });

        it('Creates a new secondary customer', async () => {
            const externalUid = uuid();
            const fakeEmail = faker.internet.email('qa+', null, 'rizemoney.com');
            const details = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                phone: faker.phone.number('##########'),
                dob: faker.date.birthdate().toJSON().slice(0, 10),
                address: {
                    street1: faker.address.streetAddress(),
                    city: faker.address.cityName(),
                    state: faker.address.stateAbbr(),
                    postal_code: faker.address.zipCode()
                }
            };

            const newCustomer = await rizeClient.customer.createSecondary(
                externalUid,
                primaryCustomerUid,
                fakeEmail,
                details
            );

            expect(newCustomer).to.have.property('external_uid').that.equals(externalUid);
            expect(newCustomer).to.have.property('customer_type').that.equals('secondary');
            expect(newCustomer).to.have.property('primary_customer_uid').that.equals(primaryCustomerUid);
            expect(newCustomer.details).to.have.property('first_name').that.equals(details.first_name);
            expect(newCustomer.details).to.have.property('last_name').that.equals(details.last_name);
            expect(newCustomer.details).to.have.property('dob').that.equals(details.dob);
            expect(newCustomer.details.address).to.have.property('street1').that.equals(details.address.street1);
            expect(newCustomer.details.address).to.have.property('city').that.equals(details.address.city);
            expect(newCustomer.details.address).to.have.property('state').that.equals(details.address.state);
            expect(newCustomer.details.address).to.have.property('postal_code').that.equals(details.address.postal_code);

            mlog.log(`New Secondary Customer UID: ${newCustomer.uid}`);
            secondaryCustomer = newCustomer;
        });

        xit('Updates secondary customer info successfully', async () => {
            await delayAsync(20000);
            const fakeEmail = faker.internet.email('qa+', null, 'rizemoney.com');
            const details = {
                address: {
                    street1: faker.address.streetAddress(),
                    city: faker.address.cityName(),
                    state: faker.address.stateAbbr(),
                    postal_code: faker.address.zipCode()
                }
            };
            const updatedCustomer = await rizeClient.customer.update(
                secondaryCustomer.uid,
                fakeEmail,
                details);

            expect(updatedCustomer.details).to.have.property('email').that.equals(fakeEmail);
            expect(updatedCustomer.details.address).to.have.property('street1').that.equals(details.address.street1);
            expect(updatedCustomer.details.address).to.have.property('city').that.equals(details.address.city);
            expect(updatedCustomer.details.address).to.have.property('state').that.equals(details.address.state);
            expect(updatedCustomer.details.address).to.have.property('postal_code').that.equals(details.address.postal_code);

        }).timeout(30000);
    });

    after(() => {
        process.env.TEST_SECONDARY_CUSTOMER_UID = secondaryCustomer.uid;
    });
});
