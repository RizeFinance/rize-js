export = DebitCardService;
/**
 * The Debit Card service class
 */
declare class DebitCardService {
    /**
     * @hideconstructor
     * @param {import('axios').AxiosInstance} api
     * @param {import('./auth')} auth
     */
    constructor(api: import('axios').AxiosInstance, auth: import('./auth'));
    /** @ignore @protected */ protected _api: import("axios").AxiosInstance;
    /** @ignore @protected */ protected _auth: import("./auth");
    /**
     * @ignore @protected
     * Validates query parameter object for getList method.
     * @param {} query - An object containing key value pair for filtering the results list.
     */
    protected _validateGetListQuery(query: any): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "get" method
     * @param {string} uid
     */
    protected _validateGetParams(uid: string): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "create" method
     */
    protected _validateCreateParams(externalUid: any, customerUid: any, poolUid: any, shippingAddress?: any): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "lock" method
     */
    protected _validateLockParams(uid: any, lockReason: any): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "unlock" method
     */
    protected _validateUnlockParams(uid: any): void;
    /**
     * @ignore @protected
     * Validates the parameters for the "unlock" method
     */
    protected _validateReissueParams(uid: any, reissueReason: any): void;
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
    getList(query?: DebitCardListQuery): Promise<RizeList<DebitCard>>;
    /**
     * Get a single Debit Card
     *
     * @param {string} uid - Rize-generated unique debitCard id
     * @returns {Promise<DebitCard>} A promise that returns a Debit Card if resolved.
     * @example const debitCard = await rize.debitCard.get(debitCardUid);
     */
    get(uid: string): Promise<DebitCard>;
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
    create(externalUid: string, customerUid: string, poolUid: string, shippingAddress?: Address | null): Promise<DebitCard>;
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
    lock(uid: string, lockReason: string): Promise<DebitCard>;
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
    unlock(uid: string): Promise<DebitCard>;
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
    reissue(uid: string, reissueReason: 'damaged' | 'lost' | 'stolen'): Promise<DebitCard>;
}
declare namespace DebitCardService {
    export { DebitCardListQuery, DebitCard, Address, RizeList };
}
type DebitCardListQuery = import('./typedefs/debit-card.typedefs').DebitCardListQuery;
type RizeList<T> = import('./typedefs/common.typedefs').RizeList<T>;
type DebitCard = import('./typedefs/debit-card.typedefs').DebitCard;
type Address = import('./typedefs/common.typedefs').Address;
