'use strict';

require('./customer.create.spec');
require('./product.spec');

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const mlog = require('mocha-logger');
const { faker } = require('@faker-js/faker');

const rizeClient = require('../helpers/rizeClient');

describe('Compliance Workflow', () => {
    const fakeName = faker.name.findName();
    const fakeIp = faker.internet.ip();

    /** @type {import('../../lib/core/typedefs/compliance-workflow.typedefs').ComplianceWorkflow} */
    let workflow;

    let customerUid;
    let productCompliancePlanUid;

    before(() => {
        customerUid = process.env.TEST_CUSTOMER_UID;
        productCompliancePlanUid = process.env.TEST_PRODUCT_COMPLIANCE_PLAN_UID;
    });

    const verifyComplianceWorkflow = (workflow, customerUid) => {
        expect(workflow).to.have.property('uid').that.is.not.empty;
        expect(workflow).to.have.nested.property('customer.uid').that.equals(customerUid);
        expect(workflow).to.have.nested.property('customer.email').that.is.not.empty;
        expect(workflow).to.have.property('accepted_documents').to.be.an('array');
        expect(workflow).to.have.property('current_step_documents_pending').to.be.an('array');
        expect(workflow).to.have.property('all_documents').to.be.an('array');
    };

    describe('create', () => {
        it('Throws an error if "customerUid" is empty', () => {
            const promise = rizeClient.complianceWorkflow.create(' ', '');
            return expect(promise).to.eventually.be.rejectedWith('"customerUid" is required.');
        });

        it('Throws an error if "productCompliancePlanUid" is empty', () => {
            const promise = rizeClient.complianceWorkflow.create('test', '');
            return expect(promise).to.eventually.be.rejectedWith('"productCompliancePlanUid" is required.');
        });

        it('Creates a new compliance workflow', async () => {
            const newWorkflow = await rizeClient.complianceWorkflow.create(customerUid, productCompliancePlanUid);
            verifyComplianceWorkflow(newWorkflow, customerUid);

            mlog.log(`Compliance Workflow UID: ${newWorkflow.uid}`);

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

            verifyComplianceWorkflow(latestWorkflow, customerUid);
            expect(latestWorkflow.uid).to.be.equal(workflow.uid);
        });
    });

    describe('getList', () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.complianceWorkflow.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a ComplianceWorkflowListQuery object.');
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const promise = rizeClient.complianceWorkflow.getList({ customer_uid: customerUid});
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array.');
        });

        it('Throws an error if "product_uid" query is not an array', () => {
            const promise = rizeClient.complianceWorkflow.getList({ product_uid: 'product_uid_123'});
            return expect(promise).to.eventually.be.rejectedWith('"product_uid" query must be an array.');
        });

        it('Throws an error if "in_progress" query is not boolean', () => {
            const query = { in_progress: 'true' };
            const promise = rizeClient.complianceWorkflow.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"in_progress" query must be a boolean.');
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.complianceWorkflow.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"limit" query must be an integer.');
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.complianceWorkflow.getList(query);
            return expect(promise).to.eventually.be.rejectedWith('"offset" query must be an integer.');
        });

        it('Retrieves the latest compliance workflow', async () => {
            const allCustomerWorkflows = await rizeClient.complianceWorkflow.getList({ customer_uid: [customerUid] });

            verifyComplianceWorkflow(allCustomerWorkflows.data[0], customerUid);
            utils.expectRizeList(allCustomerWorkflows);
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

        it('Acknowledges multiple compliance documents', async function() {
            if (workflow.current_step_documents_pending.length < 2) {
                this.skip();
            }
            const pendingDocIds = workflow.current_step_documents_pending.slice(0, 2).map(doc => doc.uid);
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

        it('Acknowledges a single compliance document', async function () {
            if (workflow.current_step_documents_pending.length === 0) {
                this.skip();
            }
            let document = workflow.current_step_documents_pending[0];
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
            while(workflow.current_step_documents_pending.length > 0) { //finish any remaining documents to get workflow to accepted
                document = workflow.current_step_documents_pending[0];
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
            }
            const acceptedDocumentUids = workflow.accepted_documents.map(x => x.uid);
            expect(acceptedDocumentUids).to.include.members([document.uid]);
        });
    });
});
