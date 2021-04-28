'use strict';

require('./auth.spec');

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
    const fakeName = faker.name.findName();
    const fakeIp = faker.internet.ip();

    /** @type {import('../../lib/core/typedefs/compliance-workflow.typedefs').ComplianceWorkflow} */
    let workflow;

    const verifyComplianceWorkflow = (workflow, email) => {
        expect(workflow).to.have.property('uid').that.is.not.empty;
        expect(workflow).to.have.nested.property('customer.uid').that.is.not.empty;
        expect(workflow).to.have.nested.property('customer.email').that.equals(email);
        expect(workflow).to.have.property('accepted_documents').to.be.an('array');
        expect(workflow).to.have.property('current_step_documents_pending').to.be.an('array');
        expect(workflow).to.have.property('all_documents').to.be.an('array');
    };

    describe('create', () => {
        it('Throws an error if "customerExternalUid" is empty', () => {
            const promise = rizeClient.complianceWorkflow.create(' ', '');
            return expect(promise).to.eventually.be.rejectedWith('"customerExternalUid" is required.');
        });

        it('Throws an error if "email" is invalid', () => {
            const promise = rizeClient.complianceWorkflow.create('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"email" is invalid.');
        });

        it('Creates a new compliance workflow', async () => {
            const externalUid = uuid();
            const fakeEmail = faker.internet.email(undefined, undefined, 'rizetest.com');

            const newWorkflow = await rizeClient.complianceWorkflow.create(externalUid, fakeEmail);

            verifyComplianceWorkflow(newWorkflow, fakeEmail);

            mlog.log(`Compliance Workflow UID: ${newWorkflow.uid}`);
            mlog.log(`New Customer UID: ${newWorkflow.customer.uid}`);

            // Store the workflow for next tests
            workflow = newWorkflow;
        });
    });

    describe('viewLatest', () => {
        it('Throws an error if "customerUid" is empty', () => {
            const promise = rizeClient.complianceWorkflow.viewLatest(' ');
            return expect(promise).to.eventually.be.rejectedWith('"customerUid" is required.');
        });

        it('Retrieves the latest compliance workflow', async () => {
            const latestWorkflow = await rizeClient.complianceWorkflow.viewLatest(workflow.customer.uid);

            verifyComplianceWorkflow(latestWorkflow, workflow.customer.email);
            expect(latestWorkflow.uid).to.be.equal(workflow.uid);
        });
    });

    describe('acknowledgeComplianceDocument', () => {
        it('Throws an error if "complianceWorkflowUid" is empty', () => {
            const promise = rizeClient.complianceWorkflow.acknowledgeComplianceDocuments(' ', '');
            return expect(promise).to.eventually.be.rejectedWith('"complianceWorkflowUid" is required.');
        });

        it('Throws an error if "customerUid" is empty', () => {
            const promise = rizeClient.complianceWorkflow.acknowledgeComplianceDocuments('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"customerUid" is required.');
        });

        it('Throws an error if there are no documents supplied', () => {
            const promise = rizeClient.complianceWorkflow.acknowledgeComplianceDocuments('test', 'test');
            return expect(promise).to.eventually.be.rejectedWith('Please submit at least one document.');
        });

        it('Throws an error if "document_uid" is empty', () => {
            const promise = rizeClient.complianceWorkflow.acknowledgeComplianceDocuments('test', 'test', { document_uid: '' });
            return expect(promise).to.eventually.be.rejectedWith('"document_uid" is required.');
        });

        it('Throws an error if "accept" is invalid', () => {
            const promise = rizeClient.complianceWorkflow.acknowledgeComplianceDocuments('test', 'test', { document_uid: 'test' });
            return expect(promise).to.eventually.be.rejectedWith('The value for "accept" is should be either "yes" or "no".');
        });

        it('Throws an error if electronic signing is required and "user_name" is not supplied', function () {
            const eSignRequiredDoc = workflow
                .current_step_documents_pending
                .find(x => x.electronic_signature_required === 'yes');

            if (!eSignRequiredDoc) {
                // Skip this test if we couldn't find a document that requires electronic signing
                this.skip();
            }

            const promise = rizeClient.complianceWorkflow.acknowledgeComplianceDocuments(
                workflow.uid,
                workflow.customer.uid,
                {
                    document_uid: eSignRequiredDoc.uid,
                    accept: 'yes',
                    user_name: undefined,
                    ip_address: fakeIp
                }
            );

            return expect(promise).to.eventually.be.rejectedWith();
        });

        it('Throws an error if electronic signing is required and "ip_address" is not supplied', function () {
            const eSignRequiredDoc = workflow
                .current_step_documents_pending
                .find(x => x.electronic_signature_required === 'yes');

            if (!eSignRequiredDoc) {
                // Skip this test if we couldn't find a document that requires electronic signing
                this.skip();
            }

            const promise = rizeClient.complianceWorkflow.acknowledgeComplianceDocuments(
                workflow.uid,
                workflow.customer.uid,
                {
                    document_uid: eSignRequiredDoc.uid,
                    accept: 'yes',
                    user_name: fakeName,
                    ip_address: ''
                }
            );

            return expect(promise).to.eventually.be.rejectedWith();
        });

        it('Acknowledges a single compliance document', async function () {
            if (workflow.current_step_documents_pending.length === 0) {
                this.skip();
            }

            const document = workflow.current_step_documents_pending[0];

            workflow = await rizeClient.complianceWorkflow.acknowledgeComplianceDocuments(
                workflow.uid,
                workflow.customer.uid,
                {
                    document_uid: document.uid,
                    accept: 'yes',
                    user_name: fakeName,
                    ip_address: fakeIp
                }
            );

            const acceptedDocumentUids = workflow.accepted_documents.map(x => x.uid);
            expect(acceptedDocumentUids).to.include.members([document.uid]);
        });

        it('Acknowledges a multiple compliance documents', async function () {
            if (workflow.current_step_documents_pending.length < 2) {
                this.skip();
            }

            const pendingDocIds = workflow.current_step_documents_pending.map(doc => doc.uid);

            workflow = await rizeClient.complianceWorkflow.acknowledgeComplianceDocuments(
                workflow.uid,
                workflow.customer.uid,
                pendingDocIds.map(uid => ({
                    document_uid: uid,
                    accept: 'yes',
                    user_name: fakeName,
                    ip_address: fakeIp
                }))
            );

            const acceptedDocumentUids = workflow.accepted_documents.map(x => x.uid);
            expect(acceptedDocumentUids).to.include.members(pendingDocIds);
        });
    });

    describe('renew', () => {
        it('Throws an error if customerExternalUid is empty', () => {
            const promise = rizeClient.complianceWorkflow.renew(' ', '', '');
            return expect(promise).to.eventually.be.rejectedWith('"customerExternalUid" is required.');
        });

        it('Throws an error if customerUid is empty', () => {
            const promise = rizeClient.complianceWorkflow.renew('test', ' ', '');
            return expect(promise).to.eventually.be.rejectedWith('"customerUid" is required.');
        });

        it('Throws an error if email is invalid', () => {
            const promise = rizeClient.complianceWorkflow.renew('test', 'test', ' ');
            return expect(promise).to.eventually.be.rejectedWith('"email" is invalid.');
        });

        it('Renew compliance worflow after latest expired', async function () {
            const customerUidToTest = '5HPYLUeaHPmy3jHT';
            const latestWorkflow = await rizeClient.complianceWorkflow.viewLatest(customerUidToTest);
            if (latestWorkflow.summary.status !== 'expired') {
                // Skip test if the customer's latest workflow is not yet expired
                this.skip();
            } else {
                const newWorkflow = await rizeClient.complianceWorkflow.renew(
                    latestWorkflow.customer.external_uid,
                    latestWorkflow.customer.uid,
                    latestWorkflow.customer.email);

                verifyComplianceWorkflow(newWorkflow, latestWorkflow.customer.email);
                expect(newWorkflow.summary.status === 'in_progress');
            }
        });
    });
    
    after(() => {
        process.env.TEST_CUSTOMER_UID = workflow.customer.uid;
    });
});