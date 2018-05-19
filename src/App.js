import React, {Component} from 'react'
import AddressSelector from './components/AddressSelector.js'

import './css/bootstrap.min.css'
import './App.css'
import ContractCreator from "./components/ContractCreator";
import ContractExplorer from "./components/ContractExplorer";

class App extends Component {
    selectedAddressChange = (address) => {
        this.setState({selectedAddress: address.value});
        console.log(`Selected address: ${address.label}`)
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedAddress: null,
        }
    }

    render() {
        return (
            <div>
                <div className="card m-2">
                    <div className="card-header">
                        Address to use
                    </div>
                    <div className="card-body">
                        <AddressSelector
                           onChange={this.selectedAddressChange}
                        />
                    </div>
                </div>
                <div className="card m-2">
                    <div className="card-header">
                        New Sale Contract
                    </div>
                    <div className="card-body">
                        <ContractCreator selectedAddress={this.state.selectedAddress}/>
                    </div>
                </div>
                <div className="card m-2">
                    <div className="card-header">
                        Contracts
                    </div>
                    <div className="card-body">
                        <ContractExplorer selectedAddress={this.state.selectedAddress}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App
