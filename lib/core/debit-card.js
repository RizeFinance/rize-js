const utils = require('../utils');
const validator = require('validator');

/**
 * The Debit Card service class
 */
class DebitCardService {
    /**
   * @hideconstructor
   * @param {import('axios').AxiosInstance} api
   */
    constructor(api) {
    /** @ignore @protected */ this._api = api;
    }

    /**
 * @ignore @protected
 * Validates the parameters for the "create" method
 */
    _validateCreateParams(customerUid, poolUid, shippingAddress = null) {
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

            if (
                !('street1' in shippingAddress) ||
      validator.isEmpty(shippingAddress.street1, { ignore_whitespace: true })
            ) {
                throw new Error(
                    '"shippingAddress.street1" is required if "shippingAddress" is supplied.',
                );
            }

            if (
                !('city' in shippingAddress) ||
      validator.isEmpty(shippingAddress.city, { ignore_whitespace: true })
            ) {
                throw new Error(
                    '"shippingAddress.city" is required if "shippingAddress" is supplied.',
                );
            }

            if (
                !('state' in shippingAddress) ||
      validator.isEmpty(shippingAddress.state, { ignore_whitespace: true })
            ) {
                throw new Error(
                    '"shippingAddress.state" is required if "shippingAddress" is supplied.',
                );
            }

            if (
                !('postal_code' in shippingAddress) ||
      validator.isEmpty(shippingAddress.postal_code, {
          ignore_whitespace: true,
      })
            ) {
                throw new Error(
                    '"shippingAddress.postal_code" is required if "shippingAddress" is supplied.',
                );
            }
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "migrateVirtualCard" method
     */
    _validateMigrateVirtualCard(data) {
        const {uid, customer_uid, pool_uid, shippingAddress} = data;

        if(!utils.isObject(data)) {
            throw new Error('"data" must be a DebitCardMigrateData object.');
        } 
        else {

            if(validator.isEmpty(uid, { ignore_whitespace: true })) {
                throw new Error('Debit Card "uid" is required.');
            }

            if(validator.isEmpty(customer_uid, { ignore_whitespace: true })) {
                throw new Error('"customerUid" is required.');
            }

            if(validator.isEmpty(pool_uid, { ignore_whitespace: true })) {
                throw new Error('"poolUid" is required.');
            }

            if('shippingAddress' in data) {
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
     * Validates the parameters for the "activate" method
     */
    _validateActivateParams(uid, cardLastFourDigits, cvv, expiryDate) {
        if (validator.isEmpty(uid, { ignore_whitespace: true})) {
            throw new Error('Debit Card "uid" is required.');
        }
        if (validator.isEmpty(cardLastFourDigits, { ignore_whitespace: true})) {
            throw new Error('"cardLastFourDigits" is required.');
        }
        if (validator.isEmpty(cvv, { ignore_whitespace: true})) {
            throw new Error('"cvv" is required.');
        }
        if (validator.isEmpty(expiryDate, { ignore_whitespace: true})) {
            throw new Error('"expiryDate" is required.');
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
     * @ignore @protected
     * Validates the parameters for the "unlock" method
     */
    _validateReissueParams(uid, reissueReason) {
        const reissueReasons = [
            'damaged',
            'lost',
            'stolen'
        ];

        if (validator.isEmpty(uid, { ignore_whitespace: true })) {
            throw new Error('Debit Card "uid" is required.');
        }

        if (validator.isEmpty(reissueReason, { ignore_whitespace: true })) {
            throw new Error('"reissueReason" is required.');
        }

        if (!reissueReasons.includes(reissueReason)) {
            throw new Error(`Invalid reissueReason. Accepted values are: ${reissueReasons.join(' | ')}`);
        }
    }

    /**
     * @ignore @protected
     * Validates the parameters for the "getVirtualCardImage" method
     */

    _validateGetVirtualCardImage(configId, token) {
        if (validator.isEmpty(configId, { ignore_whitespace: true })) {
            throw new Error('"configId" is required.');
        }
    
        if (validator.isEmpty(token, { ignore_whitespace: true })) {
            throw new Error('"token" is required.');
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
            'status',
        ];

        const queryStr = utils.toQueryString(query, queryParameters);

        const response = await this._api.get(`/debit_cards/${queryStr}`);

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

        const response = await this._api.get(`/debit_cards/${uid}`);

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
   * @param {string} [externalUid] - A unique identifier Client supplies. It should be given when creating a new resource and must be unique within the resource type. If the same value is given, no new resource will be created.
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
    async create(externalUid = '', customerUid, poolUid, shippingAddress = null) {
        this._validateCreateParams(customerUid, poolUid, shippingAddress);

        const response = await this._api.post('/debit_cards', {
            external_uid: externalUid,
            customer_uid: customerUid,
            pool_uid: poolUid,
            shipping_address: shippingAddress,
        });

        return response.data;
    }

    /**
   * Activate a Debit Card
   *
   * A Debit Card can be activated once a customer has received it.
   * @param {string} uid Rize-generated unique Debit Card id
   * @param {string} cardLastFourDigits The last four digits of the Debit Card
   * @param {string} cvv The CVV number of the Debit Card
   * @param {string} expiryDate Debit Card expiration date. It should be formatted YYYY-MM.
   * @returns {Promise<DebitCard>} A promise that returns a Debit Card if resolved.
   * @example
   * const activatedDebitCard = await rize.debitCard.activate(
   *      'debit_card_uid1',
   *      '5678',
   *      '930',
   *      '2030-02'
   * );
   */
    async activate(uid, cardLastFourDigits, cvv, expiryDate) {
        this._validateActivateParams(uid, cardLastFourDigits, cvv, expiryDate);

        const response = await this._api.put(`/debit_cards/${uid}/activate`, {
            card_last_four_digits: cardLastFourDigits,
            cvv: cvv,
            expiry_date: expiryDate,
        });

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

        const response = await this._api.put(`/debit_cards/${uid}/lock`, {
            lock_reason: lockReason,
        });

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

        const response = await this._api.put(`/debit_cards/${uid}/unlock`);

        return response.data;
    }

    /**
   * Reissue a Debit Card
   *
   * Reissuance may be requested when a Debit Card is lost or stolen, or when it has suffered damage.
   * In the case of a damaged Debit Card, the original remains usable while the reissued card is being processed.
   * The reissued card will have the same PAN as the original and the Debit Card UID will not change.
   *
   * When a reissued Debit Card is requested because the original was lost or stolen, the original card is closed
   * and the reissued card will have a new PAN. For Debit Cards reported lost or stolen, a new Debit Card UID will
   * be provided by Rize to identify the reissued Debit Card.
   *
   * The new physical Debit Card will by default be sent to the Customer's primary address, set via `customer.update`.
   * @param {string} uid Rize-generated unique Debit Card id
   * @param {'damaged'|'lost'|'stolen'} reissueReason A reissue reason is required when requesting Debit Card reissuance.
   * @returns {Promise<DebitCard>} A promise that returns a Debit Card if resolved.
   * @example
   * const reissuedDebitCard = await rize.debitCard.reissue('debit_card_uid1', 'damaged');
   */
    async reissue(uid, reissueReason) {
        this._validateReissueParams(uid, reissueReason);

        const response = await this._api.put(`/debit_cards/${uid}/reissue`, {
            reissue_reason: reissueReason,
        });

        return response.data;
    }

    /**
   * Get Debit Card PIN token
   *
   * This method is used to retrieve a token necessary to change a Debit Card's PIN.
   * This token will be used with a PIN-set form that a Customer can submit to change their PIN.
   *
   * @param {string} uid - Rize-generated unique debitCard uid
   * @returns {Promise<PinChangeToken>} A promise that returns a Pin Change Token if resolved.
   * @example const debitCard = await rize.debitCard.getPinChangeToken(debitCardUid);
   */
    async getPinChangeToken(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(
            `/debit_cards/${uid}/pin_change_token`,
        );

        return response.data;
    }

    /**
   * Get Debit Card access token
   *
   * This method is used to retrieve the configuration ID and token necessary to retrieve a virtual Debit Card image.
   *
   * @param {string} uid - Rize-generated unique debitCard uid
   * @returns {Promise<DebitCardAccessToken>} A promise that returns a Debit Card Access Token and configuration ID if resolved.
   * @example
   * const accessTokenData = await rize.debitCard.getAccessTokenData(debitCardUid);
   */
    async getAccessTokenData(uid) {
        this._validateGetParams(uid);

        const response = await this._api.get(`/debit_cards/${uid}/access_token`);
        return response.data;
    }

    /**
   * Migrate a virtual Debit Card to a physical Debit Card
   *
   * This method will result in a physical version of the virtual debit card
   * being issued to a Customer.
   *
   * @param {DebitCardMigrateData} data - An object containing key value pair for migrating a virtual debit card to a physical card.
   * @returns {Promise<DebitCard>} - A promise that returns a Debit Card List if resolved.
   * @example const response = await rize.debitCard.migrateVirtualCard({uid: 'uid', externalUid: 'externalUid', customerUid: 'customerUid', poolUid: 'poolUid' })
   */

    async migrateVirtualCard(data) {
        const {uid, customerUid, externalUid = '', poolUid, shippingAddress = null} = data;

        this._validateMigrateVirtualCard(data);

        const response = await this._api.put(`/debit_cards/${uid}/migrate`, {
            external_uid: externalUid,
            customer_uid: customerUid,
            pool_uid: poolUid,
            shipping_address: shippingAddress,
        });
        return response.data;
    }

    /**
   * Retrieve a virtual Debit Card image
   * 
   * This method returns a PNG base64 string to decord that displays the card design configured for the Program
   * @param {string} configId - This configuration ID is required to retrieve the virtual card image.
   * @param {string} token - This token will be used to request a virtual card image.
   * @returns {Promise<string>} - PNG base64 string to decode that displays the card design configured for the Program
   * @example const response = await rize.debitCard.getVirtualCardImage(configId, token)
   */

    async getVirtualCardImage(configId, token) {
        this._validateGetVirtualCardImage(configId, token);
        const response = await this._api.get(`/assets/virtual_card_image?config=${configId}&token=${token}`,
            {
                responseType: 'arraybuffer'
            });


        return Buffer.from(response.data, 'binary').toString('base64');
    }
}   

module.exports = DebitCardService;

/**
 * @typedef {import('./typedefs/debit-card.typedefs').DebitCardListQuery} DebitCardListQuery
 * @typedef {import('./typedefs/debit-card.typedefs').DebitCard} DebitCard
 * @typedef {import('./typedefs/debit-card.typedefs').PinChangeToken} PinChangeToken
 * @typedef {import('./typedefs/debit-card.typedefs').DebitCardAccessToken} DebitCardAccessToken
 * @typedef {import('./typedefs/common.typedefs').Address} Address
 * @typedef {import('./typedefs/debit-card.typedefs').DebitCardMigrateData} DebitCardMigrateData
 */

/**
 * @template T @typedef {import('../typedefs/common.typedefs').RizeList<T>} RizeList
 */