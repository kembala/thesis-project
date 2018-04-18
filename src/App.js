import React, {Component} from 'react'
import SaleContract from '../build/contracts/SaleContract.json'
import getWeb3 from './utils/getWeb3'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './css/bootstrap.min.css'
import './App.css'

class App extends Component {
    handleChange = (address) => {
        this.setState({selectedAddress: address.value});
        console.log(`Selected: ${address.label}`);
    }
    createContract = () => {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);
        var contractInstance;
        var contractId;

        saleContract.deployed().then((instance) => {
            contractInstance = instance;
            return contractInstance.createContract.call(this.state.selectedAddress, {
                from: this.state.selectedAddress,
                gas: 3000000
            });
        }).then((result) => {
            contractId = result.toNumber();
            return contractInstance.createContract(this.state.selectedAddress, {
                from: this.state.selectedAddress,
                gas: 3000000
            });
        }).then((data) => {
            console.log(`E-contract created with {id: ${contractId}}`);
        });
    }

    constructor(props) {
        super(props)

        this.state = {
            storageValue: 0,
            web3: null,
            selectedAddress: null
        }
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                })

                // Instantiate contract once web3 provided.
                this.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    instantiateContract() {

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            const availableAccounts = accounts.map((account) => {
                return {value: account, label: account};
            });

            this.setState({accounts: availableAccounts});
        })
    }

    render() {
        const {selectedAddress} = this.state;
        const value = selectedAddress;

        return (
            <div>
                <div className="card m-2">
                    <div className="card-header">
                        Select buyer address
                    </div>
                    <div className="card-body">
                        <Select
                            name="form-field-name"
                            value={value}
                            onChange={this.handleChange}
                            options={this.state.accounts}
                        />
                    </div>
                </div>
                <div className="card m-2">
                    <div className="card-header">
                        Create contract
                    </div>
                    <div className="card-body">
                        <button className="btn btn-primary" onClick={this.createContract}>Create</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App
