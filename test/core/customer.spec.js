'use strict';

require('./customer.create.spec');

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const { faker } = require('@faker-js/faker');
const { RandomSSN } = require('ssn');

const rizeClient = require('../helpers/rizeClient');

describe('Customer', () => {
    let customerUid, updatedCustomer, solePropCustomerUid, subLedgerUid;
    const fakeFirstName = faker.name.firstName();
    const fakeMiddleName = faker.name.middleName();
    const fakeLastName = faker.name.lastName();
    const fakeSuffix = faker.name.suffix();
    const fakeEmail = `qa+${fakeFirstName + fakeLastName}@rizemoney.com`;
    const fakePhone = faker.phone.number('##########');
    const fakeSsn = new RandomSSN().value().toFormattedString();
    const fakeDob = '1990-01-31';
    const fakeSolePropFirstName = faker.name.firstName();
    const fakeSolePropLastName = faker.name.lastName();
    const fakeBusinessName = faker.company.companyName();
    const fakeSolePropEmail = `qa+${fakeSolePropFirstName + fakeSolePropLastName}@rizemoney.com`;
    const fakeSolePropSsn = new RandomSSN().value().toFormattedString();
    const fakeStreet1 = faker.address.streetAddress();
    const fakeStreet2 = faker.address.streetAddress();
    const fakeCity = faker.address.city();
    const fakeState = faker.address.stateAbbr();
    const fakePostalCode = faker.address.zipCodeByState(fakeState);

    before(() => {
        customerUid = process.env.TEST_CUSTOMER_UID;
        solePropCustomerUid = process.env.TEST_SOLE_PROP_CUSTOMER_UID;
        subLedgerUid = process.env.TEST_SUB_LEDGER_CUSTOMER_UID;
    });

    describe('update', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.customer.update('');
            return expect(promise).to.eventually.be.rejectedWith(
                'Customer "uid" is required.'
            );
        });

        it('Throws an error if "email" is invalid', () => {
            const promise = rizeClient.customer.update(customerUid, 'test');
            return expect(promise).to.eventually.be.rejectedWith(
                '"email" is invalid.'
            );
        });

        it('Throws an error if "details" is invalid', () => {
            const promise = rizeClient.customer.update(customerUid, '', '');
            return expect(promise).to.eventually.be.rejectedWith(
                '"details" should be a CustomerDetailsParams object.'
            );
        });

        it('Throws an error if "details.phone" has invalid format', () => {
            const promise = rizeClient.customer.update(customerUid, '', {
                first_name: fakeFirstName,
                last_name: fakeLastName,
                phone: '123-123-1234'
            });
            return expect(promise).to.eventually.be.rejectedWith(
                '"details.phone" should contain exactly 10 digits.'
            );
        });

        it('Throws an error if "details.ssn" has invalid format', () => {
            const promise = rizeClient.customer.update(customerUid, '', {
                first_name: fakeFirstName,
                last_name: fakeLastName,
                phone: fakePhone,
                ssn: '111223333',
            });
            return expect(promise).to.eventually.be.rejectedWith(
                '"details.ssn" should be formatted as ###-##-####'
            );
        });

        it('Throws an error if "details.address" is invalid', () => {
            const promise = rizeClient.customer.update(customerUid, '', {
                first_name: fakeFirstName,
                last_name: fakeLastName,
                phone: fakePhone,
                ssn: fakeSsn,
                dob: fakeDob,
                address: 'fake'
            });
            return expect(promise).to.eventually.be.rejectedWith(
                '"details.address" should be an Address object.'
            );
        });

        it('Throws an error if "details.address.state" is invalid', () => {
            const promise = rizeClient.customer.update(customerUid, '', {
                first_name: fakeFirstName,
                last_name: fakeLastName,
                phone: fakePhone,
                ssn: fakeSsn,
                dob: fakeDob,
                address: {
                    street1: fakeStreet1,
                    city: fakeCity,
                    state: '1234'
                },
            });
            return expect(promise).to.eventually.be.rejectedWith(
                '"details.address.state" must be a valid US state abbreviation.'
            );
        });

        it('Throws an error if "details.address.postal_code" is invalid', () => {
            const promise = rizeClient.customer.update(customerUid, '', {
                first_name: fakeFirstName,
                last_name: fakeLastName,
                phone: fakePhone,
                ssn: fakeSsn,
                dob: fakeDob,
                address: {
                    street1: fakeStreet1,
                    city: fakeCity,
                    state: fakeState,
                    postal_code: '123'
                },
            });
            return expect(promise).to.eventually.be.rejectedWith(
                '"details.address.postal_code" must be a valid ZIP code.'
            );
        });

        it('Updates primary customer info successfully', async () => {
            updatedCustomer = await rizeClient.customer.update(
                customerUid,
                fakeEmail,
                {
                    first_name: fakeFirstName,
                    middle_name: fakeMiddleName,
                    last_name: fakeLastName,
                    suffix: fakeSuffix,
                    phone: fakePhone,
                    ssn: fakeSsn,
                    dob: fakeDob,
                    address: {
                        street1: fakeStreet1,
                        street2: fakeStreet2,
                        city: fakeCity,
                        state: fakeState,
                        postal_code: fakePostalCode,
                    },
                }
            );

            expect(updatedCustomer).to.have.property('uid').that.equals(customerUid);
            expect(updatedCustomer)
                .to.have.nested.property('details.first_name')
                .that.equals(fakeFirstName);
            expect(updatedCustomer)
                .to.have.nested.property('details.middle_name')
                .that.equals(fakeMiddleName);
            expect(updatedCustomer)
                .to.have.nested.property('details.last_name')
                .that.equals(fakeLastName);
            expect(updatedCustomer)
                .to.have.nested.property('details.dob')
                .that.equals(fakeDob);
            expect(updatedCustomer)
                .to.have.nested.property('details.phone')
                .that.equals(fakePhone);
            expect(updatedCustomer)
                .to.have.nested.property('details.ssn_last_four')
                .that.equals(fakeSsn.substring(fakeSsn.length - 4));
            expect(updatedCustomer)
                .to.have.nested.property('details.suffix')
                .that.equals(fakeSuffix);
            expect(updatedCustomer)
                .to.have.nested.property('details.address.street1')
                .that.equals(fakeStreet1);
            expect(updatedCustomer)
                .to.have.nested.property('details.address.street2')
                .that.equals(fakeStreet2);
            expect(updatedCustomer)
                .to.have.nested.property('details.address.city')
                .that.equals(fakeCity);
            expect(updatedCustomer)
                .to.have.nested.property('details.address.state')
                .that.equals(fakeState);
            expect(updatedCustomer)
                .to.have.nested.property('details.address.postal_code')
                .that.equals(fakePostalCode);
        });
    });

    it('Updates sole proprietor customer info successfully', async () => {
        let soleProprietorCustomer = await rizeClient.customer.update(solePropCustomerUid, fakeSolePropEmail, {
            first_name: fakeSolePropFirstName,
            middle_name: fakeMiddleName,
            last_name: fakeSolePropLastName,
            business_name: fakeBusinessName,
            suffix: fakeSuffix,
            phone: fakePhone,
            ssn: fakeSolePropSsn,
            dob: fakeDob,
            address: {
                street1: fakeStreet1,
                street2: fakeStreet2,
                city: fakeCity,
                state: fakeState,
                postal_code: fakePostalCode,
            }
        });
        expect(soleProprietorCustomer).to.have.property('uid').that.equals(solePropCustomerUid);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.first_name')
            .that.equals(fakeSolePropFirstName);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.middle_name')
            .that.equals(fakeMiddleName);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.last_name')
            .that.equals(fakeSolePropLastName);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.business_name')
            .that.equals(fakeBusinessName);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.dob')
            .that.equals(fakeDob);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.phone')
            .that.equals(fakePhone);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.ssn_last_four')
            .that.equals(fakeSolePropSsn.substring(fakeSolePropSsn.length - 4));
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.suffix')
            .that.equals(fakeSuffix);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.address.street1')
            .that.equals(fakeStreet1);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.address.street2')
            .that.equals(fakeStreet2);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.address.city')
            .that.equals(fakeCity);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.address.state')
            .that.equals(fakeState);
        expect(soleProprietorCustomer)
            .to.have.nested.property('details.address.postal_code')
            .that.equals(fakePostalCode);
    });

    it('Updates sub-ledger customer info successfully', async () => {
        const fakeFirstName = faker.name.firstName();
        const fakeLastName = faker.name.lastName();

        let subLedgerCustomer = await rizeClient.customer.update(subLedgerUid, null, {
            first_name: fakeFirstName,
            middle_name: null,
            last_name: fakeLastName,
        });
        expect(subLedgerCustomer).to.have.property('uid').that.equals(subLedgerUid);
        expect(subLedgerCustomer)
            .to.have.nested.property('details.first_name')
            .that.equals(fakeFirstName);
        expect(subLedgerCustomer)
            .to.have.nested.property('details.middle_name')
            .that.equals(null);
        expect(subLedgerCustomer)
            .to.have.nested.property('details.last_name')
            .that.equals(fakeLastName);
    });

    describe('getList', () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.customer.getList('');
            return expect(promise).to.eventually.be.rejectedWith(
                '"query" must be a CustomerListQuery object.'
            );
        });

        it('Throws an error if "status" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ status: ' ' });
            return expect(promise).to.eventually.be.rejectedWith(
                '"status" query must be a string. Accepted values are: initiated | queued | identity_verified | active | manual_review | rejected | archived | under_review | pending_archival'
            );
        });

        it('Throws an error if "include_initiated" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ include_initiated: ' ' });
            return expect(promise).to.eventually.be.rejectedWith(
                '"include_initiated" query must be boolean.'
            );
        });

        it('Throws an error if "kyc_status" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ kyc_status: ' ' });
            return expect(promise).to.eventually.be.rejectedWith(
                '"kyc_status" query must be a string. Accepted values are: approved | denied | documents_provided | documents_rejected | manual_review | pending_documents | ready_for_custodial_partner_review | under_review'
            );
        });

        it('Throws an error if "first_name" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ first_name: null });
            return expect(promise).to.eventually.be.rejectedWith(
                '"first_name" query must be a string.'
            );
        });

        it('Throws an error if "last_name" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ last_name: null });
            return expect(promise).to.eventually.be.rejectedWith(
                '"last_name" query must be a string.'
            );
        });

        it('Throws an error if "customer_type" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ customer_type: 'LLC' });
            return expect(promise).to.eventually.be.rejectedWith(
                '"customer_type" query must be a string. Accepted values are: primary | sole_proprietor | secondary | sub_ledger'
            );
        });

        it('Throws an error if "email" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ email: null });
            return expect(promise).to.eventually.be.rejectedWith(
                '"email" query must be a string.'
            );
        });

        it('Throws an error if "locked" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ locked: ' ' });
            return expect(promise).to.eventually.be.rejectedWith(
                '"locked" query must be boolean.'
            );
        });

        it('Throws an error if "program_uid" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ program_uid: null });
            return expect(promise).to.eventually.be.rejectedWith(
                '"program_uid" query must be a string.'
            );
        });

        it('Throws an error if "external_uid" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ external_uid: null });
            return expect(promise).to.eventually.be.rejectedWith(
                '"external_uid" query must be a string.'
            );
        });

        it('Throws an error if "pool_uid" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ pool_uid: [] });
            return expect(promise).to.eventually.be.rejectedWith(
                '"pool_uid" query must be an array of strings.'
            );
        });

        it('Throws an error if "pool_uid" query parameter is invalid: array with not string value', () => {
            const promise = rizeClient.customer.getList({ pool_uid: ['test', null] });
            return expect(promise).to.eventually.be.rejectedWith(
                '"pool_uid" query must be an array of strings.'
            );
        });

        it('Throws an error if "limit" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ limit: ' ' });
            return expect(promise).to.eventually.be.rejectedWith(
                '"limit" query must be an integer.'
            );
        });

        it('Throws an error if "offset" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ offset: ' ' });
            return expect(promise).to.eventually.be.rejectedWith(
                '"offset" query must be an integer.'
            );
        });

        it('Throws an error if "sort" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ sort: ' ' });
            return expect(promise).to.eventually.be.rejectedWith(
                '"sort" query must be a string. Accepted values are: first_name_asc | first_name_desc | last_name_asc | last_name_desc | email_asc | email_desc'
            );
        });

        it('Throws an error if "business_name" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ business_name: null });
            return expect(promise).to.eventually.be.rejectedWith(
                '"business_name" query must be a string.'
            );
        });

        it('Retrieves the customer list', async () => {
            const customerList = await rizeClient.customer.getList();
            utils.expectRizeList(customerList);
        }).timeout(10000);

        it('Retrieves the customer list with query', async () => {
            const query = {
                status: updatedCustomer.status,
                include_initiated: true,
                kyc_status: 'approved',
                first_name: updatedCustomer.details.first_name,
                last_name: updatedCustomer.details.last_name,
                email: updatedCustomer.email,
                locked: false,
                program_uid: updatedCustomer.program_uid,
                external_uid: updatedCustomer.external_uid,
                limit: 50,
                offset: 0,
                sort: 'first_name_asc',
            };

            const customerList = await rizeClient.customer.getList(query);
            utils.expectRizeList(customerList);
        });
    });
    it('Retrieves sole proprietor customer list with query', async () => {
        const query = {
            customer_type: 'sole_proprietor',
            business_name: fakeBusinessName
        };

        const customerList = await rizeClient.customer.getList(query);
        utils.expectRizeList(customerList);
        customerList.data.forEach(customer => {
            expect(customer).to.have.property('customer_type', 'sole_proprietor');
            expect(customer).to.have.property('business_name', fakeBusinessName);
        });
    });

    it('Retrieves sub ledger customer list with query', async () => {
        const query = {
            customer_type: 'sub_ledger',
        };

        const customerList = await rizeClient.customer.getList(query);
        utils.expectRizeList(customerList);
        customerList.data.forEach(customer => {
            expect(customer).to.have.property('customer_type', 'sub_ledger');
        });
    });

    it('Retrieves primary customer list with query', async () => {
        const query = {
            customer_type: 'primary',
        };

        const customerList = await rizeClient.customer.getList(query);
        utils.expectRizeList(customerList);
        customerList.data.forEach(customer =>
            expect(customer).to.have.property('customer_type', 'primary')
        );
    }).timeout(10000);

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.customer.get('');
            return expect(promise).to.eventually.be.rejectedWith(
                'Customer "uid" is required.'
            );
        });

        it('Retrieves customer info successfully', async () => {
            const customer = await rizeClient.customer.get(customerUid);
            expect(customer).to.have.property('uid').that.equals(customerUid);
            expect(customer).to.have.nested.property('details.first_name');
            expect(customer).to.have.nested.property('details.middle_name');
            expect(customer).to.have.nested.property('details.last_name');
            expect(customer).to.have.nested.property('details.dob');
            expect(customer).to.have.nested.property('details.phone');
            expect(customer).to.have.nested.property('details.ssn_last_four');
            expect(customer).to.have.nested.property('details.suffix');
            expect(customer).to.have.nested.property('details.address.street1');
            expect(customer).to.have.nested.property('details.address.street2');
            expect(customer).to.have.nested.property('details.address.city');
            expect(customer).to.have.nested.property('details.address.state');
            expect(customer).to.have.nested.property('details.address.postal_code');
        });
    });

    describe('identityConfirmation', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.customer.identityConfirmation(' ');
            return expect(promise).to.eventually.be.rejectedWith(
                'Customer "uid" is required.'
            );
        });
    });

    describe('lock', () => {
        const lockReason = 'Customer Request';
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.customer.lock(' ', lockReason);
            return expect(promise).to.eventually.be.rejectedWith(
                'Customer "uid" is required.'
            );
        });

        it('Throws an error if "lockReason" is invalid', () => {
            const promise = rizeClient.customer.lock(customerUid, ' ');
            return expect(promise).to.eventually.be.rejectedWith(
                '"lockReason" is required.'
            );
        });

        it('Locks the customer account', async () => {
            const lockedCustomer = await rizeClient.customer.lock(
                customerUid,
                lockReason
            );
            expect(lockedCustomer.lock_reason).equals(lockReason);
            expect(lockedCustomer.locked_at).to.not.equal(null);
        });
    });

    describe('unlock', () => {
        const unlockReason = 'Account must be unlocked.';
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.customer.unlock(' ', unlockReason);
            return expect(promise).to.eventually.be.rejectedWith(
                'Customer "uid" is required.'
            );
        });

        it('Throws an error if "unlockReason" is invalid', () => {
            const promise = rizeClient.customer.unlock(customerUid, true);
            return expect(promise).to.eventually.be.rejectedWith(
                '"unlockReason" must be a string.'
            );
        });

        it('Throws an error if "unlock_all_secondary" is invalid', () => {
            const promise = rizeClient.customer.unlock(customerUid, unlockReason, 'invalid');
            return expect(promise).to.eventually.be.rejectedWith(
                '"unlock_all_secondary" can only be true, false or null.'
            );
        });

        it('Throws an error if "unlock_all_secondary" is 0', () => {
            const promise = rizeClient.customer.unlock(customerUid, unlockReason, 0);
            return expect(promise).to.eventually.be.rejectedWith(
                '"unlock_all_secondary" can only be true, false or null.'
            );
        });

        it('Throws an error if "unlock_all_secondary" is 1', () => {
            const promise = rizeClient.customer.unlock(customerUid, unlockReason, 1);
            return expect(promise).to.eventually.be.rejectedWith(
                '"unlock_all_secondary" can only be true, false or null.'
            );
        });

        it('Unlocks the customer account without unlock_reason', async () => {
            await rizeClient.customer.lock(customerUid, unlockReason);
            const unlockedCustomer = await rizeClient.customer.unlock(customerUid);
            expect(unlockedCustomer.lock_reason).equals(null);
            expect(unlockedCustomer.locked_at).equals(null);
        });

        it('Unlocks the customer account with unlock_reason', async () => {
            await rizeClient.customer.lock(customerUid, unlockReason);
            const unlockedCustomer = await rizeClient.customer.unlock(
                customerUid,
                unlockReason
            );
            expect(unlockedCustomer.lock_reason).equals(null);
            expect(unlockedCustomer.locked_at).equals(null);
        });

        it('Unlocks the customer account with unlock_all_customers as false', async () => {
            await rizeClient.customer.lock(customerUid, unlockReason);
            const unlockedCustomer = await rizeClient.customer.unlock(
                customerUid,
                unlockReason,
                false
            );
            expect(unlockedCustomer.lock_reason).equals(null);
            expect(unlockedCustomer.locked_at).equals(null);
        });

        it('Unlocks the customer account with unlock_all_customers as true', async () => {
            await rizeClient.customer.lock(customerUid, unlockReason);
            const unlockedCustomer = await rizeClient.customer.unlock(
                customerUid,
                unlockReason,
                true
            );
            expect(unlockedCustomer.lock_reason).equals(null);
            expect(unlockedCustomer.locked_at).equals(null);
        });
    });
});
