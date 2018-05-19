import React, {Component} from 'react'
import getWeb3 from './../utils/getWeb3'
import 'react-select/dist/react-select.css'
import AddressSelector from "./AddressSelector";
import SaleContract from './../../build/contracts/SaleContract.json'

class ContractCreator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            web3: null,
            sellerAddress: null
        };
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                });
            })
            .catch((e) => {
                console.log('Error finding web3. ' + e)
            })
    }

    sellerAddressChange = (address) => {
        this.setState({sellerAddress: address.value});
        console.log(`Seller address: ${address.label}`)
    };

    createContract = () => {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);
        let contractInstance;
        let contractId;

        saleContract.deployed().then((instance) => {
            contractInstance = instance;
            return contractInstance.createContract.call(this.state.sellerAddress, {
                from: this.props.selectedAddress,
                gas: 3000000
            });
        }).then((result) => {
            contractId = result.toNumber();
            return contractInstance.createContract(this.state.sellerAddress, {
                from: this.props.selectedAddress,
                gas: 3000000
            });
        }).then((result) => {
            console.log(`E-contract created with {id: ${contractId}}`);
        });
    };

    render() {
        return (
            <div>
                <label>Select seller address</label>
                <AddressSelector
                    onChange={this.sellerAddressChange}
                />
                <button className="btn btn-primary mt-2" onClick={this.createContract}>Create</button>
            </div>
        )
    }
}

export default ContractCreator
