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

describe('Pools', () => {
    let customerUid;
    let poolId;
    const fakeExternalId = faker.random.uuid();

    before(() => {
        customerUid = process.env.TEST_CUSTOMER_UID;
    });

    const verifypoolList = (list) => {
        expect(list).to.have.property('total_count').to.be.a('number');
        expect(list).to.have.property('count').to.be.a('number');
        expect(list).to.have.property('limit').to.be.a('number');
        expect(list).to.have.property('offset').to.be.a('number');    
        expect(list).to.have.property('data').to.be.an('array');
    };

    describe('getList', () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.pool.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a PoolListQuery object.');
        });

        it('Throws an error if "customer_uid" query parameter is invalid', () => {
            const promise = rizeClient.pool.getList({customer_uid: ''});
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query should not be empty.');
        });

        it('Throws an error if "external_uid" query parameter is invalid', () => {
            const promise = rizeClient.pool.getList({external_uid: ''});
            return expect(promise).to.eventually.be.rejectedWith('"external_uid" query must be a string.');
        });

        it('Throws an error if "limit" query parameter is invalid', () => {
            const promise = rizeClient.pool.getList({limit: 'a'});
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query parameter is invalid', () => {
            const promise = rizeClient.pool.getList({offset: 'a'});
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Retrieves the pool list', async () => {
            const poolList = await rizeClient.pool.getList();
            const lastPool = poolList.data[poolList.data.length - 1];
            poolId = lastPool.uid;
            verifypoolList(poolList);
        });

        it('Retrieves the pool list with query', async () => {
            const query = {
                customer_uid: customerUid,
                external_uid: fakeExternalId,
                limit: 50,
                offset: 0,
            };

            const poolList = await rizeClient.pool.getList(query);
            verifypoolList(poolList);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.pool.get('');
            return expect(promise).to.eventually.be.rejectedWith('Pool "uid" is required.');
        });

        it('Retrieves pool info successfully', async () => {
            const account = await rizeClient.pool.get(poolId);
            expect(account).to.have.property('uid').that.equals(poolId);
            expect(account).to.have.property('name');
            expect(account).to.have.property('owner_customer_uid');
        });
    });
});