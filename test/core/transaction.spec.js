'use strict';

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const rizeClient = require('../helpers/rizeClient');

describe('Transaction', () => {
    let testTransaction;
    let testTransactionEvent;
    let testSyntheticLineItem;
    let testCustodialLineItem;

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.transaction.getList('');
            return expect(promise).to.eventually.be.rejectedWith(
                '"query" must be a TransactionListQuery object.'
            );
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"customer_uid" query must be an array.'
            );
        });

        it('Throws an error if "source_synthetic_account_uid" query is not an array', () => {
            const query = { source_synthetic_account_uid: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"source_synthetic_account_uid" query must be an array.'
            );
        });

        it('Throws an error if "destination_synthetic_account_uid" query is not an array', () => {
            const query = { destination_synthetic_account_uid: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"destination_synthetic_account_uid" query must be an array.'
            );
        });

        it('Throws an error if "synthetic_account_uid" query is not an array', () => {
            const query = { synthetic_account_uid: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"synthetic_account_uid" query must be an array.'
            );
        });

        it('Throws an error if "type" query is not an array', () => {
            const query = { type: '' };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"type" query must be an array. Accepted values inside the array are: atm_withdrawal | card_purchase | card_refund | dispute | external_transfer | fee | internal_transfer | other | peer_to_peer_transfer | reversed_transfer | third_party_transfer'
            );
        });

        it('Throws an error if "type" query is not an array of valid values', () => {
            const query = { type: [''] };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                'Accepted values in the "type" query are: atm_withdrawal | card_purchase | card_refund | dispute | external_transfer | fee | internal_transfer | other | peer_to_peer_transfer | reversed_transfer | third_party_transfer'
            );
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"limit" query must be an integer.'
            );
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"offset" query must be an integer.'
            );
        });

        it('Throws an error if "sort" query is not on the sort options', () => {
            const query = { sort: null };
            const promise = rizeClient.transaction.getList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"sort" query must be a string. Accepted values are: created_at_asc | created_at_desc | description_asc | description_desc | id_asc | id_desc | settled_index_asc | settled_index_desc | us_dollar_amount_asc | us_dollar_amount_desc'
            );
        });

        it('Retrieves the transaction list without query', async () => {
            const transactionList = await rizeClient.transaction.getList();
            testTransaction = transactionList.data[0];
            utils.expectRizeList(transactionList);
        });

        it('Retrieves the transaction list with query', async () => {
            const query = {
                customer_uid: ['customer_uid1', 'customer_uid2'],
                source_synthetic_account_uid: [
                    'synthetic_account_uid1',
                    'synthetic_account_uid2',
                ],
                destination_synthetic_account_uid: [
                    'synthetic_account_uid1',
                    'synthetic_account_uid2',
                ],
                synthetic_account_uid: [
                    'synthetic_account_uid1',
                    'synthetic_account_uid2',
                ],
                type: ['internal_transfer'],
                limit: 50,
                offset: 0,
                search_description: 'Transfer*',
                status: ['settled'],
                sort: 'created_at_asc',
            };
            const transactionList = await rizeClient.transaction.getList(query);
            utils.expectRizeList(transactionList);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.transaction.get('');
            return expect(promise).to.eventually.be.rejectedWith(
                'Transaction "uid" is required.'
            );
        });

        it('Retrieves transaction data successfully', async () => {
            const transaction = await rizeClient.transaction.get(testTransaction.uid);
            expect(transaction)
                .to.have.property('uid')
                .that.equals(testTransaction.uid);
        });
    });

    describe('getTransactionEventList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.transaction.getTransactionEventList('');
            return expect(promise).to.eventually.be.rejectedWith(
                '"query" must be a TransactionEventListQuery object.'
            );
        });

        it('Throws an error if "transaction_uid" query is not an array', () => {
            const query = { transaction_uid: '' };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"transaction_uid" query must be an array.'
            );
        });

        it('Throws an error if "source_custodial_account_uid" query is not an array', () => {
            const query = { source_custodial_account_uid: '' };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"source_custodial_account_uid" query must be an array.'
            );
        });

        it('Throws an error if "destination_custodial_account_uid" query is not an array', () => {
            const query = { destination_custodial_account_uid: '' };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"destination_custodial_account_uid" query must be an array.'
            );
        });

        it('Throws an error if "custodial_account_uid" query is not an array', () => {
            const query = { custodial_account_uid: '' };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"custodial_account_uid" query must be an array.'
            );
        });

        it('Throws an error if "type" query is not an array', () => {
            const query = { type: '' };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"type" query must be an array. Accepted values inside the array are: odfi_ach_deposit | odfi_ach_withdrawal | rdfi_ach_deposit | rdfi_ach_withdrawal'
            );
        });

        it('Throws an error if "type" query is not an array of valid values', () => {
            const query = { type: [''] };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                'Accepted values in the "type" query are: odfi_ach_deposit | odfi_ach_withdrawal | rdfi_ach_deposit | rdfi_ach_withdrawal'
            );
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"limit" query must be an integer.'
            );
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"offset" query must be an integer.'
            );
        });

        it('Throws an error if "sort" query is not on the sort options', () => {
            const query = { sort: null };
            const promise = rizeClient.transaction.getTransactionEventList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"sort" query must be a string. Accepted values are: created_at_asc | created_at_desc | description_asc | description_desc | settled_index_asc | settled_index_desc | us_dollar_amount_asc | us_dollar_amount_desc'
            );
        });

        it('Retrieves the transaction event list without query', async () => {
            const transactionList =
        await rizeClient.transaction.getTransactionEventList();
            testTransactionEvent = transactionList.data[0];
            utils.expectRizeList(transactionList);
        }).timeout(100000);

        it('Retrieves the transaction event list with query', async () => {
            const query = {
                source_custodial_account_uid: [
                    'custodial_account_uid1',
                    'custodial_account_uid2',
                ],
                destination_custodial_account_uid: [
                    'custodial_account_uid1',
                    'custodial_account_uid2',
                ],
                custodial_account_uid: [
                    'custodial_account_uid1',
                    'custodial_account_uid2',
                ],
                type: ['odfi_ach_deposit'],
                transaction_uid: ['transaction_uid1'],
                limit: 50,
                offset: 0,
                sort: 'created_at_asc',
            };
            const transactionList =
        await rizeClient.transaction.getTransactionEventList(query);
            utils.expectRizeList(transactionList);
        });
    });

    describe('getTransactionEvent', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.transaction.getTransactionEvent('');
            return expect(promise).to.eventually.be.rejectedWith(
                'TransactionEvent "uid" is required.'
            );
        });

        it('Retrieves transaction event data successfully', async () => {
            const transactionEvent = await rizeClient.transaction.getTransactionEvent(
                testTransactionEvent.uid
            );
            expect(transactionEvent)
                .to.have.property('uid')
                .that.equals(testTransactionEvent.uid);
        });
    });

    describe('getSyntheticLineItemList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.transaction.getSyntheticLineItemList('');
            return expect(promise).to.eventually.be.rejectedWith(
                '"query" must be a SyntheticLineItemListQuery object.'
            );
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.transaction.getSyntheticLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"customer_uid" query must be an array.'
            );
        });

        it('Throws an error if "pool_uid" query is not an array', () => {
            const query = { pool_uid: '' };
            const promise = rizeClient.transaction.getSyntheticLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"pool_uid" query must be an array.'
            );
        });

        it('Throws an error if "synthetic_account_uid" query is not an array', () => {
            const query = { synthetic_account_uid: '' };
            const promise = rizeClient.transaction.getSyntheticLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"synthetic_account_uid" query must be an array.'
            );
        });

        it('Throws an error if "transaction_uid" query is not an array', () => {
            const query = { transaction_uid: '' };
            const promise = rizeClient.transaction.getSyntheticLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"transaction_uid" query must be an array.'
            );
        });

        it('Throws an error if "status" query is not an array of valid values', () => {
            const query = { status: null };
            const promise = rizeClient.transaction.getSyntheticLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"status" query must be an array. Accepted values inside the array are: begun | failed | in_progress | settled'
            );
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.transaction.getSyntheticLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"limit" query must be an integer.'
            );
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.transaction.getSyntheticLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"offset" query must be an integer.'
            );
        });

        it('Throws an error if "sort" query is not on the sort options', () => {
            const query = { sort: null };
            const promise = rizeClient.transaction.getSyntheticLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"sort" query must be a string. Accepted values are: created_at_asc | created_at_desc | description_asc | description_desc | settled_index_asc | settled_index_desc | us_dollar_amount_asc | us_dollar_amount_desc'
            );
        });

        it('Retrieves the synthetic line item list without query', async () => {
            const syntheticLineItemList =
        await rizeClient.transaction.getSyntheticLineItemList();
            testSyntheticLineItem = syntheticLineItemList.data[0];
            utils.expectRizeList(syntheticLineItemList);
        });

        it('Retrieves the synthetic line item list with query', async () => {
            const query = {
                customer_uid: ['customer_uid1', 'customer_uid2'],
                pool_uid: ['pool_uid1', 'pool_uid2'],
                synthetic_account_uid: [
                    'synthetic_account_uid1',
                    'synthetic_account_uid2',
                ],
                limit: 50,
                offset: 0,
                transaction_uid: ['transaction_uid1', 'transaction_uid2'],
                status: ['settled'],
                sort: 'created_at_asc',
            };
            const syntheticLineItemList =
        await rizeClient.transaction.getSyntheticLineItemList(query);
            utils.expectRizeList(syntheticLineItemList);
        });
    });

    describe('getSyntheticLineItem', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.transaction.getSyntheticLineItem('');
            return expect(promise).to.eventually.be.rejectedWith(
                'Synthetic Line Item "uid" is required.'
            );
        });

        it('Retrieves synthetic line item data successfully', async () => {
            const syntheticLineItem =
        await rizeClient.transaction.getSyntheticLineItem(
            testSyntheticLineItem.uid
        );
            expect(syntheticLineItem)
                .to.have.property('uid')
                .that.equals(testSyntheticLineItem.uid);
        });
    });

    describe('getCustodialLineItemList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.transaction.getCustodialLineItemList('');
            return expect(promise).to.eventually.be.rejectedWith(
                '"query" must be a CustodialLineItemListQuery object.'
            );
        });

        it('Throws an error if "customer_uid" query is not an array', () => {
            const query = { customer_uid: '' };
            const promise = rizeClient.transaction.getCustodialLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"customer_uid" query must be an array.'
            );
        });

        it('Throws an error if "custodial_account_uid" query is not an array', () => {
            const query = { custodial_account_uid: '' };
            const promise = rizeClient.transaction.getCustodialLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"custodial_account_uid" query must be an array.'
            );
        });

        it('Throws an error if "status" query is not an array of valid values', () => {
            const query = { status: null };
            const promise = rizeClient.transaction.getCustodialLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"status" query must be an array. Accepted values inside the array are: settled | voided'
            );
        });

        it('Throws an error if "transaction_event_uid" query is not an array', () => {
            const query = { transaction_event_uid: '' };
            const promise = rizeClient.transaction.getCustodialLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"transaction_event_uid" query must be an array.'
            );
        });

        it('Throws an error if "transaction_uid" query is not an array', () => {
            const query = { transaction_uid: '' };
            const promise = rizeClient.transaction.getCustodialLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"transaction_uid" query must be an array.'
            );
        });

        it('Throws an error if "limit" query is not an integer', () => {
            const query = { limit: 1.5 };
            const promise = rizeClient.transaction.getCustodialLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"limit" query must be an integer.'
            );
        });

        it('Throws an error if "offset" query is not an integer', () => {
            const query = { offset: 1.5 };
            const promise = rizeClient.transaction.getCustodialLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"offset" query must be an integer.'
            );
        });

        it('Throws an error if "sort" query is not on the sort options', () => {
            const query = { sort: null };
            const promise = rizeClient.transaction.getCustodialLineItemList(query);
            return expect(promise).to.eventually.be.rejectedWith(
                '"sort" query must be a string. Accepted values are: created_at_asc | created_at_desc | description_asc | description_desc | settled_index_asc | settled_index_desc | us_dollar_amount_asc | us_dollar_amount_desc'
            );
        });

        it('Retrieves the custodial line item list without query', async () => {
            const custodialLineItemList =
        await rizeClient.transaction.getCustodialLineItemList();
            testCustodialLineItem = custodialLineItemList.data[0];
            utils.expectRizeList(custodialLineItemList);
        });

        it('Retrieves the custodial line item list with query', async () => {
            const query = {
                customer_uid: ['customer_uid1', 'customer_uid2'],
                custodial_account_uid: [
                    'custodial_account_uid1',
                    'custodial_account_uid2',
                ],
                status: ['settled'],
                us_dollar_amount_max: 100,
                us_dollar_amount_min: 10,
                transaction_event_uid: [
                    'transaction_event_uid1',
                    'transaction_event_uid2',
                ],
                transaction_uid: ['transaction_uid1', 'transaction_uid2'],
                limit: 50,
                offset: 0,
                sort: 'created_at_asc',
            };
            const custodialLineItemList =
        await rizeClient.transaction.getCustodialLineItemList(query);
            utils.expectRizeList(custodialLineItemList);
        });
    });

    describe('getCustodialLineItem', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.transaction.getCustodialLineItem('');
            return expect(promise).to.eventually.be.rejectedWith(
                'Custodial Line Item "uid" is required.'
            );
        });

        it('Retrieves custodial line item data successfully', async () => {
            const custodialLineItem =
        await rizeClient.transaction.getCustodialLineItem(
            testCustodialLineItem.uid
        );
            expect(custodialLineItem)
                .to.have.property('uid')
                .that.equals(testCustodialLineItem.uid);
        });
    });
});
