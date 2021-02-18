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
    describe('getList', () => {
        it('Throws an error if query is invalid', () => {
            const promise = rizeClient.customer.getList('');
            return expect(promise).to.eventually.be.rejectedWith('query is invalid.');
        });

        it('Retrieves the customer list', async () => {
            const customerList = await rizeClient.customer.getList();

            expect(customerList).to.have.property('total_count').to.be.a('number');
            expect(customerList).to.have.property('count').to.be.a('number');
            expect(customerList).to.have.property('limit').to.be.a('number');
            expect(customerList).to.have.property('offset').to.be.a('number');
            expect(customerList).to.have.property('data').to.be.an('array');
        });

        it('Retrieves the customer list with query', async () => {
            const customerList = await rizeClient.customer.getList({status: 'wewrwer'});

            expect(customerList).to.have.property('total_count').to.be.a('number');
            expect(customerList).to.have.property('count').to.be.a('number');
            expect(customerList).to.have.property('limit').to.be.a('number');
            expect(customerList).to.have.property('offset').to.be.a('number');
            expect(customerList).to.have.property('data').to.be.an('array');
        });
    });
});