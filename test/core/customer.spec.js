'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const Rize = require('../../index');
const rizeClient = new Rize(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC
);

describe('Customer', () => {
    
    const verifyCustomerList = (list) => {
        expect(list).to.have.property('total_count').to.be.a('number');
        expect(list).to.have.property('count').to.be.a('number');
        expect(list).to.have.property('limit').to.be.a('number');
        expect(list).to.have.property('offset').to.be.a('number');
        expect(list).to.have.property('data').to.be.an('array');
    };

    describe('getList', () => {
        it('Throws an error if query is invalid', () => {
            const promise = rizeClient.customer.getList('');
            return expect(promise).to.eventually.be.rejectedWith('query should be a CustomerListQuery object.');
        });

        it('Throws an error if status query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({status: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"status" query should be a string. Accepted values are: initiated | queued | identity_verified | active | manual_review | rejected | archived | under_review');
        });

        it('Throws an error if include_initiated query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({include_initiated: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"include_initiated" query should be boolean.');
        });
        
        it('Throws an error if kyc_status query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({kyc_status: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"kyc_status" query should be a string. Accepted values are: approved | denied | documents_provided | documents_rejected | manual_review | pending_documents | ready_for_custodial_partner_review | under_review');
        });

        it('Throws an error if first_name query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({first_name: null});
            return expect(promise).to.eventually.be.rejectedWith('"first_name" query should be a string.');
        });

        it('Throws an error if last_name query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({last_name: null});
            return expect(promise).to.eventually.be.rejectedWith('"last_name" query should be a string.');
        });

        it('Throws an error if email query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({email: null});
            return expect(promise).to.eventually.be.rejectedWith('"email" query should be a string.');
        });

        it('Throws an error if locked query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({locked: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"locked" query should be boolean.');
        });

        it('Throws an error if program_uid query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({program_uid: null});
            return expect(promise).to.eventually.be.rejectedWith('"program_uid" query should be a string.');
        });

        it('Throws an error if external_uid query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({external_uid: null});
            return expect(promise).to.eventually.be.rejectedWith('"external_uid" query should be a string.');
        });

        it('Throws an error if pool_uid query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({pool_uid: []});
            return expect(promise).to.eventually.be.rejectedWith('"pool_uid" query should be an array of strings.');
        });

        it('Throws an error if pool_uid query parameter is invalid: array with not string value', () => {
            const promise = rizeClient.customer.getList({pool_uid: ['test', null]});
            return expect(promise).to.eventually.be.rejectedWith('"pool_uid" query should be an array of strings.');
        });

        it('Throws an error if limit query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({limit: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"limit" query should be an integer.');
        });

        it('Throws an error if offset query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({offset: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"offset" query should be an integer.');
        });

        it('Throws an error if sort query parameter is invalid', () => {
            const promise = rizeClient.customer.getList({sort: ' '});
            return expect(promise).to.eventually.be.rejectedWith('"sort" query should be a string. Accepted values are: first_name_asc | first_name_desc | last_name_asc | last_name_desc | email_asc | email_desc');
        });

        it('Retrieves the customer list', async () => {
            const customerList = await rizeClient.customer.getList();
            verifyCustomerList(customerList);
        });

        it('Retrieves the customer list with query', async () => {
            const query = {
                status: 'initiated',
                include_initiated: true,
                kyc_status: 'approved',
                first_name: 'Rize',
                last_name: 'Rize',
                email: 'rize@rizefs.com',
                locked: false,
                program_uid: 'program_uid',
                external_uid: 'external_uid',
                pool_uid: ['pool_uid1', 'pool_uid2'],
                limit: 50,
                offset: 0,
                sort: 'first_name_asc',
                customer: 'wew'
            };
            const customerList = await rizeClient.customer.getList(query);
            verifyCustomerList(customerList);
        });
    });
});