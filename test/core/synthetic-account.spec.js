'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const faker = require('faker');

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

    describe('create', () => {
        it('Create a new synthetic account', async () => {
            const request = {
                name: faker.random.words(),
                poolUid: faker.random.uuid(),
                syntheticAccountTypeUid: testSyntheticAccountTypeUid,
                accountNumber: '123456789012',
                routingNumber: '123456789',
                plaidProcessorToken: faker.random.alphaNumeric(115)
            };

            const syntheticAccount = await rizeClient.syntheticAccount.create(request);
            expect(syntheticAccount).to.have.property('uid').that.equals(testSyntheticAccountTypeUid);
        });
    });
});