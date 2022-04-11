'use strict';

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { faker } = require('@faker-js/faker');

chai.use(chaiAsPromised);
const expect = chai.expect;

const rizeClient = require('../helpers/rizeClient');

describe('Synthetic Account', () => {
    let customerUid;
    let customerPoolUid;
    let testGeneralSyntheticAccountTypeUid;
    let testExternalSyntheticAccountTypeUid;
    let testOutboundAchSyntheticAccountTypeUid;
    let testPlaidExternalSyntheticAccountTypeUid;
    let testGeneralSyntheticAccount;
    let testExternalSyntheticAccount;

    before(() => {
        customerUid = process.env.TEST_CUSTOMER_UID;
        customerPoolUid = process.env.TEST_CUSTOMER_POOL_UID;
    });

    const verifySyntheticAccountTypesList = (list, limit, offset) => {
        expect(list).to.have.property('total_count').to.be.a('number');
        expect(list).to.have.property('count').to.be.a('number');
        expect(list).to.have.property('limit').to.be.a('number').that.equals(limit);
        expect(list).to.have.property('offset').to.be.a('number').that.equals(offset);
        expect(list).to.have.property('data').to.be.an('array');
    };

    const verifyNewSyntheticAccount = (data, name, externalUid, poolUid, syntheticAccountTypeUid, syntheticAccountCategory, accountNumber, routingNumber) => {
        expect(data).to.have.property('uid');
        expect(data).to.have.property('name').that.equals(name);
        expect(data).to.have.property('external_uid').that.equals(externalUid);
        expect(data).to.have.property('pool_uid').that.equals(poolUid);
        expect(data).to.have.property('synthetic_account_type_uid').that.equals(syntheticAccountTypeUid);
        expect(data).to.have.property('synthetic_account_category').that.equals(syntheticAccountCategory);
        expect(data).to.have.property('status');
        expect(data).to.have.property('liability');
        expect(data).to.have.property('net_usd_balance');
        expect(data).to.have.property('net_usd_pending_balance');
        expect(data).to.have.property('net_usd_available_balance');
        expect(data).to.have.property('master_account');

        if (syntheticAccountCategory === 'external') {
            expect(data).to.have.property('account_number').that.equals(null);
            expect(data).to.have.property('account_number_last_four').that.equals(accountNumber.substring(accountNumber.length - 4, accountNumber.length));
            expect(data).to.have.property('routing_number').that.equals(routingNumber);
        } else {
            expect(data).to.have.property('account_number');
            expect(data).to.have.property('account_number_last_four');
            expect(data).to.have.property('routing_number');
        }

        expect(data).to.have.property('closed_to_synthetic_account_uid');
    };

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.syntheticAccount.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a SyntheticAccountListQuery object.');
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array of strings.');
        });

        it('Throws an error if "customer_uid" query is not an array of strings', () => {
            const query = { customer_uid: ['customer_uid', null] };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array of strings.');
        });

        it('Throws an error if "external_uid" query is not a string', () => {
            const query = { external_uid: null };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"external_uid" query must be a string.');
        });

        it('Throws an error if "pool_uid" query is not an array', () => {
            const query = { pool_uid: '' };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"pool_uid" query must be an array of strings.');
        });

        it('Throws an error if "pool_uid" query is not an array of strings', () => {
            const query = { pool_uid: ['pool_uid', null] };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"pool_uid" query must be an array of strings.');
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Throws an error if "synthetic_account_type_uid" query is not a string', () => {
            const query = { synthetic_account_type_uid: null };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"synthetic_account_type_uid" query must be a string.');
        });

        it('Throws an error if "synthetic_account_category" query is not on the synthetic_account_category options', () => {
            const query = { synthetic_account_category: 'test' };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"synthetic_account_category" query must be a string. Accepted values are: general | external | plaid_external');
        });

        it('Throws an error if "program_uid" query is not a string', () => {
            const query = { program_uid: null };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"program_uid" query must be a string.');
        });

        it('Throws an error if "liability" query is not a boolean', () => {
            const query = { liability: null };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"liability" query must be boolean.');
        });

        it('Throws an error if "sort" query is not on the sort options', () => {
            const query = { sort: null };
            const promise = rizeClient.syntheticAccount.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"sort" query must be a string. Accepted values are: name_asc | name_desc | net_usd_balance_asc | net_usd_balance_desc | net_usd_pending_balance_asc | net_usd_pending_balance_desc | net_usd_available_balance_asc | net_usd_available_balance_desc');
        });

        it('Retrieves the synthetic account list without query', async () => {
            const syntheticAccountList = await rizeClient.syntheticAccount.getList();

            utils.expectRizeList(syntheticAccountList);
        });

        it('Retrieves the synthetic account list with customer_uid query', async () => {
            const syntheticAccountList = await rizeClient.syntheticAccount.getList({
                customer_uid: [customerUid]
            });

            utils.expectRizeList(syntheticAccountList);

            testGeneralSyntheticAccount = syntheticAccountList.data[1];
        });

        it('Retrieves the synthetic account list with query', async () => {
            const query = {
                customer_uid: ['customer_uid1', 'customer_uid2'],
                external_uid: 'external_uid',
                pool_uid: ['pool_uid1', 'pool_uid2'],
                limit: 50,
                offset: 0,
                synthetic_account_type_uid: 'synthetic_account_type_uid',
                synthetic_account_category: 'general',
                program_uid: 'program_uid',
                liability: true,
                sort: 'name_asc'
            };
            const syntheticAccountList = await rizeClient.syntheticAccount.getList(query);
            utils.expectRizeList(syntheticAccountList);
        });
    });

    describe('getTypesList', () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.syntheticAccount.getTypesList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a SyntheticAccountTypeListQuery object.');
        });

        it('Throws an error if "limit" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ limit: ' ' });
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({ offset: ' ' });
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Retrieves the synthetic account type list with query', async () => {
            const query = {
                limit: 10,
                offset: 0,
            };
            const syntheticAccountTypes = await rizeClient.syntheticAccount.getTypesList(query);
            verifySyntheticAccountTypesList(syntheticAccountTypes, query.limit, query.offset);

            testGeneralSyntheticAccountTypeUid = syntheticAccountTypes.data
                .find(x => x.synthetic_account_category === 'general')
                .uid;

            testExternalSyntheticAccountTypeUid = syntheticAccountTypes.data
                .find(x => x.synthetic_account_category === 'external')
                .uid;

            testPlaidExternalSyntheticAccountTypeUid = syntheticAccountTypes.data
                .find(x => x.synthetic_account_category === 'plaid_external')
                .uid;

            testOutboundAchSyntheticAccountTypeUid = syntheticAccountTypes.data
                .find(x => x.synthetic_account_category === 'outbound_ach')
                .uid;
        });
    });

    describe('getType', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.syntheticAccount.getType(' ');
            return expect(promise).to.eventually.be.rejectedWith('Synthetic Account Type "uid" is required.');
        });

        it('Retrieves a synthetic account type', async () => {
            const syntheticAccountType = await rizeClient.syntheticAccount.getType(testGeneralSyntheticAccountTypeUid);
            expect(syntheticAccountType).to.have.property('uid').that.equals(testGeneralSyntheticAccountTypeUid);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.syntheticAccount.get('');
            return expect(promise).to.eventually.be.rejectedWith('Synthetic Account "uid" is required.');
        });

        it('Retrieves synthetic account info successfully', async () => {
            const syntheticAccount = await rizeClient.syntheticAccount.get(testGeneralSyntheticAccount.uid);
            expect(syntheticAccount).to.have.property('uid').that.equals(testGeneralSyntheticAccount.uid);
        });
    });

    describe('create', () => {
        const fakeGeneralSyntheticAccountName = 'Test General Account';
        const fakeGeneralSyntheticAccountExternalUid = faker.datatype.uuid();
        const fakeExternalSyntheticAccountName = 'Test External Account';
        const fakeExternalSyntheticAccountExternalUid = faker.datatype.uuid();
        const fakeOutboundAchSyntheticAccountName = 'Test Outbound ACH Account';
        const fakeOutboundAchSyntheticAccountExternalUid = faker.datatype.uuid();

        it('Throws an error if "external_uid" is empty', () => {

            const request = {
                external_uid: '',
                pool_uid: testGeneralSyntheticAccount.pool_uid,
                name: fakeGeneralSyntheticAccountName,
                synthetic_account_type_uid: testGeneralSyntheticAccount.synthetic_account_type_uid
            };

            const promise = rizeClient.syntheticAccount.create(request);
            return expect(promise).to.eventually.be.rejectedWith('Create Synthetic Account "external_uid" is required.');
        });

        it('Throws an error if "pool_uid" is empty', () => {
            const request = {
                external_uid: fakeGeneralSyntheticAccountExternalUid,
                pool_uid: '',
                name: fakeGeneralSyntheticAccountName,
                synthetic_account_type_uid: testGeneralSyntheticAccount.synthetic_account_type_uid
            };

            const promise = rizeClient.syntheticAccount.create(request);
            return expect(promise).to.eventually.be.rejectedWith('Create Synthetic Account "pool_uid" is required.');
        });

        it('Throws an error if "name" is empty', () => {
            const request = {
                external_uid: fakeGeneralSyntheticAccountExternalUid,
                pool_uid: testGeneralSyntheticAccount.pool_uid,
                name: '',
                synthetic_account_type_uid: testGeneralSyntheticAccount.synthetic_account_type_uid
            };

            const promise = rizeClient.syntheticAccount.create(request);
            return expect(promise).to.eventually.be.rejectedWith('Create Synthetic Account "name" is required.');
        });

        it('Throws an error if "synthetic_account_type_uid" is empty', () => {
            const request = {
                external_uid: fakeGeneralSyntheticAccountExternalUid,
                pool_uid: testGeneralSyntheticAccount.pool_uid,
                name: fakeGeneralSyntheticAccountName,
                synthetic_account_type_uid: ''
            };

            const promise = rizeClient.syntheticAccount.create(request);
            return expect(promise).to.eventually.be.rejectedWith('Create Synthetic Account "synthetic_account_type_uid" is required.');
        });

        it('Creates a new general synthetic account', async () => {
            const request = {
                external_uid: fakeGeneralSyntheticAccountExternalUid,
                pool_uid: customerPoolUid,
                name: fakeGeneralSyntheticAccountName,
                synthetic_account_type_uid: testGeneralSyntheticAccountTypeUid
            };

            const syntheticAccount = await rizeClient.syntheticAccount.create(request);

            verifyNewSyntheticAccount(
                syntheticAccount,
                fakeGeneralSyntheticAccountName,
                fakeGeneralSyntheticAccountExternalUid,
                customerPoolUid,
                testGeneralSyntheticAccountTypeUid,
                'general'
            );

            testGeneralSyntheticAccount = syntheticAccount;
        });

        it('Creates a new external synthetic account', async () => {
            const accountNumber = Math.random().toString().slice(2, 14);
            const routingNumber = Math.random().toString().slice(2, 11);

            const request = {
                external_uid: fakeExternalSyntheticAccountExternalUid,
                pool_uid: customerPoolUid,
                name: fakeExternalSyntheticAccountName,
                synthetic_account_type_uid: testExternalSyntheticAccountTypeUid,
                account_number: accountNumber,
                routing_number: routingNumber
            };

            const syntheticAccount = await rizeClient.syntheticAccount.create(request);

            verifyNewSyntheticAccount(
                syntheticAccount,
                fakeExternalSyntheticAccountName,
                fakeExternalSyntheticAccountExternalUid,
                customerPoolUid,
                testExternalSyntheticAccountTypeUid,
                'external',
                accountNumber,
                routingNumber
            );

            testExternalSyntheticAccount = syntheticAccount;
        });

        xit('Creates a new plaid_external synthetic account', async () => {
            const plaidProcessorToken = faker.datatype.uuid();
            const request = {
                external_uid: fakeExternalSyntheticAccountExternalUid,
                pool_uid: customerPoolUid,
                name: fakeExternalSyntheticAccountName,
                synthetic_account_type_uid: testPlaidExternalSyntheticAccountTypeUid,
                plaid_processor_token: plaidProcessorToken,
            };

            const syntheticAccount = await rizeClient.syntheticAccount.create(request);

            verifyNewSyntheticAccount(
                syntheticAccount,
                fakeExternalSyntheticAccountName,
                fakeExternalSyntheticAccountExternalUid,
                customerPoolUid,
                testPlaidExternalSyntheticAccountTypeUid,
                'plaid_external'
            );
        });

        it('Creates a new outbound_ach synthetic account', async () => {
            const accountNumber = Math.random().toString().slice(2, 14);
            const routingNumber = Math.random().toString().slice(2, 11);

            const request = {
                external_uid: fakeOutboundAchSyntheticAccountExternalUid,
                pool_uid: customerPoolUid,
                name: fakeOutboundAchSyntheticAccountName,
                synthetic_account_type_uid: testOutboundAchSyntheticAccountTypeUid,
                account_number: accountNumber,
                routing_number: routingNumber
            };

            const syntheticAccount = await rizeClient.syntheticAccount.create(request);

            verifyNewSyntheticAccount(
                syntheticAccount,
                fakeOutboundAchSyntheticAccountName,
                fakeOutboundAchSyntheticAccountExternalUid,
                customerPoolUid,
                testOutboundAchSyntheticAccountTypeUid,
                'outbound_ach',
                accountNumber,
                routingNumber
            );
        });
    });

    describe('update', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.syntheticAccount.update(' ', 'name', 'note');
            return expect(promise).to.eventually.be.rejectedWith('Synthetic Account "uid" is required.');
        });

        it('Throws an error if "name" is empty', () => {
            const syntheticAccountUid = testGeneralSyntheticAccount.uid;
            const promise = rizeClient.syntheticAccount.update(syntheticAccountUid, ' ', 'note');
            return expect(promise).to.eventually.be.rejectedWith('Synthetic Account "name" is required.');
        });

        it('Update a synthetic account', async () => {
            const syntheticAccountUid = testGeneralSyntheticAccount.uid;
            const syntheticAccountType = await rizeClient.syntheticAccount.update(syntheticAccountUid, 'new name', 'note');
            expect(syntheticAccountType).to.have.property('uid').that.equals(syntheticAccountUid);
            expect(syntheticAccountType).to.have.property('name').that.equals('new name');
        });
    });

    describe('archive', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.syntheticAccount.archive('');
            return expect(promise).to.eventually.be.rejectedWith('Synthetic Account "uid" is required.');
        });

        it('Archives the general synthetic account successfully', () => {
            return expect(rizeClient.syntheticAccount.archive(testGeneralSyntheticAccount.uid)).to.be.fulfilled;
        });
    });

    after(() => {
        process.env.TEST_EXTERNAL_SYNTHETIC_ACCOUNT_UID = testExternalSyntheticAccount.uid;
    });
});
