<p align="center">
  <a href="https://rizefs.com" target="_blank" align="center">
    <img src="https://rizefs.com/wp-content/uploads/2021/01/rizelogo-grey.svg" width="200">
  </a>
  <br />
</p>



*Make financial services simple and accessible. Rize enables fintechs, financial institutions and brands to build across multiple account types with one API.* *If you want to join us [<kbd>**Check out our open positions**</kbd>](https://rizefs.com/careers/).*



# Official Rize SDKs for JavaScript ![](https://img.shields.io/badge/SDK-CommonJS-blue)![](https://img.shields.io/badge/Version-1.0.0-green)

## Changelogs

Checkout the changelogs per release [here](https://github.com/RizeFinance/rize-sdks/releases)!



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
   
To confirm you should see the following lines when you run `npm config list`

```
@rizefinance:registry = "https://npm.pkg.github.com"
//npm.pkg.github.com/:_authToken = (protected)
```
   


## Usage

```js
const Rize = require('@rizefinance/rize-js');
const rize = new Rize('your_program_id', 'your_hmac_key');

rize.complianceWorkflow.create(
    'customer-rize-uid-123',
    'product-compliance-plan-92',
)
    .then(workflow => console.log(workflow.uid))
    .catch(error => console.log(error));
```

Or with ES modules and `async/await`:

```js
import Rize from '@rizefinance/rize-js';
const rize = new Rize('your_program_id', 'your_hmac_key');

(async () => {
    const workflow = await rize.complianceWorkflow.create(
        'customer-rize-uid-123',
        'product-compliance-plan-92',
    );

    console.log(workflow.uid);
});
```



## Configuration

```js
const rize = new Rize('your_program_id', 'your_hmac_key', {
    environment: 'sandbox',
    timeout: 50000,
});
```

| Option      | Description                                                  | Default   |
| ----------- | ------------------------------------------------------------ | --------- |
| environment | The Rize environment to be used: `'sandbox'`, `'integration'` or `'production'` | 'sandbox' |
| timeout     | The number of milliseconds before each request times out     | 80000     |



## API Docs

Go to https://developer.rizefs.com/



## Quick Steps for Customer Onboarding

### 1. Create a new Customer.

Create Customer is the first endpoint to start the onboard flow.
Your first request to create a customer with a external id, user's email and a customer type, after a new customer object is returned with a uid.

To create a new Customer ([more info](docs.md#create)):

```js
const newCustomer = await rize.customer.create(
    'client-generated-external-uid-42',
    'tomas@example.com'
    'primary'
);

console.log(newCustomer.uid); // Customer UID
```



### 2. Get Avaliable Products

Next, we need to retrieve a list of products available for your program and all requirements for the new customer to complete.
We will use the product requirements to have the customer answer all required questions later in the process.

To get a list of Products ([more info](docs.md#product)):

```js
const productList = await rize.product.getList();

console.log(productList.data[0].uid); // First product UID
```



### 3. Create a new Compliance Workflow.

Creating a compliance workflow requires the new customer UID and the product compliance plan UID from the last two steps.

To create a new Compliance Workflow ([more info](docs.md#create)):

```js
const complianceWorkflow = await rize.complianceWorkflow.create(
    'customer-rize-uid-123',
    'product-compliance-plan-92'
);

console.log(complianceWorkflow.uid); // Workflow UID
```

Sending a request to the Compliance workflow's endpoint initiates a Compliance Workflow for the onboarding customer. The Compliance Workflow contains disclosure and compliance documents that the Customer must acknowledge before opening a Custodial Account. (see [ComplianceWorkflow](docs.md#complianceworkflow))



### 4. Display Compliance Documents

Disclosure and compliance documents are defined by the Custodian(s) participating in your
Program. The disclosure documents and acknowledgments keep your Program and the
Custodian(s) operating in a manner compliant with the Custodian’s regulations.

Rize stores all acknowledgements, documents, document versions, and timestamps to assist
Custodians with regulatory inquiries. These records are available to you and your customers
through the Compliance Workflows endpoint.

To view the latest compliance workflow of a customer ([more info](docs.md#viewlatest)):

```js
const latestWorkflow = await rize.complianceWorkflow.viewLatest(customerUid);
console.log(latestWorkflow.all_documents);
```

Your application can display or allow users to download the compliance document using the 
`"compliance_document_url"` value returned with each document in the Compliance Workflows 
endpoint response. (see [ComplianceDocument](docs.md#compliancedocument))



### 5. Acknowledge the Compliance Documents

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

```js
const updatedWorkflow = await rize.complianceWorkflow.acknowledgeComplianceDocuments(
    '23fdeasfds3qwdfw', // complianceWorkflowUid,
    'h9MzupcjtA3LPW2e', // customerUid
    [{
        document_uid: 'Yqyjk5b2xgQ9FrxS',
        accept: 'yes',
        user_name: 'Olive Oyl',
        ip_address: '152.32.111.61'
    },
    {
        document_uid: 'fdewedf34323e32e',
        accept: 'yes',
        user_name: 'Olive Oyl',
        ip_address: '152.32.111.61'
    }]
);
```



### 6. Submit Customer Personally Identifiable Information (PII)

After a Customer starts a Compliance Workflow, Rize expects you to submit their remaining PII.

To submit the customer's PII ([more info](docs.md#update)):

```js
const updatedCustomer = await rize.customer.update(
    'h9MzupcjtA3LPW2e', // customerUid
    'test@test.com', // customerEmail
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



### 7. Answer Profile Answers for the Plan Requirements (if needed)

Each plan may come with questions that are required to complete the onboarding flow for the new customer. ([more info](docs.md#customer))

To update profile answers:

```js
const updatedCustomerResponse = await rize.customer.updateProfileAnswers(
    'h9MzupcjtA3LPW2e', // customerUid
    {
        profile_requirement_uid: 'Yqyjk5b2xgQ9FrxS',
        profile_response: 'yes',
  }
);
```



### 8. Create new Customer Product

The last step will trigger verification that all Product requirements have been met. After completion, Rize will automatically kick off the KYC process if it is the customer's first product. Upon successful creation, all required custodial accounts will be created, and the customer will be active. This is a billable event and is intentionally isolated for you to confirm that the Customer record is complete.  ([more info](docs.md#customer))

To request for identity verification:

```js
const customerProduct = await rize.customerProduct.create(
    'h9MzupcjtA3LPW2e', // customerUid
    'fdsazupcjtdsaw3', // productUid
);
```



## Sandbox Onboarding Evaluations

Once Rize receives complete PII, complete compliance document acknowledgments, and the
new customer product request within the duration requirements, your Customer record will
automatically be sent to Rize’s identity verification partner.

Because your Customers have assets held by financial institutions, Customers must undergo a
KYC/AML evaluation before they can onboard to the Rize Platform.

In the Rize Sandbox, you can generate and test your receipt of the customer evaluation
statuses using the last names supplied with the Customer record. The statuses in the Rize
Sandbox and the last names that trigger these statuses are listed below.

| Customer Last Name                     | Customer KYC_Status Returned | Description                                                  |
| -------------------------------------- | ---------------------------- | ------------------------------------------------------------ |
| Any value, excluding Smith and Johnson | Approved                     | Approved status indicates that the Custodian will allow the Customer to access their Service Offering immediately. The Customer has completed onboarding to the Program. No documentation is required. |
| Johnson                                | Denied                       | The Customer is denied access to the Custodian’s products. No recourse is available through the Custodian or Rize. |
| Smith                                  | Manual Review                | The Custodian is unable to onboard the Customer through an automated process, and additional information is required. |



## SDK Reference

For a more detailed documentation of the SDK, see [docs.md](docs.md).



## Message Queue

The SDK also provides a facility to utilize the Rize Message Queue.

```js
const rmqClient = rizeProvider.rmq.connect(
    'your_rmq_hosts',
    'your_rmq_clientId',
    'your_rmq_topic',
    'your_rmq_username',
    'your_rmq_password'
);

rmqClient.on('connecting', function (connector) {
    const address = connector.serverProperties.remoteAddress.transportPath;

    console.log('Connecting to ' + address);
});

rmqClient.on('connect', function (connector) {
    const address = connector.serverProperties.remoteAddress.transportPath;

    console.log('Connected to ' + address);
});

rmqClient.on('error', function (error) {
    const connectArgs = error.connectArgs;
    const address = connectArgs.host + ':' + connectArgs.port;

    console.log('Connection error to ' + address + ': ' + error.message);
});
```

After initializing a client. You may then subscribe to different Rize topics.

```js
rmqClient.subscribeToRizeTopic(
    'your_topic_here',
    'your_topic_subscription',
    listener,
    'client-individual'
)

const listener = (err, msg, ack, nack) => {
    if (!err) {
        try {
            msg.readString('UTF-8', (err, body) => {
                if (!err) {
                    const message = JSON.parse(body);

                    if (!message) {
                        nack();
                        return;
                    }

                    console.log(message);
                    ack();
                } else {
                    console.log(err);
                    nack();
                }
            });
        } catch (e) {
            console.log(e);
            nack();
        }
    } else {
        console.log(err);
        nack();
    }
};
```
