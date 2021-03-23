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

describe('Evaluation', () => {
    let testEvaluation;

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.evaluation.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be an EvaluationListQuery object.');
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.evaluation.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array.');
        });

        it('Throws an error if "latest" query is not a boolean', () => {
            const query = { latest: 'test' };
            const promise = rizeClient.evaluation.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"latest" query must be a boolean.');
        });

        it('Retrieves the evaluation list without query', async () => {
            const evaluationList = await rizeClient.evaluation.getList();
            testEvaluation = evaluationList.data[0];
            utils.expectRizeList(evaluationList);
        });

        it('Retrieves the evaluation list with query', async () => {
            const query = {
                customer_uid: ['customer_uid1', 'customer_uid2'],
                latest: true
            };
            const evaluationList = await rizeClient.evaluation.getList(query);
            utils.expectRizeList(evaluationList);
        }).timeout(5000);
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.evaluation.get('');
            return expect(promise).to.eventually.be.rejectedWith('Evaluation "uid" is required.');
        });

        it('Retrieves evaluation data successfully', async () => {
            const evaluation = await rizeClient.evaluation.get(testEvaluation.uid);
            expect(evaluation).to.have.property('uid').that.equals(testEvaluation.uid);
        });
    });
});