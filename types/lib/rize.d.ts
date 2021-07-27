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
    constructor(programUid: string, hmac: string, options?: RizeOptions);
    /** @ignore @protected */
    protected _getEnvironment: () => string;
    /**
     * The Compliance Workflow is where you begin onboarding Customers to your Program.
     * Compliance Workflows are used to group all of the required Compliance Documents together and to ensure they are presented and acknowledged in the correct order.
     * @type {ComplianceWorkflowService}
     */
    complianceWorkflow: ComplianceWorkflowService;
    /**
     * Customer Product records are generated when a Customer is submitted for onboarding to a specific Product.
     *
     * Clients will POST when a Customer has fulfilled the prerequisite Product requirements.
     * Rize will then verify that the Product requirements have been met. If the Product requirements are met,
     * Rize will proceed with account opening and feature enablement as specified by the Product.
     *
     * If the Product requirements are not met, Rize will return an error response indicating what element of the Product validation failed.
     * @type {CustomerProductService}
     */
    customer: CustomerProductService;
    /**
     * A Customer on the Rize Platform is the end user of your application.
     * Customers are unique to each Program and the management of all accounts and identifying information is handled on a Program-by-Program basis.
     * @type {CustomerService}
     */
    customerProduct: CustomerService;
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
     * @type {DebitCardService}
     */
    debitCard: DebitCardService;
    /**
     * All Customers will be able to access their monthly account statements and their yearly tax documents as they become available
     * at the end of the respective periods. The document resource returned in `document.getList` and `document.get` will describe
     * the metadata of the document, such as its document type and the document period. `document.view` can be used to receive the document in PDF by default.
     * The document can also be returned in JSON or HTML format using `document.view(uid, 'html)` or `document.view(uid, 'json)`, respectively.
     *
     * The document type specifies whether the document is a statement or tax document.
     *
     * Please note that only the settled transactions will appear in the statement i.e. if a transaction is initiated before a settlement
     * period ends and settles after the new period starts, it will appear in the statement for the latter period.
     * @type {DocumentService}
     */
    document: DocumentService;
    /**
     * The KYC Documents endpoint enables Customers to upload identity verification documentation. These documents are only required
     * if Rize’s KYC/AML partner is unable to confirm the identity of the Customer with the information provided during onboarding.
     *
     * A KYC Document is a file that is uploaded which a reviewer can use to inform a decision as to whether this Customer should be approved
     * or denied for the Program. These files are generally utility bills or images of state issued driver’s licenses.
     * @type {KYCDocumentService}
     */
    kycDocument: KYCDocumentService;
    /**
     * An Evaluation is the result of submitting a customer's personal details to one of Rize's KYC partners. If Customer PII is updated,
     * another Evaluation is generated with its own unique Evaluation identifier.
     * @type {EvaluationService}
     */
    evaluation: EvaluationService;
    /**
     * A Pool is a construct Rize uses to associate multiple Customers to each other. A Pool is always associated with at least one Customer,
     * but all accounts are only ever associated with a single Pool. This enables asset sharing and distributed ownership of accounts across
     * multiple Customers.
     *
     * Rize currently supports single Customer Pools, where one Customer is associated to one Pool and vice versa. All accounts, transfers,
     * and transactions are associated with the Customer’s Pool, not the Customer. The Pool UID appears on several endpoint responses and may
     * be required by the API in some instances.
     *
     * Multi-Customer Pools is a beta product - contact us at hello@rizemoney.com for more information on how to build with joint accounts
     * involving multiple Customers and multiple Pools. A multi-Customer Pool represents a group of Customers within a Program that have
     * elected to share assets with each other. All assets within a Pool are shared by all members of the Pool, but the initial creator of
     * the Pool is designated as the owner of both the Pool itself and all Custodial Accounts that are created for the Pool.
     * @type {PoolService}
     */
    pool: PoolService;
    /**
     * Products contain the specific group of features, accounts, and requirements necessary to make a Product available to your Customers.
     * Use getList to view the Products available to your Program as well as the prerequisite information or actions that must be taken for a Customer to access the Product.
     * multiple Customers.
     *
     * @type {ProductService}
     */
    product: ProductService;
    /**
     * Helper tools to connect to Rize Message Queue and subscribe to durable topics
     * @type {RizeMessageQueue}
     */
    rmq: RizeMessageQueue;
    set environment(arg: string);
    get environment(): string;
}
declare namespace Rize {
    export { PACKAGE_VERSION, Rize, Rize as default, RizeOptions };
}
import ComplianceWorkflowService = require("./core/compliance-workflow");
import CustomerProductService = require("./core/customer-product");
import CustomerService = require("./core/customer");
import SyntheticAccountService = require("./core/synthetic-account");
import CustodialAccountService = require("./core/custodial-account");
import TransactionService = require("./core/transaction");
import TransferService = require("./core/transfer");
import DebitCardService = require("./core/debit-card");
import DocumentService = require("./core/document");
import KYCDocumentService = require("./core/kyc-document");
import EvaluationService = require("./core/evaluation");
import PoolService = require("./core/pool");
import ProductService = require("./core/product");
import RizeMessageQueue = require("./mq");
type RizeOptions = {
    /**
     * - The Rize environment to be used. (Default: 'sandbox')
     */
    environment?: 'sandbox' | 'integration' | 'production';
    /**
     * - Specifies the number of milliseconds before the each request times out. (Default: 80000)
     */
    timeout?: number;
};
declare var PACKAGE_VERSION: string;
