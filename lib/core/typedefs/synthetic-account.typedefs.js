/**
 * @typedef {Object} SyntheticAccountType
 * @property {string} uid
 * @property {string} name
 * @property {string} synthetic_account_category
 * @property {string} description
 * @property {string} [program_uid]
 */

/**
 * @typedef {Object} SyntheticAccountTypeListQuery
 * @property {string} [program_uid] - Only list Synthetic Account Types that are available to be used by the given Program
 * @property {number} [limit] - Maximum number of items to retrieve. This filter is automatically applied with the default value if not given. Default: 100
 * @property {number} [offset] - Index of the items to start retrieving from. Default: 0
 */

/**
 * @typedef {Object} SyntheticAccount
 * @property {string} uid
 * @property {string} external_uid - A unique, immutable id provided by Client
 * @property {string} name
 * @property {string} pool_uid
 * @property {string} synthetic_account_type_uid
 * @property {string} synthetic_account_category
 * @property {string} status
 * @property {boolean} liability
 * @property {string} net_usd_balance 
 * @property {string} net_usd_pending_balance
 * @property {string} net_usd_available_balance
 * @property {boolean} master_account
 * @property {string | null} account_number
 * @property {string | null} account_number_last_four
 * @property {string | null} routing_number
 * @property {string} opened_at
 * @property {string | null} closed_at
 * @property {string | null} closed_to_synthetic_account_uid
 */

/**
 * @typedef {Object} SyntheticAccountTypeListQuery
 * @property {Array<string>} [customer_uid] - Filter by Customer. Multiple string values are allowed.
 * @property {string} [external_uid] - A unique, immutable id provided Client
 * @property {Array<string>} [pool_uid] - Filter by pool. Multiple string values are allowed.
 * @property {number} [limit] - Maximum number of items to retrieve. This filter is automatically applied with the default value if not given. Default: 100
 * @property {number} [offset] - Index of the items to start retrieving from. Default: 0
 * @property {string} [synthetic_account_type_uid] - Filter by Synthetic Account Type
 * @property {'general' | 'external' | 'plaid_external'} [synthetic_account_category] - Filter by Synthetic Account Category
 * @property {boolean} [liability] - Filter by liability or asset
 * @property {'name_asc'|'name_desc'|'net_usd_balance_asc'|'net_usd_balance_desc'|'net_usd_pending_balance_asc'|'net_usd_pending_balance_desc'|'net_usd_available_balance_asc'|'net_usd_available_balance_desc'} [sort]
 */

/**
 * @typedef {Object} SyntheticAccountCreateOptions
 * @property {string|null} [account_number] - The ACH account number (if any) associated with this account.
 * @property {string|null} [routing_number] - The ABA routing number (if any) associated with this account.
 * @property {string|null} [plaid_processor_token] - The Rize processor token from Plaid. If a Synthetic Account Type from the category plaid_external is provided, plaid_processor_token must also be provided. 
 */

module.exports = {};
