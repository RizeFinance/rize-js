'use strict';

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const mlog = require('mocha-logger');

const rizeClient = require('../helpers/rizeClient');

describe('Product', () => {
    let testCustomerProduct;
    let customerUid;
    let productUid;
    let customerPoolUid;

    const verifyNewCustomerProduct = (customerProduct, customerUid, productUid) => {
        expect(customerProduct).to.have.property('uid').that.is.not.empty;
        expect(customerProduct).to.have.property('customer_uid').that.equals(customerUid);
        expect(customerProduct).to.have.property('product_uid').that.equals(productUid);
    };

    before(async () => {
        customerUid = process.env.TEST_CUSTOMER_UID;
        productUid = process.env.TEST_PRODUCT_UID;
    });

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.customerProduct.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a CustomerProductListQuery object.');
        });

        it('Throws an error if "customer_uid" query parameter is invalid', () => {
            const promise = rizeClient.customerProduct.getList({ customer_uid: 'abc' });
            return expect(promise).to.eventually.be.rejectedWith('"customer_uid" query must be an array.');
        });

        it('Throws an error if "product_uid" query parameter is invalid', () => {
            const promise = rizeClient.customerProduct.getList({ product_uid: 123 });
            return expect(promise).to.eventually.be.rejectedWith('"product_uid" query must be a string.');
        });

        it('Retrieves the customer product list without query', async () => {
            const customerProductList = await rizeClient.customerProduct.getList();
            testCustomerProduct = customerProductList.data[0];
            utils.expectRizeList(customerProductList);
        });

        it('Retrieves the product list with query', async () => {
            const query = {
                customer_uid: [customerUid],
                product_uid: productUid,
                kyc_status: 'approved',
                limit: 2
            };
            const customerProductList = await rizeClient.customerProduct.getList(query);
            utils.expectRizeList(customerProductList);
        });
    });

    describe('create', () => {
        it('Throws an error if customer "uid" is empty', () => {
            const promise = rizeClient.customerProduct.create('', '');
            return expect(promise).to.eventually.be.rejectedWith('Customer "uid" is required.');
        });

        it('Throws an error if product "uid" is empty', () => {
            const promise = rizeClient.customerProduct.create('test', '');
            return expect(promise).to.eventually.be.rejectedWith('Product "uid" is required.');
        });

        it('Creates a new customer product', async () => {
            const customerProduct = await rizeClient.customerProduct.create(customerUid, productUid);
            
            verifyNewCustomerProduct(customerProduct, customerUid, productUid);

            const customer = await rizeClient.customer.get(customerUid);
            customerPoolUid = customer.pool_uids[0];

            mlog.log(`New Customer Product UID: ${customerProduct.uid} -- Status: ${customerProduct.status}`);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.customerProduct.get('');
            return expect(promise).to.eventually.be.rejectedWith('Customer Product "uid" is required.');
        });

        it('Retrieves customer product data successfully', async () => {
            const customerProduct = await rizeClient.customerProduct.get(testCustomerProduct.uid);
            expect(customerProduct).to.have.property('uid').that.equals(testCustomerProduct.uid);
        });
    });

   
    after(() => {
        process.env.TEST_CUSTOMER_POOL_UID = customerPoolUid;
    });
});
