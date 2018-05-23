import React, {Component} from 'react'
import {Button} from "react-bootstrap";
import getWeb3 from "../utils/getWeb3";
import SaleContract from './../../build/contracts/SaleContract.json'

class ActionButton extends Component {

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

    constructor(props) {
        super(props);

        this.state = {
            web3: null
        };
    }

    acceptProposal = () => {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);

        saleContract.deployed().then((instance) => {
            return instance.sign(
                this.state.web3.toBigNumber(this.props.contractId),
                {from: this.props.address, gas: 200000});
        }).then((result) => {
            console.log(result);
        });
    };

    initiateSale = () => {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);

        saleContract.deployed().then((instance) => {
            return instance.initiateSale(
                this.state.web3.toBigNumber(this.props.contractId),
                {from: this.props.address, gas: 200000});
        }).then((result) => {
            console.log(result);
        });
    };

    inputHandlerButton = (title, style) => {
        return (
            <div>
                <Button bsSize="small" bsStyle="info"
                        onClick={() => this.props.inputHandler({state: this.props.state, id: this.props.contractId})}>
                    {title}
                </Button>
            </div>
        )
    };

    infoText = (text) => {
        return (<span className="badge badge-pill badge-info">{text}</span>)
    };

    success = () => {
        return (<span className="badge badge-pill badge-success">Initiated</span>)
    };

    fail = () => {
        return (<span className="badge badge-pill badge-danger">Failed</span>)
    };

    acceptOrDeclineButton = () => {
        return (
            <div>
                <Button bsSize="small" bsStyle="success"
                        onClick={this.acceptProposal}>
                    Accept
                </Button>
                {this.inputHandlerButton('Decline', 'danger')}
            </div>
        )
    };

    initiateButton = () => {
        return (
            <div>
                <Button bsSize="small" bsStyle="success"
                        onClick={this.initiateSale}>
                    Initiate sale
                </Button>
            </div>
        )
    };

    render() {
        if (this.props.isBuyer) {
            switch (this.props.state) {
                case 0: {
                    return this.inputHandlerButton('Quantify', 'primary');
                }
                case 1: {
                    return this.infoText('Waiting for proposal');
                }
                case 2: {
                    return this.acceptOrDeclineButton();
                }
                case 3: {
                    return this.infoText('Waiting for initiation');
                }
                case 4: {
                    return this.fail();
                }
                case 5: {
                    return this.success();
                }
                default: {
                    return 'no implemented action for state';
                }
            }
        } else {
            switch (this.props.state) {
                case 0: {
                    return this.infoText('Waiting for quantity');
                }
                case 1: {
                    return this.inputHandlerButton('Propose', 'primary');
                }
                case 2: {
                    return this.infoText('Waiting for acceptance');
                }
                case 3: {
                    return this.initiateButton();
                }
                case 4: {
                    return this.fail();
                }
                case 5: {
                    return this.success();
                }
                default: {
                    return 'no implemented action for state';
                }
            }
        }
    }
}

export default ActionButton
