const Contracts = artifacts.require("DanToken.sol");

module.exports = function (deployer) {
    deployer.deploy(Contracts);
}