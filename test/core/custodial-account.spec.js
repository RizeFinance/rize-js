'use strict';

require('./customer.spec');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const faker = require('faker');

const Rize = require('../../index');
const rizeClient = new Rize(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC
);

describe('Custodial Accounts', () => {
    let customerUid;
    let custodialAccountId;
    const fakeExternalId = faker.random.uuid();

    before(() => {
        customerUid = process.env.TEST_CUSTOMER_UID;
    });

    const verifycustodialAccountList = (list) => {
        expect(list).to.have.property('total_count').to.be.a('number');
        expect(list).to.have.property('count').to.be.a('number');
        expect(list).to.have.property('limit').to.be.a('number');
        expect(list).to.have.property('offset').to.be.a('number');    
        expect(list).to.have.property('data').to.be.an('array');
    };

    describe('getList', () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.custodialAccount.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a CustodialAccountListQuery object.');
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const promise = rizeClient.custodialAccount.getList({customer_uid: ''});
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array.');
        });

        it('Throws an error if "external_uid" query parameter is invalid', () => {
            const promise = rizeClient.custodialAccount.getList({external_uid: ''});
            return expect(promise).to.eventually.be.rejectedWith('"external_uid" query must be a string.');
        });

        it('Throws an error if "limit" query parameter is invalid', () => {
            const promise = rizeClient.custodialAccount.getList({limit: 'a'});
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query parameter is invalid', () => {
            const promise = rizeClient.custodialAccount.getList({offset: 'a'});
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Throws an error if "liability" query parameter is invalid', () => {
            const promise = rizeClient.custodialAccount.getList({liability: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"liability" query must be a boolean.');
        });

        it('Throws an error if "type" query parameter is invalid', () => {
            const promise = rizeClient.custodialAccount.getList({type: 'test'});
            return expect(promise).to.eventually.be.rejectedWith('"type" query must be a string. Accepted values are: dda | dda_cash_external | dda_cash_received');
        });

        it('Retrieves the custodialAccount list', async () => {
            const custodialAccountList = await rizeClient.custodialAccount.getList();
            const lastCustodialAccount = custodialAccountList.data[custodialAccountList.data.length - 1];
            custodialAccountId = lastCustodialAccount.uid;
            verifycustodialAccountList(custodialAccountList);
        });

        it('Retrieves the custodialAccount list with query', async () => {
            const query = {
                customer_uid: [customerUid],
                external_uid: fakeExternalId,
                limit: 50,
                offset: 0,
                liability: 'false',
                type: 'dda'
            };

            const custodialAccountList = await rizeClient.custodialAccount.getList(query);
            verifycustodialAccountList(custodialAccountList);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.custodialAccount.get('');
            return expect(promise).to.eventually.be.rejectedWith('Custodial Account "uid" is required.');
        });

        it('Retrieves custodial account info successfully', async () => {
            const account = await rizeClient.custodialAccount.get(custodialAccountId);
            expect(account).to.have.property('uid').that.equals(custodialAccountId);
            expect(account).to.have.property('external_uid');
            expect(account).to.have.property('customer_uid');
            expect(account).to.have.property('pool_uid');
            expect(account).to.have.property('program_service_offering_uid');
            expect(account).to.have.property('type');
            expect(account).to.have.property('liability');
            expect(account).to.have.property('name');
            expect(account).to.have.property('primary_account');
            expect(account).to.have.property('status');
            expect(account).to.have.property('account_errors');
            expect(account).to.have.property('net_usd_balance');
            expect(account).to.have.property('net_usd_pending_balance');
            expect(account).to.have.property('net_usd_available_balance');
            expect(account).to.have.property('account_number');
            expect(account).to.have.property('account_number_masked');
            expect(account).to.have.property('routing_number');
            expect(account).to.have.property('opened_at');
            expect(account).to.have.property('closed_at');
        });
    });
});