pragma solidity ^0.4.18;


import "./libs/strings.sol";


/// Digital sale e-contract manager
contract SaleContract {
    using strings for *;

    /* E-contract text template with the tempate variables packed inside as <variable_name> */
    string contractTemplate;

    // Container for digital contrats
    DigitalContract[] contracts;

    // Map to find related contracts
    mapping (address => uint[]) participatedContracts;

    /// Fulfilment state of the digital sale contract
    enum State {Empty, Request, Proposal, Agreement, Fail, Initiated}

    // Variables for individual e-contract instances
    struct DigitalContract {
        /* Required fields */
        address buyerAddress;
        address sellerAddress;
        State state;

        /* Request data */
        uint quantity;

        /* Proposal data */
        uint unitPrice;
        string deliveryDate;
        string returnPolicy;
        uint deposit;
        string freight;
        string insurance;

        /* Fail data */
        string comment;
    }

    /// Function modifier to ensure state transitions
    modifier onlyInState (uint _contractID, State _state) {
        require(contracts[_contractID].state == _state);
        _;
    }

    /// Function modifier to ensure buyer is calling
    modifier onlyBuyer (uint _contractID){
        require(contracts[_contractID].buyerAddress == msg.sender);
        _;
    }

    /// Function modifier to ensure seller is calling
    modifier onlySeller (uint _contractID){
        require(contracts[_contractID].buyerAddress == msg.sender);
        _;
    }

    /* Constructor */
    function SaleContract() public {
        // Mock e-contract template
        contractTemplate = "Sales Agreement between <sellerAddress> (as seller) and <buyerAddress> (as buyer). Buyer agrees to purchase <quantity> pieces of equipment at a(n) <unitPrice> price per unit with a pre-paid deposit of <deposit>. Seller agrees to ship goods via <freight> by the time <deliveryDate>. If the following statement holds, the buyer has the opportunity to get a refund: <returnPolicy>. For the quality of the item an insurance is in place: <insurance>";
    }

    /* Create sale e-contract instance with the transaction sender as buyer */
    function createContract(address _sellerAddres) external returns (uint _contractID){

        // Initialize digital contract
        contracts.push(DigitalContract(msg.sender, _sellerAddres, State.Empty, 0, 0, "", "", 0, "", "", ""));
        // Struct values in respective order

        // Obtain ID as current max ID
        _contractID = contracts.length - 1;

        // Create participant mappings
        participatedContracts[msg.sender].push(_contractID);
        participatedContracts[_sellerAddres].push(_contractID);

        // Return ID
        return _contractID;
    }

    // Get transaction sender related e-contracts
    function getContracts() external view returns (uint[] _contractID){
        return participatedContracts[msg.sender];
    }

    /* Get participant for a given e-contract instance */
    function getContractParticipants(uint _contractID) external view returns (
    address buyerAddress,
    address sellerAddress
    ) {
        buyerAddress = contracts[_contractID].buyerAddress;
        sellerAddress = contracts[_contractID].sellerAddress;
    }

    /* Get e-contract state for a given contract ID */
    function getContractState(uint _contractID) external view returns (
        State state
    ) {
        state = contracts[_contractID].state;
    }

    /* Get e-contract details for a given contract ID */
    function getContractValues(uint _contractID) external view returns (
    uint quantity,
    uint unitPrice,
    string deliveryDate,
    string returnPolicy,
    uint deposit,
    string freight,
    string insurance,
    string comment
    ) {
        quantity = contracts[_contractID].quantity;
        unitPrice = contracts[_contractID].unitPrice;
        deliveryDate = contracts[_contractID].deliveryDate;
        returnPolicy = contracts[_contractID].returnPolicy;
        deposit = contracts[_contractID].deposit;
        freight = contracts[_contractID].freight;
        insurance = contracts[_contractID].insurance;
        comment = contracts[_contractID].comment;
    }

    /* Export e-contract text with the enfilled template variables for a given e-contract instance */
    function exportContract(uint _contractID) external view returns (string exportedContract) {
        strings.slice memory template = contractTemplate.toSlice();
        strings.slice memory part;
        strings.slice memory export;

        template.split("<sellerAddress>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(toAsciiString(contracts[_contractID].sellerAddress).toSlice()).toSlice();

        template.split("<buyerAddress>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(toAsciiString(contracts[_contractID].buyerAddress).toSlice()).toSlice();

        template.split("<quantity>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(uintToString(contracts[_contractID].quantity).toSlice()).toSlice();

        template.split("<unitPrice>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(uintToString(contracts[_contractID].unitPrice).toSlice()).toSlice();

        template.split("<deposit>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(uintToString(contracts[_contractID].deposit).toSlice()).toSlice();

        template.split("<freight>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(contracts[_contractID].freight.toSlice()).toSlice();

        template.split("<deliveryDate>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(contracts[_contractID].deliveryDate.toSlice()).toSlice();

        template.split("<returnPolicy>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(contracts[_contractID].returnPolicy.toSlice()).toSlice();

        template.split("<insurance>".toSlice(), part);
        export = export.concat(part).toSlice();
        export = export.concat(contracts[_contractID].insurance.toSlice()).toSlice();

        return export.toString();
    }

    function quantify(uint _contractID, uint _quantity) external onlyBuyer(_contractID) onlyInState(_contractID, State.Empty) {
        DigitalContract storage digitalContract = contracts[_contractID];

        digitalContract.quantity = _quantity;
        digitalContract.state = State.Request;

        // Raise event
        OfferRequested(_contractID);
    }

    function propose(
    uint _contractID,
    uint _unitPrice,
    string _deliveryDate,
    string _returnPolicy,
    uint _deposit,
    string _freight,
    string _insurance
    ) external onlySeller(_contractID) onlyInState(_contractID, State.Request) {
        DigitalContract storage digitalContract = contracts[_contractID];

        digitalContract.unitPrice = _unitPrice;
        digitalContract.deliveryDate = _deliveryDate;
        digitalContract.returnPolicy = _returnPolicy;
        digitalContract.deposit = _deposit;
        digitalContract.freight = _freight;
        digitalContract.insurance = _insurance;

        digitalContract.state = State.Proposal;

        // Raise event
        OfferArrived(_contractID);
    }

    function commentDecline(
    uint _contractID,
    string _comment
    ) external onlyBuyer(_contractID) onlyInState(_contractID, State.Proposal) {
        DigitalContract storage digitalContract = contracts[_contractID];

        digitalContract.comment = _comment;
        digitalContract.state = State.Fail;

        // Raise event
        ProposalDeclined(_contractID);
    }

    function sign(uint _contractID) external onlyBuyer(_contractID) onlyInState(_contractID, State.Proposal) {
        DigitalContract storage digitalContract = contracts[_contractID];

        digitalContract.state = State.Agreement;

        // Raise event
        ProposalSigned(_contractID);
    }

    function initiateSale(uint _contractID) external onlySeller(_contractID) onlyInState(_contractID, State.Agreement) {
        DigitalContract storage digitalContract = contracts[_contractID];

        digitalContract.state = State.Initiated;

        // Raise event
        SaleInitiated(_contractID);
    }

    function withdrawOffer(uint _contractID) external onlySeller(_contractID) onlyInState(_contractID, State.Fail) {
        // DigitalContract storage digitalContract =  contracts[_contractID];

        // TODO: implement

        // Raise event
        OfferWithdrawed(_contractID);
    }

    // Contract enfillment events (Possible issue with events sent to all subscribers)

    event OfferRequested(uint _contractId);

    event OfferArrived(uint _contractId);

    event ProposalSigned(uint _contractId);

    event ProposalDeclined(uint _contractId);

    event SaleInitiated(uint _contractId);

    event OfferWithdrawed(uint _contractId);

    /* Source: https://ethereum.stackexchange.com/a/8447 */

    function toAsciiString(address x) internal pure returns (string) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(x) / (2 ** (8 * (19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    }

    function char(byte b) internal pure returns (byte c) {
        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }

    /* Source: https://ethereum.stackexchange.com/a/10929 */

    function uintToString(uint v) internal pure returns (string str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(48 + remainder);
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }
        str = string(s);
    }
}