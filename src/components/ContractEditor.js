import React, {Component} from 'react'
import getWeb3 from './../utils/getWeb3'
import SaleContract from './../../build/contracts/SaleContract.json'
import Form from "react-jsonschema-form";

class ContractEditor extends Component {

    schemaQuantify = {
        type: "object",
        properties: {
            quantity: {type: "number", title: "Quantity"}
        }
    };

    actionQuantify = (data) => {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);

        saleContract.deployed().then((instance) => {
            return instance.quantify(this.state.web3.toBigNumber(data.id), this.state.web3.toBigNumber(data.quantity), {from: this.props.address});
        }).then((result) => {
            console.log(result);
        });
    };

    schemaPropose = {
        type: "object",
        properties: {
            unitPrice: {type: "number", title: "Unit price"},
            deliveryDate: {type: "string", title: "Delivery date"},
            returnPolicy: {type: "string", title: "Return policy"},
            deposit: {type: "number", title: "Deposit"},
            freight: {type: "string", title: "Freight"},
            insurance: {type: "string", title: "Insurance"}
        }
    };

    actionPropose = (data) => {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);

        console.log(this.props.address);

        saleContract.deployed().then((instance) => {
            return instance.propose(
                this.state.web3.toBigNumber(data.id),
                this.state.web3.toBigNumber(data.unitPrice),
                data.deliveryDate,
                data.returnPolicy,
                this.state.web3.toBigNumber(data.deposit),
                data.freight,
                data.insurance,
                {from: this.props.address, gas: 200000});
        }).then((result) => {
            console.log(result);
        });

    };

    schemaDecline = {
        type: "object",
        properties: {
            comment: {type: "string", title: "Comment"}
        }
    };

    actionDecline = (data) => {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);

        console.log(this.props.address);

        saleContract.deployed().then((instance) => {
            return instance.commentDecline(
                this.state.web3.toBigNumber(data.id),
                data.comment,
                {from: this.props.address, gas: 200000});
        }).then((result) => {
            console.log(result);
        });
    };

    constructor(props) {
        super(props);

        const schemaEmpty = {
            type: "object",
            properties: {}
        };

        this.state = {
            web3: null,
            operationDone: false,
            schema: schemaEmpty,
            formData: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.data !== this.props.data) {
            this.setState({
                formData: {
                    id: nextProps.data.id
                },
                operationDone: false
            });

            console.log(`new data in edit: ${nextProps.data.id}`);

            this.setSchema(nextProps.data.state);
        }
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

    handleSubmit = (result) => {
        console.log(result);
        switch (this.props.data.state) {
            case 0: {
                this.actionQuantify(result.formData);
                break;
            }
            case 1: {
                this.actionPropose(result.formData);
                break;
            }
            case 2: {
                this.actionDecline(result.formData);
                break;
            }
            default: {
                // Do nothing
            }
        }

        this.setState({operationDone: true});
    };

    setSchema(state) {
        let newSchema;

        switch (state) {
            case 0: {
                newSchema = this.schemaQuantify;
                break;
            }
            case 1: {
                newSchema = this.schemaPropose;
                break;
            }
            case 2: {
                newSchema = this.schemaDecline;
                break;
            }
            default: {
                // Do nothing
            }
        }

        this.setState({schema: newSchema});
    }

    render() {
        const uiSchemaHiddenId = {
            id: {"ui:widget": "hidden"}
        };

        if (this.props.data == null) {
            return <div>There is no operation with inputs currently</div>
        }

        if (this.state.operationDone) {
            return (<span className="badge badge-pill badge-success">Success</span>);
        }

        return (
            <div>
                {this.state.operationDone ?
                    <span className="badge badge-pill badge-success">Success</span>
                    :
                    <Form schema={this.state.schema}
                          uiSchema={uiSchemaHiddenId}
                          formData={this.state.formData}
                          onSubmit={this.handleSubmit}/>}
            </div>
        )
    }
}

export default ContractEditor
