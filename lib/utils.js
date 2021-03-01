const querystring = require('query-string');

const isObject = item => !!item && item.constructor === Object;
const isString = item => typeof item === 'string' || item instanceof String;
const isBoolean = item => item === true || item === false;

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

const utils = {
    isObject,
    isString,
    isBoolean,
    toQueryString,
};

module.exports = utils;