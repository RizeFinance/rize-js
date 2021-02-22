const utils = {
    isObject: item => !!item && item.constructor === Object,
    isString: item => typeof item === 'string' || item instanceof String,
};

module.exports = utils;