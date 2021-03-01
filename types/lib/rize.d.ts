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
     * @type {SyntheticAccount}
     */
    syntheticAccount: SyntheticAccount;
    /**
     * Custodial Account is the account held by the Custodian participating in your Program. Custodial Accounts in a Program can only be created for the Service Offerings that have been configured for that Program.
     * A Customer must successfully complete onboarding and pass all KYC/AML checks before their Custodial Accounts can be opened.
     * @type {CustodialAccount}
     */
    custodialAccount: CustodialAccount;
}
declare namespace Rize {
    export { PACKAGE_VERSION, Rize, Rize as default };
}
import ComplianceWorkflowService = require("./core/compliance-workflow");
import CustomerService = require("./core/customer");
import SyntheticAccount = require("./core/synthetic-account");
import CustodialAccount = require("./core/custodial-account");
declare var PACKAGE_VERSION: string;
