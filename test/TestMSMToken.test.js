var MSMToken = artifacts.require("MSMToken");

contract('MSMToken', async ([_, owner, recipient, anotherAccount]) => {

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    it("total supply should be 12000", async () => {
        let instance = await MSMToken.deployed();
        let totalSupply = await instance.totalSupply();

        assert.equal(totalSupply.valueOf(), 12000);
    });

});