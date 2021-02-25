const chai = require('chai');
const expect = chai.expect;

const utils = {
    isObject: item => !!item && item.constructor === Object,
    isString: item => typeof item === 'string' || item instanceof String,
    isBoolean: item => item === true || item === false,
    filterObjectByKeys: (object, acceptedKeys) => {
        return Object.keys(object)
            .filter(key => acceptedKeys.includes(key))
            .reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: object[key]
                };
            }, {});
    },
    test: {
        expectRizeList: (list) => {
            expect(list).to.have.property('total_count').to.be.a('number');
            expect(list).to.have.property('count').to.be.a('number');
            expect(list).to.have.property('limit').to.be.a('number');
            expect(list).to.have.property('offset').to.be.a('number');
            expect(list).to.have.property('data').to.be.an('array');
        },
    },
};

module.exports = utils;