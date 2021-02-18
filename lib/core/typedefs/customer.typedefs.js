/**
 * @typedef {Object} CustomerDetails
 * @property {string} first_name
 * @property {string} middle_name
 * @property {string} last_name
 * @property {string} suffix
 * @property {string} phone
 */

/**
 * @typedef {Object} Customer
 * @property {string} uid
 * @property {string} external_uid
 * @property {string} program_uid
 * @property {Array<string>} pool_uids
 * @property {string} email
 * @property {string} status
 * @property {string} kyc_status
 * @property {string} total_balance
 * @property {Date} created_at
 * @property {Date | null} locked_at
 * @property {string | null} lock_reason
 * @property {string} total_balance
 * @property {CustomerDetails} details
 */

/**
 * @typedef {Object} CustomerList
 * @property {number} total_count
 * @property {number} count
 * @property {number} limit
 * @property {number} offset
 * @property {Array<Customer>} data
 */

/**
  * @typedef {Object} CustomerListQuery
  * @property {'initiated'|'queued'|'identity_verified'|'active'|'manual_review'|'rejected'|'archived'|'under_review'} status - Filter by onboarding status. Please note that the initiated enum value will not be respected unless the `include_initiated=true` parameter is also provided.
  * @property {boolean} include_initiated? - By default, Customers in initiated status are not shown, even if the `status=initiated` parameter is provided. In order for Customers with status initiated to appear in search results, parameters must include `include_initiated=true`.
  * @property {'approved'|'denied'|'documents_provided'|'documents_rejected'|'manual_review'|'pending_documents'|'ready_for_custodial_partner_review'|'under_review'} kyc_status? - Filter by KYC status.
  * @property {string} first_name - Only return Customers with a first name matching exactly what is submitted
  * @property {string} last_name - Only return Customers with a last name matching exactly what is submitted
  * @property {string} email - Only return Customers with an email address matching exactly what is submitted
  * @property {boolean} locked - Only return locked Customers if true and only return unlocked Customers if false
  * @property {string} program_uid - Only return Customers belonging to the submitted Program.
  * @property {string} external_uid - A unique, immutable id provided by Client.
  * @property {Array<string>} pool_uid - Filter by pool. Multiple values are allowed.
  * @property {string} limit -  Maximum number of items to retrieve. This filter is automatically applied with the default value if not given. Default: 100
  * @property {string} offset - Index of the items to start retrieving from. Default: 0
  * @property {'first_name_asc'|'first_name_desc'|'last_name_asc'|'last_name_desc'|'email_asc'|'email_desc'} sort - Sort returned items.
  */

module.exports = {};