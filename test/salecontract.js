var SaleContract = artifacts.require("./SaleContract.sol");

contract('SaleContract', function (accounts) {

    it("...should create e-contract with caller as buyer and  " + accounts[1] + " as seller", function () {
        var saleContract;

        return SaleContract.deployed().then(function (instance) {
            saleContract = instance;
            return saleContract.createContract(accounts[1],{from: accounts[0]});
        }).then(function () {
            return saleContract.getContractParticipants(0);
        }).then(function (participants) {
            assert.equal(participants[1], accounts[1], "Seller mismatch");
            assert.equal(participants[0], accounts[0], "Buyer mismatch");
        });
    });

});
