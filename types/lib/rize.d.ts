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
     * @type {TransactionService}
     */
    transaction: TransactionService;
    /**
     * A Transfer is the action of moving assets between any two Synthetic Accounts. The majority of asset movement
     * initiated by your application will result in a Transfer. Asset movement is determined by the makeup of assets
     * in both participating accounts, the Synthetic Account Type of each account, the available Custodial Accounts
     * for all participating Customers, as well as the overall Program configuration. A Transfer can never be initiated
     * between two external accounts.
     *
     * Transfers can be initiated between most combinations of Synthetic Account Types. Due to the time required to
     * complete ACH transfers or trades of assets in underlying Custodial Accounts, it is possible for a Transfer to
     * take up to 6 business days to settle in the most extreme cases (such as starting with a stock sale and completing
     * in a checking account deposit at a different financial institution).
     * @type {TransferService}
     */
    transfer: TransferService;
    /**
     * Debit Cards allow a Customer direct access to their funds via Point of Sale and ATM transactions. Each Debit Card is tied
     * to a single Custodial Account and a single Synthetic Account which determines where transactions associated with the Debit
     * Card will be settled.
     *
     * This endpoint supports debit card management, such as requesting a card, activating a card, reporting a card lost or stolen,
     * and locking and unlocking a debit card. The Custodian participating in your Program will define some characteristics of the
     * card (maximum transaction limits, international usage, etc.) and these will be configured and communicated to you as part of
     * the Program configuration.
     *
     * Certain information about a Debit Card (such as the PAN, PIN, and CVV) are considered highly sensitive and are subject to
     * strict PCI compliance requirements. As such, the process for issuing and verifying a card is a multi-step process that can
     * only be completed by the Customer. At no time will the PCI restricted data be made available to either you or Rize. The last
     * 4 digits of the Debit Card PAN and/or a unique card nickname can be used to identify the card to the Customer.
     */
    debitCard: DebitCardService;
    /**
     * All Customers will be able to access their monthly account statements and their yearly tax documents as they become available
     * at the end of the respective periods. The document resource returned in `GET /documents` and `GET /documents/:uid` will describe
     * the metadata of the document, such as its document type and the document period. `GET /documents/:uid/view` can be used to
     * receive the document in PDF by default. The document can also be returned in JSON or HTML format using `GET /documents/:uid/view.json`
     * or `GET /documents/:uid/view.html`, respectively.
     *
     * The document type specifies whether the document is a statement or tax document.
     * Please note that only the settled transactions will appear in the statement i.e. if a transaction is initiated before a settlement
     * period ends and settles after the new period starts, it will appear in the statement for the latter period.
     * @type {DocumentService}
     */
    document: DocumentService;
}
declare namespace Rize {
    export { PACKAGE_VERSION, Rize, Rize as default };
}
import ComplianceWorkflowService = require("./core/compliance-workflow");
import CustomerService = require("./core/customer");
import SyntheticAccountService = require("./core/synthetic-account");
import CustodialAccountService = require("./core/custodial-account");
import TransactionService = require("./core/transaction");
import TransferService = require("./core/transfer");
import DebitCardService = require("./core/debit-card");
import DocumentService = require("./core/document");
declare var PACKAGE_VERSION: string;
