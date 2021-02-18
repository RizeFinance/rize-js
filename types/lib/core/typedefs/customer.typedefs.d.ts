export type CustomerDetails = {
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    phone: string;
};
export type Customer = {
    uid: string;
    external_uid: string;
    program_uid: string;
    pool_uids: Array<string>;
    email: string;
    status: string;
    kyc_status: string;
    total_balance: string;
    created_at: Date;
    locked_at: Date | null;
    lock_reason: string | null;
    details: CustomerDetails;
};
export type CustomerList = {
    total_count: number;
    count: number;
    limit: number;
    offset: number;
    data: Array<Customer>;
};
export type CustomerListQuery = {
    /**
     * - Filter by onboarding status. Please note that the initiated enum value will not be respected unless the `include_initiated=true` parameter is also provided.
     */
    status: 'initiated' | 'queued' | 'identity_verified' | 'active' | 'manual_review' | 'rejected' | 'archived' | 'under_review';
    /**
     * ? - By default, Customers in initiated status are not shown, even if the `status=initiated` parameter is provided. In order for Customers with status initiated to appear in search results, parameters must include `include_initiated=true`.
     */
    include_initiated: boolean;
    /**
     * ? - Filter by KYC status.
     */
    kyc_status: 'approved' | 'denied' | 'documents_provided' | 'documents_rejected' | 'manual_review' | 'pending_documents' | 'ready_for_custodial_partner_review' | 'under_review';
    /**
     * - Only return Customers with a first name matching exactly what is submitted
     */
    first_name: string;
    /**
     * - Only return Customers with a last name matching exactly what is submitted
     */
    last_name: string;
    /**
     * - Only return Customers with an email address matching exactly what is submitted
     */
    email: string;
    /**
     * - Only return locked Customers if true and only return unlocked Customers if false
     */
    locked: boolean;
    /**
     * - Only return Customers belonging to the submitted Program.
     */
    program_uid: string;
    /**
     * - A unique, immutable id provided by Client.
     */
    external_uid: string;
    /**
     * - Filter by pool. Multiple values are allowed.
     */
    pool_uid: Array<string>;
    /**
     * -  Maximum number of items to retrieve. This filter is automatically applied with the default value if not given. Default: 100
     */
    limit: string;
    /**
     * - Index of the items to start retrieving from. Default: 0
     */
    offset: string;
    /**
     * - Sort returned items.
     */
    sort: 'first_name_asc' | 'first_name_desc' | 'last_name_asc' | 'last_name_desc' | 'email_asc' | 'email_desc';
};
