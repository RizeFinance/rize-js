const utils = require('../utils');
const validator = require('validator');

/**
 * The Debit Card service class
 */
class DebitCardService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api 
     * @param {import('./auth')} auth 
     */
    constructor(api, auth) {
        /** @ignore @protected */ this._api = api;
        /** @ignore @protected */ this._auth = auth;
    }

    /** 
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    _validateGetListQuery(query) {
        const statuses = [
            'queued',
            'issued',
            'printing_physical_card',
            'printing_physical_card_replacement',
            'card_replacement_shipped',
            'shipped',
            'usable_without_pin',
            'normal',
            'closed',
            'damaged',
            'lost',
            'stolen',
            'administrative_lock',
            'closed_by_administrator',
            'card_replacement_shipment_returned',
            'shipment_returned'
        ];

        if (!utils.isObject(query)) {
            throw new Error('"query" must be a DebitCardListQuery object.');
        } else {
            if ('customer_uid' in query && !Array.isArray(query.customer_uid)) {
                throw new Error('"customer_uid" query must be an array.');
            }
            if ('pool_uid' in query && !Array.isArray(query.pool_uid)) {
                throw new Error('"pool_uid" query must be an array.');
            }
            if ('status' in query) {
                if (!Array.isArray(query.status)) {
                    throw new Error(`"status" query must be an array. Accepted values inside the array are: ${statuses.join(' | ')}`);
                } else {
                    for (let status of query.status) {
                        if (!statuses.includes(status)) {
                            throw new Error(`Accepted values in the "status" query are: ${statuses.join(' | ')}`);
                        }
                    }
                }
            }
            if ('limit' in query && !Number.isInteger(query.limit)) {
                throw new Error('"limit" query must be an integer.');
            }
            if ('offset' in query && !Number.isInteger(query.offset)) {
                throw new Error('"offset" query must be an integer.');
            }
            if ('locked' in query && !utils.isBoolean(query.locked)) {
                throw new Error('"locked" query must be boolean.');
            }
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid 
     */
    _validateGetParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Debit Card "uid" is required.');
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "create" method
     */
    _validateCreateParams(externalUid, customerUid, poolUid, shippingAddress = null) {
        if (validator.isEmpty(externalUid, { ignore_whitespace: true })) {
            throw new Error('"externalUid" is required.');
        }

        if (validator.isEmpty(customerUid, { ignore_whitespace: true })) {
            throw new Error('"customerUid" is required.');
        }

        if (validator.isEmpty(poolUid, { ignore_whitespace: true })) {
            throw new Error('"poolUid" is required.');
        }

        if (shippingAddress) {
            if (!utils.isObject(shippingAddress)) {
                throw new Error('"shippingAddress" must be an Address object.');
            }

            if (!('street1' in shippingAddress) || validator.isEmpty(shippingAddress.street1, { ignore_whitespace: true })) {
                throw new Error('"shippingAddress.street1" is required if "shippingAddress" is supplied.');
            }

            if (!('city' in shippingAddress) || validator.isEmpty(shippingAddress.city, { ignore_whitespace: true })) {
                throw new Error('"shippingAddress.city" is required if "shippingAddress" is supplied.');
            }

            if (!('state' in shippingAddress) || validator.isEmpty(shippingAddress.state, { ignore_whitespace: true })) {
                throw new Error('"shippingAddress.state" is required if "shippingAddress" is supplied.');
            }

            if (!('postal_code' in shippingAddress) || validator.isEmpty(shippingAddress.postal_code, { ignore_whitespace: true })) {
                throw new Error('"shippingAddress.postal_code" is required if "shippingAddress" is supplied.');
            }
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "lock" method
     */
    _validateLockParams(uid, lockReason) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Debit Card "uid" is required.');
        }

        if (validator.isEmpty(lockReason, { ignore_whitespace: true })) {
            throw new Error('"lockReason" is required.');
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "unlock" method
     */
    _validateUnlockParams(uid) {
        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Debit Card "uid" is required.');
        }
    }

    /**
     * Retrieves a list of Debit Cards filtered by the given parameters. 
     * @param {DebitCardListQuery} [query] - An object containing key value pair for filtering the results list.
     * @returns {Promise<RizeList<DebitCard>>} A promise that returns a Debit Card List if resolved.
     * @example
     * const debitCards = await rize.debitCard.getList({
     *     customer_uid: ['customer_uid1', 'customer_uid2'],
     *     external_uid: 'external_uid1',
     *     limit: 50,
     *     offset: 0,
     *     pool_uid: ['pool_uid1', 'pool_uid2'],
     *     locked: false,
     *     status: ['queued', 'issued']
     * });
     */
    async getList(query = {}) {
        this._validateGetListQuery(query);
        const queryParameters = [
            'customer_uid',
            'external_uid',
            'limit',
            'offset',
            'pool_uid',
            'locked',
            'status'
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const authToken = await this._auth.getToken();
        const response = await this._api.get(
            `/debit_cards/${queryStr}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Get a single Debit Card
     * 
     * @param {string} uid - Rize-generated unique debitCard id
     * @returns {Promise<DebitCard>} A promise that returns a Debit Card if resolved.
     * @example const debitCard = await rize.debitCard.get(debitCardUid);
     */
    async get(uid) {
        this._validateGetParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.get(
            `/debit_cards/${uid}`,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Create a new Debit Card and attach it to the supplied Customer and Pool. The Synthetic and Custodial Accounts that 
     * belong to the new Card will be automatically determined.
     * 
     * The physical Debit Card will be sent to the Customer's primary address, set via the `customer.update` function, 
     * by default. If the Card needs to be shipped to a different address, the address can be specified in the `shipping_address` 
     * field. Once the Client submits the create Debit Card request, the shipping address cannot be changed.
     * 
     * When a Debit Card creation is successfully requested, the Card will be in the `queued` state. After the Custodial Partner 
     * issues the new card, it will move on to the `issued` state. When the new Debit Card is being produced, the card will be in 
     * the `printing_physical_card state`. After the Debit Card is produced it will be `shipped` to the Customer. When the Debit 
     * Card is shipped, the card will be in the shipped state.
     * 
     * When the Customer has received their Debit Card, they will need to set their PIN via IVR (Interactive Voice Response). 
     * After the Customer succesfully sets the PIN, the Custodial Partner will notify Rize via call back and Rize will update 
     * the state in the system to `normal`.
     * @param {string} externalUid - A unique identifier Client supplies. It should be given when creating a new resource and must be unique within the resource type. If the same value is given, no new resource will be created.
     * @param {string} customerUid - A UID referring to the Customer who owns this Card
     * @param {string} poolUid - A UID referring to the Pool to which this Card belongs
     * @param {Address|null} [shippingAddress] - An optional field used to specify the shipping address for a physical Debit Card.
     * 
     * Either the whole `address` must be nullable or all fields must be provided, with an except of `street2`, which is nullable.
     * 
     * If no address is specified, the primary address associated with the customer will be used as a shipping address.
     * @returns {Promise<DebitCard>} A promise that returns a Debit Card if resolved.
     * @example
     * const debitCard = await rize.debitCard.create(
     *     'partner-generated-id',
     *     'customer_uid1',
     *     'pool_uid1',
     *     {
     *         street1: '123 Abc St.',
     *         street2: 'Apt 2',
     *         city: 'Chicago',
     *         state: 'IL',
     *         postal_code: '12345'
     *     }
     * );
     */
    async create(externalUid, customerUid, poolUid, shippingAddress = null) {
        this._validateCreateParams(externalUid, customerUid, poolUid, shippingAddress);

        const authToken = await this._auth.getToken();

        const response = await this._api.post(
            '/debit_cards',
            {
                'external_uid': externalUid,
                'customer_uid': customerUid,
                'pool_uid': poolUid,
                'shipping_address': shippingAddress
            },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Lock a Debit Card
     * 
     * A Debit Card can be locked temporarily by either the Customer, Client, or the Custodial Partner. 
     * A lock is only temporary and can generally be removed by calling `debitCard.unlock`.
     * @param {string} uid Rize-generated unique Debit Card id
     * @param {string} lockReason A lock reason is required to be submitted when locking a Debit Card
     * @returns {Promise<DebitCard>} A promise that returns a Debit Card if resolved.
     * @example
     * const lockedDebitCard = await rize.debitCard.lock(
     *     'debit_card_uid1',
     *     'Fraud detected'
     * );
     */
    async lock(uid, lockReason) {
        this._validateLockParams(uid, lockReason);

        const authToken = await this._auth.getToken();

        const response = await this._api.put(
            `/debit_cards/${uid}/lock`,
            {
                'lock_reason': lockReason
            },
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }

    /**
     * Unlock a Debit Card
     * 
     * Calling this function will attempt to remove a lock placed on a Debit Card. 
     * Depending on the type of lock in place, this will not always be successful. 
     * For example, a lock placed by a Custodial Partner for fraud can not be removed by a Customer.
     * @param {string} uid Rize-generated unique Debit Card id
     * @returns {Promise<DebitCard>} A promise that returns a Debit Card if resolved.
     * @example
     * const unlockedDebitCard = await rize.debitCard.unlock('debit_card_uid1');
     */
    async unlock(uid) {
        this._validateUnlockParams(uid);

        const authToken = await this._auth.getToken();

        const response = await this._api.put(
            `/debit_cards/${uid}/unlock`,
            undefined,
            { headers: { 'Authorization': authToken } }
        );

        return response.data;
    }
}

module.exports = DebitCardService;

/**
 * @typedef {import('./typedefs/debit-card.typedefs').DebitCardListQuery} DebitCardListQuery
 * @typedef {import('./typedefs/debit-card.typedefs').DebitCard} DebitCard
 * @typedef {import('./typedefs/common.typedefs').Address} Address
 */

/**
 * @template T @typedef {import('./typedefs/common.typedefs').RizeList<T>} RizeList
 */