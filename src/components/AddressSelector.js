import React, {Component} from 'react'
import Select from 'react-select'
import getWeb3 from './../utils/getWeb3'
import 'react-select/dist/react-select.css'

class AddressSelector extends Component {

    constructor(){
        super();

        this.state = {
            web3: null,
            selectedAddress: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                });

                this.getAccounts()
            })
            .catch((e) => {
                console.log('Error finding web3. ' + e)
            })
    }

    getAccounts(){
        this.state.web3.eth.getAccounts((error, accounts) => {
            const availableAccounts = accounts.map((account) => {
                return {value: account, label: account};
            });

            this.setState({accounts: availableAccounts});
            this.handleChange(availableAccounts[0]);
        })
    }

    handleChange(address) {
        this.setState({selectedAddress: address});
        this.props.onChange(address);
    }

    render() {
        return (
            <Select
                name="form-field-name"
                value={this.state.selectedAddress}
                onChange={this.handleChange}
                options={this.state.accounts}
            />
        );
    }
}

export default AddressSelector
