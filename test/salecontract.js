var SaleContract = artifacts.require("./SaleContract.sol");

contract('SaleContract', function (accounts) {

    it("...should create e-contract with caller as buyer and  " + accounts[1] + " as seller", function () {
        var saleContract;

        return SaleContract.deployed().then(function (instance) {
            saleContract = instance;
            return saleContract.createContract.call(accounts[1],{from: accounts[0]});
        }).then(function (result) {
            var contractId = result.toString();
            console.log(contractId);
            //assert.equal(contractId, "0", "The e-contract was not created");
            return saleContract.getContracts();
        }).then(function (contracts) {
            console.log(contracts);
        })
        /*
            return saleContract.getContractParticipants.call(0);
        }).then(function (participants) {
            assert.equal(participants.seller.toNumber(), accounts[1], "Seller mismatch");
            assert.equal(participants.buyer.toNumber(), accounts[0], "Buyer mismatch");
        });*/
    });

});
