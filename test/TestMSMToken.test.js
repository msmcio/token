const assertRevert = require('./helpers/assertRevert');
const MSMToken = artifacts.require("MSMToken");

contract('MSMToken', async ([owner]) => {

    const TOTAL_SUPPLY = 12000;

    before(async () => {
        this.token = await MSMToken.new();
    });

    it("total supply should be 12000", async () => {

        let totalSupply = await this.token.totalSupply.call();

        assert.equal(totalSupply.toNumber(), TOTAL_SUPPLY);
    });

    it("the owner balance", async () => {

        let balance = await this.token.balanceOf.call(owner);

        assert.equal(balance.toNumber(), TOTAL_SUPPLY);
    });

});