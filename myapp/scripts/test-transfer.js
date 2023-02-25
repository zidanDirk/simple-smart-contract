const DanToken = artifacts.require("DanToken.sol")

const fromWei = (bn) => {
    return web3.utils.fromWei(bn, "ether");
}

const toWei = (number) => {
    return web3.utils.toWei(number.toString(), "ether");
}

module.exports = async function(callback) {
    const fromAdderss = "0xE92Dd3bf59E782dB51b1551440EB3ebacAD44F60"
    const toAddress = "0xeC0a8E9752c8746b5E6504632a1C24c30C86775D"
    const danToken = await DanToken.deployed();
    let balanceOfRes = await danToken.balanceOf(fromAdderss)
    console.log(`balanceOfRes of firstCount before transfer`, fromWei(balanceOfRes))
    await danToken.transfer(toAddress, toWei(10000), {
        from: fromAdderss
    })

    balanceOfRes = await danToken.balanceOf(fromAdderss)
    console.log(`balanceOfRes of firstCount after transfer`, fromWei(balanceOfRes))

    secondBalanceOfRes = await danToken.balanceOf(toAddress)
    console.log(`balanceOfRes of secondCount after transfer`, fromWei(secondBalanceOfRes))
    callback()
}