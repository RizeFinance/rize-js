const chai = require('chai');
const expect = chai.expect;

const expectRizeList= (list) => {
    expect(list).to.have.property('total_count').to.be.a('number');
    expect(list).to.have.property('count').to.be.a('number');
    expect(list).to.have.property('limit').to.be.a('number');
    expect(list).to.have.property('offset').to.be.a('number');
    expect(list).to.have.property('data').to.be.an('array');
};

const testUtils = {
    expectRizeList,
};

module.exports = testUtils;