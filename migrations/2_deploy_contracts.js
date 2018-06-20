var MSMToken = artifacts.require("./MSMToken.sol");

module.exports = function (deployer) {
    deployer.deploy(MSMToken);
};