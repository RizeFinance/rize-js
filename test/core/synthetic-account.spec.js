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

describe('Synthetic Account', () => {
    let testSyntheticAccountTypeUid = '';

    const verifySyntheticAccountTypesList = (list, limit, offset) => {
        expect(list).to.have.property('total_count').to.be.a('number');
        expect(list).to.have.property('count').to.be.a('number');
        expect(list).to.have.property('limit').to.be.a('number').that.equals(limit);
        expect(list).to.have.property('offset').to.be.a('number').that.equals(offset);
        expect(list).to.have.property('data').to.be.an('array');
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
            const promise = rizeClient.customer.getList({limit: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({offset: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Retrieves the synthetic account type list with query', async () => {
            const query = {
                limit: 2,
                offset: 1,
            };
            const syntheticAccountTypes = await rizeClient.syntheticAccount.getTypesList(query);
            verifySyntheticAccountTypesList(syntheticAccountTypes, query.limit, query.offset);

            testSyntheticAccountTypeUid = syntheticAccountTypes.data[0].uid;
        });
    });

    describe('getType', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.syntheticAccount.getType(' ');
            return expect(promise).to.eventually.be.rejectedWith('Synthetic Account Type "uid" is required.');
        });

        it('Retrieves a synthetic account type', async () => {
            const syntheticAccountType = await rizeClient.syntheticAccount.getType(testSyntheticAccountTypeUid);
            expect(syntheticAccountType).to.have.property('uid').that.equals(testSyntheticAccountTypeUid);
        });
    });
});