const chai = require('chai');
const expect = chai.expect;
const querystring = require('query-string');

const isObject = item => !!item && item.constructor === Object;
const isString = item => typeof item === 'string' || item instanceof String;

const toQueryString = (object, allowedParameters = []) => {
    let queryObject = object;

    if (allowedParameters && Array.isArray(allowedParameters) && allowedParameters.length > 0) {
        queryObject = Object.keys(object)
            .filter(key => allowedParameters.includes(key))
            .reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: object[key]
                };
            }, {});
    }

    const queryString = '?' + querystring.stringify(queryObject, { arrayFormat: 'bracket' });
    return queryString;
};

const test = {
    expectRizeList: (list) => {
        expect(list).to.have.property('total_count').to.be.a('number');
        expect(list).to.have.property('count').to.be.a('number');
        expect(list).to.have.property('limit').to.be.a('number');
        expect(list).to.have.property('offset').to.be.a('number');
        expect(list).to.have.property('data').to.be.an('array');
    },
};

const utils = {
    isObject,
    isString,
    toQueryString,
    test,
};

module.exports = utils;