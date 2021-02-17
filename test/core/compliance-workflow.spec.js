'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const uuid = require('uuid').v4;
const faker = require('faker');

chai.use(chaiAsPromised);

const expect = chai.expect;

const Rize = require('../../index');
const rizeClient = new Rize(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC
);

describe('Compliance Workflow', () => {
    // let workflowUid;
    // let customerUid;
    // let customerEmailAddress;
    describe('create', () => {
        it ('Throws an error if customerExternalUid is empty', () => {
            const promise = rizeClient.complianceWorkflow.create(' ', '');
            return expect(promise).to.eventually.be.rejectedWith('customerExternalUid is required.');
        });

        it ('Throws an error if email is invalid', () => {
            const promise = rizeClient.complianceWorkflow.create('test', '');
            return expect(promise).to.eventually.be.rejectedWith('email is invalid.');
        });

        it ('Creates a new compliance workflow', async () => {
            const externalUid = uuid();
            const fakeEmail = faker.internet.email(undefined, undefined, 'rizetest.com');

            const workflow = await rizeClient.complianceWorkflow.create(externalUid, fakeEmail);

            expect(workflow).to.have.property('uid').that.is.not.empty;
            expect(workflow).to.have.nested.property('customer.uid').that.is.not.empty;
            expect(workflow).to.have.nested.property('customer.email').that.equals(fakeEmail);

            // Store the workflowUid and customerUid for next tests
            // workflowUid = workflow.uid;
            // customerUid = workflow.customer.uid;
            // customerEmailAddress = customer.email;
        });
    });
});