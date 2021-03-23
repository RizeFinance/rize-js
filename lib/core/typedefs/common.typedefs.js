/**
 * @template T
 * @typedef {Object} RizeList<T>
 * @property {number} total_count - Total count of items available to retrieve
 * @property {number} count - Number of items retrieved
 * @property {number} limit - Maximum number of items to retrieve
 * @property {number} offset - Index of the first item to retrieve
 * @property {Array<T>} data
 */

/**
 * @typedef {Object} Address
 * @property {string} street1
 * @property {string|null} [street2]
 * @property {string} city
 * @property {string} state
 * @property {string} postal_code
 */

/**
 * @template T
 * @typedef {Object} HTTPResponse<T>
 * @property {T} data - Object that contains more information about the response.
 * @property {any} headers - Collection of response headers.
 */

module.exports = {};
