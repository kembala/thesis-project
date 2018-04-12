var SaleContract = artifacts.require("./SaleContract.sol");

contract('SaleContract', function (accounts) {
    var saleContract;
    var contractId;

    var expectedQuantity = 1;
    var buyerAddress = accounts[0];
    var sellerAddress = accounts[1];

    it("should create e-contract with caller as buyer and  " + accounts[1] + " as seller", function () {
        return SaleContract.deployed().then(function (instance) {
            saleContract = instance;
            return saleContract.createContract.call(accounts[1],{from: buyerAddress}); // call() does not save state
        }).then(function (_contractId) {
            contractId = _contractId.toNumber();
            return saleContract.createContract(accounts[1],{from: buyerAddress}); // without call() state will be updated
        }).then(function () {
            return saleContract.getContractParticipants(contractId);
        }).then(function (participants) {
            assert.equal(participants[1], sellerAddress, "Seller mismatch");
            assert.equal(participants[0], buyerAddress, "Buyer mismatch");
        });
    });

    it("should block seller from quantifying the e-contract", function () {
        return SaleContract.deployed().then(function (instance) {
            saleContract = instance;
            return saleContract.quantify(contractId, expectedQuantity, {from: sellerAddress});
        }).then(function () {
            return saleContract.getContractValues(contractId, {from: sellerAddress}); // without call() state will be updated
        }).then(function (r) {
                assert(false, 'Seller shouldn\'t be able to quantify');
                return true;
            },
            function (e) {
                return true;
            });
    });

    it("should allow buyer to quantify the e-contract", function () {
        return SaleContract.deployed().then(function (instance) {
            saleContract = instance;
            return saleContract.quantify(contractId,expectedQuantity,{from: buyerAddress});
        }).then(function () {
            return saleContract.getContractValues(contractId,{from: buyerAddress}); // without call() state will be updated
        }).then(function (values) {
            assert.equal(values[0], expectedQuantity, "Buyer should be able to set quantity");
        });
    });

});
