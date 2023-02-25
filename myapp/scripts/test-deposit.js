const DanToken = artifacts.require("DanToken.sol")
const Exchange = artifacts.require("Exchange.sol")
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const fromWei = (bn) => {
    return web3.utils.fromWei(bn, "ether");
}

const toWei = (number) => {
    return web3.utils.toWei(number.toString(), "ether");
}

module.exports = async function(callback) {
    const danToken = await DanToken.deployed();
    const exchange = await Exchange.deployed();
    const accounts = await web3.eth.getAccounts();

    await exchange.depositEther({
        from: accounts[0],
        value: toWei(10)
    })
    const res1 = await exchange.tokens(ETHER_ADDRESS, accounts[0])
    console.log(fromWei(res1))

    // 授权
    await danToken.approve(exchange.address, toWei(100000), {
        from: accounts[0]
    });

    await exchange.depositToken(danToken.address, toWei(100000), {
        from: accounts[0]
    });

    const res = await exchange.tokens(danToken.address, accounts[0])
    console.log(fromWei(res))

    callback()
}