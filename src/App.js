import React, {Component} from 'react'
import AddressSelector from './components/AddressSelector.js'

import './css/bootstrap.min.css'
import './App.css'
import ContractCreator from "./components/ContractCreator";
import ContractExplorer from "./components/ContractExplorer";
import ContractEditor from "./components/ContractEditor";

class App extends Component {
    selectedAddressChange = (address) => {
        this.setState({selectedAddress: address.value});
        console.log(`Selected address: ${address.label}`)
    };

    onEditAction = (address) => {
        this.setState({editedAddress: address});
        console.log(`Edited address: ${address}`);
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedAddress: null,
            editedAddress: null
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
                        Contracts <span className="badge badge-info">You only see the contracts related to your selected address</span>
                    </div>
                    <div className="card-body">
                        <ContractExplorer selectedAddress={this.state.selectedAddress} onEdit={this.onEditAction}/>
                    </div>
                </div>
                <div className="card m-2">
                    <div className="card-header">
                        Edit contract
                    </div>
                    <div className="card-body">
                        <ContractEditor address={this.state.editedAddress}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App
