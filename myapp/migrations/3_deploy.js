const DanToken = artifacts.require("DanToken.sol");
const Exchange = artifacts.require("Exchange.sol");

module.exports = async function (deployer) {
    const accounts = await web3.eth.getAccounts()
    await deployer.deploy(DanToken);
    await deployer.deploy(Exchange, accounts[2], 10);
}