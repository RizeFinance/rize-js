export = Rize;
/**
 * Represents a Rize API client.
 */
declare class Rize {
    /**
     * Returns a Rize API client.
     * @constructor
     * @param {string} programUid - The Rize Program ID.
     * @param {string} hmac - The HMAC that will be used to sign the JSON web signature in order to get access to the API.
     * @param {RizeOptions} [options] - Configuration options
     */
    constructor(programUid: string, hmac: string, { environment, timeout, }?: any);
    /**
     * The Compliance Workflow is where you begin onboarding Customers to your Program.
     * Compliance Workflows are used to group all of the required Compliance Documents together and to ensure they are presented and acknowledged in the correct order.
     * @type {ComplianceWorkflowService}
     */
    complianceWorkflow: ComplianceWorkflowService;
    /**
     * A Customer on the Rize Platform is the end user of your application.
     * Customers are unique to each Program and the management of all accounts and identifying information is handled on a Program-by-Program basis.
     * @type {CustomerService}
     */
    customer: CustomerService;
    /**
     * Synthetic Accounts are what your application will build around and your Customers will interact with.
     * Synthetic Accounts are designed to track any asset types, for any Customers, at any Custodian.
     * @type {SyntheticAccountService}
     */
    syntheticAccount: SyntheticAccountService;
    /**
     * Custodial Account is the account held by the Custodian participating in your Program. Custodial Accounts in a Program can only be created for the Service Offerings that have been configured for that Program.
     * A Customer must successfully complete onboarding and pass all KYC/AML checks before their Custodial Accounts can be opened.
     * @type {CustodialAccountService}
     */
    custodialAccount: CustodialAccountService;
    /**
     * Transactions are created based on how you instruct Rize to move assets (a Transfer) or how assets are
     * moved or spent outside of your application (ATM withdrawals, debit card purchase, wire transfers, etc…).
     * The Transaction contains the amount, origin, and destination of assets. Rize categorizes Transactions
     * into types to assist in their classification and representation.
     *
     * Transactions fall into many categories, including debit card purchases, direct deposits, interest, and
     * fees. This endpoint can be used to retrieve a list of Transactions or track the status of an ongoing Transaction.
     *
     * Transaction Events are created as a result of a Transaction. They capture the steps required to complete the Transaction.
     * These can be used to view the progress of an in-flight Transaction or see the history of a completed Transaction.
     *
     * Line Items are created for each Transaction Event.
     * They catalogue the individual credits and debits associated with the accounts involved in the Transaction.
     */
    transaction: TransactionService;
}
declare namespace Rize {
    export { PACKAGE_VERSION, Rize, Rize as default };
}
import ComplianceWorkflowService = require("./core/compliance-workflow");
import CustomerService = require("./core/customer");
import SyntheticAccountService = require("./core/synthetic-account");
import CustodialAccountService = require("./core/custodial-account");
import TransactionService = require("./core/transaction");
declare var PACKAGE_VERSION: string;
