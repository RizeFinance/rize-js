# Rize Node.js SDK

## Getting Started
1. [Log in to GitHub Package Registry](#logging-in-to-the-github-package-registry)
2. Install the `@rizefinance/rize-js` package 
    ```sh
    npm install @rizefinance/rize-js
    ```

## Logging in to the GitHub Package Registry
1. Run `npm adduser --scope=@rizefinance --registry=https://npm.pkg.github.com`
2. Input your GitHub Username.
3. For the Password, input your [GitHub Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). Your token should have the following scopes/permissions: `repo`, `read:packages`
4. Input the email address that you're using in GitHub.

## Usage
```
const Rize = require('@rizefinance/rize-js');
const rize = new Rize('your_program_id', 'your_hmac_key');

rize.complianceWorkflow.create(
    'client-generated-42',
    'tomas@example.com',
)
    .then(workflow => console.log(workflow.uid))
    .catch(error => console.log(error));
```
Or with ES modules and `async/await`:
```
import Rize from '@rizefinance/rize-js';
const rize = new Rize('your_program_id', 'your_hmac_key');

(async () => {
    const workflow = await rize.complianceWorkflow.create(
        'client-generated-42',
        'tomas@example.com',
    );

    console.log(workflow.uid);
});
```
## Configuration
```
const rize = new Rize('your_program_id', 'your_hmac_key', {
    environment: 'sandbox',
    timeout: 50000,
});
```
| Option        | Description                                                                     | Default  |
| ------------- | --------------------------------------------------------------------------------| -------- |
| environment   | The Rize environment to be used: `'sandbox'`, `'integration'` or `'production'` | 'sandbox'|
| timeout       | The number of milliseconds before the each request times out                    | 80000    |

## API Docs
Go to https://developer.rizefs.com/

## Quick Steps for Customer Onboarding
### 1. Create a new Compliance Workflow.
Compliance Workflows is the first endpoint you will use to onboard a new Customer.
Your first request to create a compliance workflow creates a Customer on the Rize Program.
The Customer UID returned in the response is how Rize identifies this customer on your Rize Program.

To create a new Compliance Workflow ([more info](docs.md#create)):
```
const complianceWorkflow = await rize.complianceWorkflow.create(
    'client-generated-external-uid-42',
    'tomas@example.com'
);

console.log(complianceWorkflow.uid); // Workflow UID
console.log(complianceWorkflow.customer.uid); // Customer UID
```
Your request to the Compliance workflows endpoint initiates a Compliance Workflow for the
Customer you are onboarding. The Compliance Workflow contains all of the disclosure and
compliance documents that your Customer must acknowledge before they can open a Custodial
Account. (see [ComplianceWorkflow](docs.md#complianceworkflow))

### 2. Display Compliance Documents
Disclosure and compliance documents are defined by the Custodian(s) participating in your
Program. The disclosure documents and acknowledgments keep your Program and the
Custodian(s) operating in a manner compliant with the Custodian’s regulations.

Rize stores all acknowledgements, documents, document versions, and timestamps to assist
Custodians with regulatory inquiries. These records are available to you and your customers
through the Compliance Workflows endpoint.

To view the latest compliance workflow of a customer ([more info](docs.md#viewlatest)):
```
const latestWorkflow = await rize.complianceWorkflow.viewLatest(customerUid);
console.log(latestWorkflow.all_documents);
```
Your application can display or allow users to download the compliance document using the 
`"compliance_document_url"` value returned with each document in the Compliance Workflows 
endpoint response. (see [ComplianceDocument](docs.md#compliancedocument))

### 3. Acknowledge the Compliance Documents
Rize supplies Compliance Documents in Steps. All documents in a Step must be acknowledged
before the documents in the subsequent Step will be supplied. The documents that are awaiting
acknowledgement in the current Step are available in the `current_step_documents_pending` array.
Once Rize receives the acknowledgements for all documents in the current Step, the documents in 
the next Step will be supplied.

Acknowledgment requirements differ depending on the document content. If a document
requires an electronic signature, additional fields must be supplied in the acknowledgment.
Your application can discern which documents require an electronic signature through
`"electronic_signature_required"` value returned with each document in the
Compliance Workflows endpoint response.

To acknowledge a compliance document ([more info](docs.md#acknowledgecompliancedocuments)):
```
const updatedWorkflow = await rize.complianceWorkflow.acknowledgeComplianceDocuments(
    complianceWorkflowUid,
    customerUid,
    [{
        document_uid: 'Yqyjk5b2xgQ9FrxS',
        accept: 'yes',
        user_name: 'Olive Oyl',
        ip_address: '152.32.111.61'
    }]
);
```
### 4. Submit Customer Personally Identifiable Information (PII)
After a Customer starts a Compliance Workflow, Rize expects you to submit their remaining PII.

To submit the customer's PII ([more info](docs.md#update)):
```
const updatedCustomer = await rize.customer.update(
    customerUid,
    customerEmail,
    {
        first_name: 'Olive',
        middle_name: 'Olivia',
        last_name: 'Oyl',
        suffix: 'Jr.',
        phone: '5555551212',
        ssn: '111-22-3333',
        dob: '1919-12-08',
        address: {
            street1: '123 Abc St.',
            street2: 'Apt 2',
            city: 'Chicago',
            state: 'IL',
            postal_code: '12345',
        }
    }
);
```

### 5. Request Identity Verification
The Identity Verification of a customer serves as explicit confirmation from you that the
Customer is ready for account opening. This event initiates the KYC/AML verification process
and account opening at the Custodian(s) in your Program. This is a billable event and is isolated
intentionally for you to confirm that the Customer record is complete. ([more info](docs.md#verifyidentity))

To request for identity verification:
```
const updatedCustomer = await rize.customer.verifyIdentity(customerUid);
```

## Sandbox Onboarding Evaluations
Once Rize receives complete PII, complete compliance document acknowledgments, and the
Identity Verification request within the duration requirements, your Customer record will
automatically be sent to Rize’s identity verification partner.

Because your Customers have assets held by financial institutions, Customers must undergo a
KYC/AML evaluation before they can onboard to the Rize Platform.

In the Rize Sandbox, you can generate and test your receipt of the customer evaluation
statuses using the last names supplied with the Customer record. The statuses in the Rize
Sandbox and the last names that trigger these statuses are listed below.

| Customer Last Name                     | Customer KYC_Status Returned   | Description  |
| -------------------------------------- | -------------------------------| ------------ |
| Any value, excluding Smith and Johnson | Approved                       | Approved status indicates that the Custodian will allow the Customer to access their Service Offering immediately. The Customer has completed onboarding to the Program. No documentation is required. |
| Johnson                                | Denied                         | The Customer is denied access to the Custodian’s products. No recourse is available through the Custodian or Rize.    |
| Smith                                  | Manual Review                  | The Custodian is unable to onboard the Customer through an automated process and additional information is required.

## SDK Reference
For a more detailed documentation of the SDK, see [docs.md](docs.md).
