export type CustomerDetails = {
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    phone: string;
    ssn: string;
    dob: string;
    address: Address;
};
export type Customer = {
    /**
     * - A unique identifier generated by Rize
     */
    uid: string;
    /**
     * - A unique identifier Client supplies. It should be given when creating a new resource and must be unique within the resource type. If the same value is given, no new resource will be created.
     */
    external_uid: string;
    /**
     * - A uid referring to the program this customer belongs to.
     */
    program_uid: string;
    /**
     * - A list of uids referring to Pools belonging to this Customer.
     */
    pool_uids: Array<string>;
    /**
     * - Email of the customer
     */
    email: string;
    /**
     * A value indicating the overall state of this Customer:
     * - ***initiated*** - Rize has created the Customer as a result of a post to the Compliance Workflows endpoint. This status will persist until Rize receives a successful request to perform Identity Verification. The Customer status will move to 'queued' after a successful request to perform Identity Verification.
     * - ***queued*** - Rize has determined that the required Customer PII has been provided and the Compliance Workflow is complete. The Customer record has been sent for KYC/AML partner verification. If the KYC/AML verification returns 'approved' the Customer status will move to 'identity_verified'. If the KYC/AML verification returns 'denied' the Customer status will move to 'rejected'. If the KYC/AML verification status returns 'manual_review' the Customer status will move to 'manual_review'.
     * - ***identity_verified*** - The Customer has been approved by the KYC/AML partner's verification process. This Customer's Master Synthetic Account and Custodial Account(s) are in the process of being opened.
     * - ***active*** - The Customer has been created on the Rize platform. The default Custodial Account(s) and Master Synthetic Account for this Customer have been opened per your Program configuration.
     * - ***manual_review*** - The Customer record is under review. A Manual Review status indicates a kyc_status that is not 'approved' or 'denied'. The Status will move from 'manual_review' to either 'identity_verified' or 'rejected' depending on the outcome of the review. See the KYC_Status values for additional states pertaining to Manual Review.
     * - ***rejected*** - The Customer is not eligible for an account on this Program.
     * - ***archived*** - The Customer is archived; no actions are available for this Customer. All archived accounts have a $0.00 balance.
     * - ***under_review*** - The Customer's account balances are under review. Rize will not accept Transfer requests for this Customer until their status returns to 'active'. The Customer can continue using their Debit Card while in a status of 'under_review'. The Customer status must be 'active' before entering a status of 'under_review'. Rize will not return an 'under_review' status during any portion of creating a Customer or a Compliance Workflow.
     */
    status: 'initiated' | 'queued' | 'identity_verified' | 'active' | 'manual_review' | 'rejected' | 'archived' | 'under_review';
    /**
     * A value indicating the state of KYC/AML evaluation:
     * - ***manual_review*** - The Customer has been selected for manual review by the KYC/AML partner supporting the Program. This is an interim step and the Customer KYC Status will likely be moved to Pending Documents.
     * - ***approved*** - The Customer has been approved by the KYC/AML partner supporting your Program. This KYC Status will prompt a change to the customer status to 'identity_verified'.
     * - ***denied*** - The Customer has been denied access by the KYC/AML partner supporting your Program. A Denied KYC Status will result in a Rejected customer status.
     * - ***pending_documents*** - The reviewer cannot adjudicate the Customer without identity verification documents. The Customer must supply identity verification documents before the review can be completed. The types of documents required will be defined during Program setup.
     * - ***documents_provided*** - The Customer has supplied identity verification documents.
     * - ***documents_rejected*** - The identity verification documents are not valid. Please request valid/clear images of the identity verification documents from the Customer.
     * - ***under_review*** - The Customer is being reviewed.
     * - ***ready_for_custodial_partner_review*** - The Customer is being reviewed by the Custodial Partner participating in the Program. Not all Customers that are reviewed will enter this state but some records will require Custodial Partner inputs.
     */
    kyc_status?: 'approved' | 'denied' | 'documents_provided' | 'documents_rejected' | 'manual_review' | 'pending_documents' | 'ready_for_custodial_partner_review' | 'under_review' | null;
    /**
     * - Total asset owned by the customer in US dollars.
     */
    total_balance: string;
    created_at: Date;
    /**
     * - The date and time when the Customer was locked. This field will be null if and only if the lock_reason is null.
     */
    locked_at?: Date | null;
    /**
     * - The lock reason provided by the Client, an admin User, or the system at the time the Customer was locked. This field will be null if and only if the locked_at is null.
     */
    lock_reason?: string | null;
    /**
     * - An object containing the supplied identifying information for the Customer.
     */
    details: CustomerDetails;
};
export type CustomerProfileAnswerDetails = {
    /**
     * - A UID referring to the Profile Requirement
     */
    profile_requirement_uid: string;
    /**
     * - The Customer's response to the Profile Requirement, pending on the question may require a string or object ordered hash list response.
     *
     * /**
     */
    profile_response: string | object;
};
export type CustomerListQuery = {
    /**
     * - Filter by onboarding status. Please note that the initiated enum value will not be respected unless the `include_initiated=true` parameter is also provided.
     */
    status?: 'initiated' | 'queued' | 'identity_verified' | 'active' | 'manual_review' | 'rejected' | 'archived' | 'under_review';
    /**
     * - By default, Customers in initiated status are not shown, even if the `status=initiated` parameter is provided. In order for Customers with status initiated to appear in search results, parameters must include `include_initiated=true`.
     */
    include_initiated?: boolean;
    /**
     * - Filter by KYC status.
     */
    kyc_status?: 'approved' | 'denied' | 'documents_provided' | 'documents_rejected' | 'manual_review' | 'pending_documents' | 'ready_for_custodial_partner_review' | 'under_review';
    /**
     * - Only return Customers with a first name matching exactly what is submitted
     */
    first_name?: string;
    /**
     * - Only return Customers with a last name matching exactly what is submitted
     */
    last_name?: string;
    /**
     * - Only return Customers with an email address matching exactly what is submitted
     */
    email?: string;
    /**
     * - Only return locked Customers if true and only return unlocked Customers if false
     */
    locked?: boolean;
    /**
     * - Only return Customers belonging to the submitted Program.
     */
    program_uid?: string;
    /**
     * - A unique, immutable id provided by Client.
     */
    external_uid?: string;
    /**
     * - Filter by pool. Multiple values are allowed.
     */
    pool_uid?: Array<string>;
    /**
     * -  Maximum number of items to retrieve. This filter is automatically applied with the default value if not given. Default: 100
     */
    limit?: string;
    /**
     * - Index of the items to start retrieving from. Default: 0
     */
    offset?: string;
    /**
     * - Sort returned items.
     */
    sort?: 'first_name_asc' | 'first_name_desc' | 'last_name_asc' | 'last_name_desc' | 'email_asc' | 'email_desc';
};
