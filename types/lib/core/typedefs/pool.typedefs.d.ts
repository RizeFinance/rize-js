export type Pool = {
    /**
     * - A unique identifier generated by Rize
     */
    uid: string;
    /**
     * - A unique name to identify the resource
     */
    name: string;
    owner_customer_uid: string;
};
export type PoolListQuery = {
    /**
     * - Filter by Customer. Multiple values are allowed
     */
    customer_uid?: Array<string>;
    /**
     * - A unique, immutable id provided Client
     */
    external_uid?: string;
    /**
     * - Maximum number of items to retrieve. This filter is automatically applied with the default value if not given. Default = 100.
     */
    limit?: number;
    /**
     * - Index of the items to start retrieving from. Default = 0.
     */
    offset?: number;
};