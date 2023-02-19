const Contracts = artifacts.require("StudentListStorage.sol")

module.exports = async function(callback) {
    const studentStorage = await Contracts.deployed()
    await studentStorage.addList("zzd", 100)
    let res = await studentStorage.getList();
    console.log(res)
    console.log(await studentStorage.StudentList(0));
    callback()
}