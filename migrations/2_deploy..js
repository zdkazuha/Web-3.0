var contract = artifacts.require("./lottery.sol");

module.exports = function (deployer) {
    deployer.deploy(contract);
};