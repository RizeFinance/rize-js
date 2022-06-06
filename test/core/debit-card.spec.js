'use strict';

require('./customer-product.spec');
require('./pool.spec');

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { faker } = require('@faker-js/faker');

chai.use(chaiAsPromised);
const expect = chai.expect;
const rizeClient = require('../helpers/rizeClient');
const delayAsync = require('../helpers/delayAsync');

describe('DebitCards', () => {
  let customerUid;
  let customerPoolUid;
  let testDebitCard;

  before(() => {
    customerUid = process.env.TEST_CUSTOMER_UID;
    customerPoolUid = process.env.TEST_CUSTOMER_POOL_UID;
  });

  describe('getList', () => {
    it('Throws an error if "query" is invalid', async () => {
      const promise = rizeClient.debitCard.getList('');
      return expect(promise).to.eventually.be.rejectedWith(
        '"query" must be a DebitCardListQuery object.'
      );
    });

    it('Throws an error if "customer_uid" query is not an array', async () => {
      const query = { customer_uid: '' };
      const promise = rizeClient.debitCard.getList(query);
      return expect(promise).to.eventually.be.rejectedWith(
        '"customer_uid" query must be an array.'
      );
    });

    it('Throws an error if "pool_uid" query is not an array', async () => {
      const query = { pool_uid: '' };
      const promise = rizeClient.debitCard.getList(query);
      return expect(promise).to.eventually.be.rejectedWith(
        '"pool_uid" query must be an array.'
      );
    });

    it('Throws an error if "limit" query is not an integer', async () => {
      const query = { limit: 1.5 };
      const promise = rizeClient.debitCard.getList(query);
      return expect(promise).to.eventually.be.rejectedWith(
        '"limit" query must be an integer.'
      );
    });

    it('Throws an error if "offset" query is not an integer', async () => {
      const query = { offset: 1.5 };
      const promise = rizeClient.debitCard.getList(query);
      return expect(promise).to.eventually.be.rejectedWith(
        '"offset" query must be an integer.'
      );
    });

    it('Throws an error if "locked" query is not boolean', async () => {
      const query = { locked: 'true' };
      const promise = rizeClient.debitCard.getList(query);
      return expect(promise).to.eventually.be.rejectedWith(
        '"locked" query must be boolean.'
      );
    });

    it('Throws an error if "status" query is not an array', async () => {
      const query = { status: '' };
      const promise = rizeClient.debitCard.getList(query);
      return expect(promise).to.eventually.be.rejectedWith(
        '"status" query must be an array. Accepted values inside the array are: queued | issued | printing_physical_card | printing_physical_card_replacement | card_replacement_shipped | shipped | usable_without_pin | normal | closed | damaged | lost | stolen | administrative_lock | closed_by_administrator | card_replacement_shipment_returned | shipment_returned'
      );
    });

    it('Throws an error if "status" query is not an array of valid values', async () => {
      const query = { status: [''] };
      const promise = rizeClient.debitCard.getList(query);
      return expect(promise).to.eventually.be.rejectedWith(
        'Accepted values in the "status" query are: queued | issued | printing_physical_card | printing_physical_card_replacement | card_replacement_shipped | shipped | usable_without_pin | normal | closed | damaged | lost | stolen | administrative_lock | closed_by_administrator | card_replacement_shipment_returned | shipment_returned'
      );
    });

    it('Retrieves the debitCard list without query', async () => {
      const debitCardList = await rizeClient.debitCard.getList();
      return utils.expectRizeList(debitCardList);
    }).timeout(10000);

    it('Retrieves the debitCard list with query', async () => {
      const query = {
        customer_uid: [customerUid],
        limit: 50,
        offset: 0,
        pool_uid: [customerPoolUid],
        locked: false,
      };
      const debitCardList = await rizeClient.debitCard.getList(query);
      testDebitCard = debitCardList.data[0];

      utils.expectRizeList(debitCardList);
    });
  });

  describe('Physical Card', function () {
    before(function () {
      if (testDebitCard && testDebitCard.type === 'virtual') {
        this.skip();
      }
    });

    describe('Create Debit Card', () => {
      it('Throws an error if "customerUid" is empty', () => {
        const promise = rizeClient.debitCard.create('test', '');
        return expect(promise).to.eventually.be.rejectedWith(
          '"customerUid" is required.'
        );
      });

      it('Throws an error if "poolUid" is empty', () => {
        const promise = rizeClient.debitCard.create('test', 'test', '');
        return expect(promise).to.eventually.be.rejectedWith(
          '"poolUid" is required.'
        );
      });

      it('Throws an error if "street1" is empty when shippingAddress is supplied', () => {
        const promise = rizeClient.debitCard.create('test', 'test', 'test', {
          street1: '',
        });
        return expect(promise).to.eventually.be.rejectedWith(
          '"shippingAddress.street1" is required if "shippingAddress" is supplied.'
        );
      });

      it('Throws an error if "city" is empty when shippingAddress is supplied', () => {
        const promise = rizeClient.debitCard.create('test', 'test', 'test', {
          street1: 'test',
          city: '',
        });
        return expect(promise).to.eventually.be.rejectedWith(
          '"shippingAddress.city" is required if "shippingAddress" is supplied.'
        );
      });

      it('Throws an error if "state" is empty when shippingAddress is supplied', () => {
        const promise = rizeClient.debitCard.create('test', 'test', 'test', {
          street1: 'test',
          city: 'test',
          state: '',
        });
        return expect(promise).to.eventually.be.rejectedWith(
          '"shippingAddress.state" is required if "shippingAddress" is supplied.'
        );
      });

      it('Throws an error if "postal_code" is empty when shippingAddress is supplied', () => {
        const promise = rizeClient.debitCard.create('test', 'test', 'test', {
          street1: 'test',
          city: 'test',
          state: 'test',
          postal_code: '',
        });
        return expect(promise).to.eventually.be.rejectedWith(
          '"shippingAddress.postal_code" is required if "shippingAddress" is supplied.'
        );
      });

      it('Creates debit card successfully', async () => {
        const externalUid = faker.datatype.uuid();
        const createdDebit = await rizeClient.debitCard.create(
          externalUid,
          customerUid,
          customerPoolUid
        );

        testDebitCard = createdDebit;

        expect(createdDebit).to.have.property('uid');

        expect(createdDebit)
          .to.have.property('external_uid')
          .that.equals(externalUid);

        expect(createdDebit)
          .to.have.property('customer_uid')
          .that.equals(customerUid);
        expect(createdDebit)
          .to.have.property('pool_uid')
          .that.equals(customerPoolUid);

        expect(createdDebit).to.have.property('type').that.equals('physical');
      });
    });

    describe('Physical Card - Acquiring Card Image', () => {
      let accessToken;

      it('Access Token - Throws an error if "uid" is empty', () => {
        const promise = rizeClient.debitCard.getAccessTokenData('');
        return expect(promise).to.eventually.be.rejectedWith(
          'Debit Card "uid" is required.'
        );
      });

      it('Access Token - Fetches successfully', async () => {
        const accessTokenResponse =
          await rizeClient.debitCard.getAccessTokenData(testDebitCard.uid);

        accessToken = accessTokenResponse;

        expect(accessTokenResponse).to.have.property('token');
        expect(accessTokenResponse).to.have.property('config_id');
      });

      it('Get Virtual Card Image - Throws an error if "configId" is empty', () => {
        const promise = rizeClient.debitCard.getVirtualCardImage('', 'token');
        return expect(promise).to.eventually.be.rejectedWith(
          '"configId" is required.'
        );
      });

      it('Get Virtual Card Image - Throws an error if "token" is empty', () => {
        const promise = rizeClient.debitCard.getVirtualCardImage(
          'configId',
          ''
        );
        return expect(promise).to.eventually.be.rejectedWith(
          '"token" is required.'
        );
      });

      it('Get Virtual Card Image - Fetches the Image successfully', async () => {
        const response = await rizeClient.debitCard.getVirtualCardImage(
          accessToken.config_id,
          accessToken.token
        );

        expect(response).to.be.a('string');
      });
    });
  });

  describe('Virtual Card', function () {
    before(function () {
      if (testDebitCard.type !== 'virtual') {
        this.skip();
      }
    });

    describe('Acquiring a Virtual Card Image', () => {
      let accessToken;

      it('Access Token - Throws an error if "uid" is empty', () => {
        const promise = rizeClient.debitCard.getAccessTokenData('');
        return expect(promise).to.eventually.be.rejectedWith(
          'Debit Card "uid" is required.'
        );
      });

      it('Access Token - Fetches successfully', async () => {
        const accessTokenResponse =
          await rizeClient.debitCard.getAccessTokenData(testDebitCard.uid);

        accessToken = accessTokenResponse;

        expect(accessTokenResponse).to.have.property('token');
        expect(accessTokenResponse).to.have.property('config_id');
      });

      it('Get Virtual Card Image - Throws an error if "configId" is empty', () => {
        const promise = rizeClient.debitCard.getVirtualCardImage('', 'token');
        return expect(promise).to.eventually.be.rejectedWith(
          '"configId" is required.'
        );
      });

      it('Get Virtual Card Image - Throws an error if "token" is empty', () => {
        const promise = rizeClient.debitCard.getVirtualCardImage(
          'configId',
          ''
        );
        return expect(promise).to.eventually.be.rejectedWith(
          '"token" is required.'
        );
      });

      it('Get Virtual Card Image - Fetches the Image successfully', async () => {
        const response = await rizeClient.debitCard.getVirtualCardImage(
          accessToken.config_id,
          accessToken.token
        );

        expect(response).to.be.a('string');
      });
    });

    describe('migrateVirtualCard', () => {
      it('Throws an error if "uid" is empty', () => {
        const promise = rizeClient.debitCard.migrateVirtualCard({
          uid: '',
          customerUid: 'customerUid',
          poolUid: 'poolUid',
        });
        return expect(promise).to.eventually.be.rejectedWith(
          'Debit Card "uid" is required.'
        );
      });

      it('Throws an error if "customerUid" is empty', () => {
        const promise = rizeClient.debitCard.migrateVirtualCard({
          uid: 'uid',
          customerUid: '',
          poolUid: 'poolUid',
        });
        return expect(promise).to.eventually.be.rejectedWith(
          '"customerUid" is required.'
        );
      });

      it('Throws an error if "poolUid" is empty', () => {
        const promise = rizeClient.debitCard.migrateVirtualCard({
          uid: 'uid',
          customerUid: 'customerUid',
          poolUid: '',
        });
        return expect(promise).to.eventually.be.rejectedWith(
          '"poolUid" is required.'
        );
      });

      it('Migrates virtual card to physical card successfully', async () => {
        const migratedCard = await rizeClient.debitCard.migrateVirtualCard({
          uid: testDebitCard.uid,
          customerUid: testDebitCard.customer_uid,
          poolUid: testDebitCard.pool_uid,
        });

        expect(migratedCard).to.include({ uid: testDebitCard.uid });
        expect(migratedCard).to.include({
          customer_uid: testDebitCard.customer_uid,
        });
        expect(migratedCard).to.include({ pool_uid: testDebitCard.pool_uid });

        await delayAsync(5000);

        const updatedCard = await rizeClient.debitCard.get(migratedCard.uid);
        expect(updatedCard).to.include({ type: 'physical' });
      }).timeout(10000);
    });
  });

  describe('locking a debit card', () => {
    it('Throws an error if "uid" is empty', () => {
      const promise = rizeClient.debitCard.lock('');
      return expect(promise).to.eventually.be.rejectedWith(
        'Debit Card "uid" is required.'
      );
    });

    it('Throws an error if "lockReason" is empty', () => {
      const promise = rizeClient.debitCard.lock('test', '');
      return expect(promise).to.eventually.be.rejectedWith(
        '"lockReason" is required.'
      );
    });

    it('Locks debit card successfully', async () => {
      const lockReason = 'Fraud detected';
      const updatedDebitCard = await rizeClient.debitCard.lock(
        testDebitCard.uid,
        lockReason
      );
      expect(updatedDebitCard)
        .to.have.property('uid')
        .that.equals(testDebitCard.uid);
      expect(updatedDebitCard)
        .to.have.property('lock_reason')
        .that.equals(lockReason);
      expect(updatedDebitCard).to.have.property('locked_at').that.is.not.empty;
    });
  });

  describe('unlocking a debit card', () => {
    it('Throws an error if "uid" is empty', () => {
      const promise = rizeClient.debitCard.unlock('');
      return expect(promise).to.eventually.be.rejectedWith(
        'Debit Card "uid" is required.'
      );
    });

    it('Unlocks debit card successfully', async () => {
      const updatedDebitCard = await rizeClient.debitCard.unlock(
        testDebitCard.uid
      );

      expect(updatedDebitCard)
        .to.have.property('uid')
        .that.equals(testDebitCard.uid);
      expect(updatedDebitCard).to.have.property('lock_reason').that.is.null;
      expect(updatedDebitCard).to.have.property('locked_at').that.is.null;
    });
  });

  describe('fetching a card', () => {
    it('Throws an error if "uid" is empty', async () => {
      const promise = rizeClient.debitCard.get('');
      return expect(promise).to.eventually.be.rejectedWith(
        'Debit Card "uid" is required.'
      );
    });

    it('fetches debit card data successfully', async () => {
      const debitCard = await rizeClient.debitCard.get(testDebitCard.uid);
      expect(debitCard).to.have.property('uid').that.equals(testDebitCard.uid);
    });
  });

  describe('getPinChangeToken', () => {
    it('Throws an error if "uid" is empty', () => {
      const promise = rizeClient.debitCard.getPinChangeToken('');
      return expect(promise).to.eventually.be.rejectedWith(
        'Debit Card "uid" is required.'
      );
    });

    it('Fetches the Pin Token successfully', async () => {
      const pin = await rizeClient.debitCard.getPinChangeToken(
        testDebitCard.uid
      );
      expect(pin).to.have.property('pin_change_token');
    });
  });

  describe('reissue', () => {
    it('Throws an error if "uid" is empty', () => {
      const promise = rizeClient.debitCard.reissue('');
      return expect(promise).to.eventually.be.rejectedWith(
        'Debit Card "uid" is required.'
      );
    });

    it('Throws an error if "reissueReason" is empty', () => {
      const promise = rizeClient.debitCard.reissue('test', '');
      return expect(promise).to.eventually.be.rejectedWith(
        '"reissueReason" is required.'
      );
    });

    it('Throws an error if "reissueReason" is invalid', () => {
      const promise = rizeClient.debitCard.reissue('test', 'test');
      return expect(promise).to.eventually.be.rejectedWith(
        'Invalid reissueReason. Accepted values are: damaged | lost | stolen'
      );
    });

    it('Reissues debit card successfully', () => {
      const updatedDebitCard = rizeClient.debitCard.reissue(
        testDebitCard.uid,
        'damaged'
      );
      expect(updatedDebitCard)
        .to.eventually.have.property('uid')
        .that.equals(testDebitCard.uid);

      testDebitCard = updatedDebitCard;
    });
  });
});
