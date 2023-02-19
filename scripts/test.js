const Contracts = artifacts.require("StudentStorage.sol")

module.exports = async function(callback) {
    const studentStorage = await Contracts.deployed()
    await studentStorage.setData("zzd", 101)
    const res = await studentStorage.getData()
    console.log(res)
    callback()
}