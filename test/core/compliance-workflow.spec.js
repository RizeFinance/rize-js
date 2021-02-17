'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const uuid = require('uuid').v4;
const faker = require('faker');

const mlog = require('mocha-logger');

const Rize = require('../../index');
const rizeClient = new Rize(
    process.env.RIZE_PROGRAM_ID,
    process.env.RIZE_HMAC
);

describe('Compliance Workflow', () => {
    let customerUid;
    let customerEmailAddress;
    let workflowUid;

    const verifyComplianceWorkflowEntity = (workflow, email) => {
        expect(workflow).to.have.property('uid').that.is.not.empty;
        expect(workflow).to.have.nested.property('customer.uid').that.is.not.empty;
        expect(workflow).to.have.nested.property('customer.email').that.equals(email);
        expect(workflow).to.have.property('accepted_documents').to.be.an('array');
        expect(workflow).to.have.property('current_step_documents_pending').to.be.an('array');
        expect(workflow).to.have.property('all_documents').to.be.an('array');
    };

    describe('create', () => {
        it('Throws an error if customerExternalUid is empty', () => {
            const promise = rizeClient.complianceWorkflow.create(' ', '');
            return expect(promise).to.eventually.be.rejectedWith('customerExternalUid is required.');
        });

        it('Throws an error if email is invalid', () => {
            const promise = rizeClient.complianceWorkflow.create('test', '');
            return expect(promise).to.eventually.be.rejectedWith('email is invalid.');
        });

        it('Creates a new compliance workflow', async () => {
            const externalUid = uuid();
            const fakeEmail = faker.internet.email(undefined, undefined, 'rizetest.com');
            const workflow = await rizeClient.complianceWorkflow.create(externalUid, fakeEmail);

            verifyComplianceWorkflowEntity(workflow, fakeEmail);

            // Store the workflowUid and customerUid for next tests
            mlog.log(`Compliance Workflow UID: ${workflow.uid}`);
            mlog.log(`New Customer UID: ${workflow.customer.uid}`);
            customerUid = workflow.customer.uid;
            customerEmailAddress = workflow.customer.email;
            workflowUid = workflow.uid;
        });
    });

    describe('view latest workflow', () => {
        it('Throws an error if customerUid is empty', () => {
            const promise = rizeClient.complianceWorkflow.viewLatest(' ');
            return expect(promise).to.eventually.be.rejectedWith('customerUid is required.');
        });

        it('Retrieves the latest compliance workflow', async () => {
            const latestWorkflow = await rizeClient.complianceWorkflow.viewLatest(customerUid);

            mlog.log(`Latest Compliance Workflow UID: ${latestWorkflow.uid}`);
            verifyComplianceWorkflowEntity(latestWorkflow, customerEmailAddress);
            expect(latestWorkflow.uid).to.be.equal(workflowUid);
        });
    });
});