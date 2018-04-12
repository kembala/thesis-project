var SaleContract = artifacts.require("./SaleContract.sol");

module.exports = function (deployer) {
    deployer.deploy(SaleContract);
};
