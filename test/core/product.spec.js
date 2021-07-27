'use strict';

const utils = require('../../lib/test-utils');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

const rizeClient = require('../helpers/rizeClient');

describe('Product', () => {
    let testProduct;

    describe('getList', async () => {
        it('Throws an error if "query" is invalid', () => {
            const promise = rizeClient.product.getList('');
            return expect(promise).to.eventually.be.rejectedWith('"query" must be a ProductListQuery object.');
        });

        it('Retrieves the product list without query', async () => {
            const productList = await rizeClient.product.getList();
            testProduct = productList.data[0];
            utils.expectRizeList(productList);
        });

        it('Retrieves the product list with query', async () => {
            const query = {
                limit: 2
            };
            const productList = await rizeClient.product.getList(query);
            utils.expectRizeList(productList);
        });
    });

    describe('get', () => {
        it('Throws an error if "uid" is empty', () => {
            const promise = rizeClient.product.get('');
            return expect(promise).to.eventually.be.rejectedWith('Product "uid" is required.');
        });

        it('Retrieves product data successfully', async () => {
            const product = await rizeClient.product.get(testProduct.uid);
            expect(product).to.have.property('uid').that.equals(testProduct.uid);
        });
    });

    after(() => {
        process.env.TEST_PRODUCT_UID = testProduct.uid;
        process.env.TEST_PRODUCT_COMPLIANCE_PLAN_UID = testProduct.product_compliance_plan_uid;
    });
});
