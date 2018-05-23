import React, {Component} from 'react'
import getWeb3 from './../utils/getWeb3'
import SaleContract from './../../build/contracts/SaleContract.json'
import Form from "react-jsonschema-form";

class ContractEditor extends Component {

    schemaQuantify = {
        type: "object",
        properties: {
            title: {type: "string", title: "Quantity"}
        }
    };

    actionQuantify = (data) => {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);

        saleContract.deployed().then((instance) => {
            return instance.quantify(data.id, data.quantity);
        }).then((result) => {
            console.log(result);
        });
    };

    constructor(props) {
        super(props);

        const schemaEmpty = {
            type: "object",
            properties: {
            }
        };

        this.state = {
            web3: null,
            showOperation: true,
            schema: schemaEmpty,
            formData: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.data !== this.props.data) {
            this.setState({formData: {
                    id: nextProps.data.id
                }});

            console.log(`new data in edit: ${nextProps.data}`)

            this.setSchema();
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
        switch(this.props.data.state) {
            case 0: {
                this.actionQuantify(result.formData);
                break;
            }
        }
    };

    setSchema () {
        let newSchema;

        switch(this.props.data.state) {
            case 0: {
                newSchema = this.schemaQuantify;
                break;
            }
        }

        this.setState({schema: newSchema});
    }

    render() {
        const uiSchemaHiddenId = {
            id: {"ui:widget": "hidden"}
        };

        return (
            <div>
                {this.props.data == null
                ?
                "No contracts selected"
                :
                this.state.showOperation &&
                <Form schema={this.state.schema}
                      uiSchema={uiSchemaHiddenId}
                      formData={this.state.formData}
                      onSubmit={this.handleSubmit} />}
            </div>
        )
    }
}

export default ContractEditor
