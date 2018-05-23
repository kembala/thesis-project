import React, {Component} from 'react'
import getWeb3 from './../utils/getWeb3'
import SaleContract from './../../build/contracts/SaleContract.json'
import ReactTable from "react-table";
import 'react-table/react-table.css'
import Action from "./Action";

class ContractExplorer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            web3: null,
            data: [],
            watchIsSet: false
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

                this.watchEvents();
            })
            .catch((e) => {
                console.log('Error finding web3. ' + e)
            })
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(this.state.watchIsSet && nextProps.selectedAddress !== this.props.selectedAddress) {
            this.updateContracts();
            console.log("updatedFromProps")
        }
    }

    updateContracts() {
        this.setState({data: []});

        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);
        let contractInstance;
        let contractIds;

        const hook = this;

        saleContract.deployed().then((instance) => {
            contractInstance = instance;
            return contractInstance.getContracts.call({from: this.props.selectedAddress});
        }).then((result) => {
            contractIds = result;

            contractIds.forEach(function (val, index) {
                let contractData = {};

                saleContract.deployed().then((instance) => {
                    contractInstance = instance;
                    return contractInstance.getContractValues.call(val.toNumber());
                }).then((result) => {
                    contractData.quantity = result[0].toString();
                    contractData.unitPrice = result[0].toString();
                    contractData.deliveryDate = result[0].toString();
                    contractData.returnPolicy = result[0].toString();
                    contractData.deposit = result[0].toString();
                    contractData.freight = result[0].toString();
                    contractData.insurance = result[0].toString();
                    contractData.comment = result[0].toString();
                    contractData.id = val.toString();

                    return contractInstance.getContractParticipants.call(val.toNumber());
                }).then((result) => {
                    contractData.buyerAddress = result[0];
                    contractData.sellerAddress = result[1];

                    return contractInstance.getContractState.call(val.toNumber())
                }).then((result) => {
                    contractData.action = result.toNumber();
                    console.log(contractData.action)

                    hook.setState({
                        data: [...hook.state.data, contractData]
                    });
                });
            });
        });
    }

    watchEvents() {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);
        let contractInstance;

        saleContract.deployed().then((instance) => {
            contractInstance = instance;

            contractInstance.ContractCreated({fromBlock: '0', toBlock: 'latest'}).watch((error, event) => {
                this.updateContracts();
            });

            this.setState({watchIsSet: true});
        });
    }

    render() {
        const selectedAddress = this.props.selectedAddress;
        const onEdit = this.props.onEdit;

        const columns = [{
            Header: 'Buyer address',
            accessor: 'buyerAddress' // String-based value accessors!
        }, {
            Header: 'Seller address',
            accessor: 'sellerAddress',
        }, {
            Header: 'Quantity',
            accessor: 'quantity',
        }, {
            Header: 'Unit price',
            accessor: 'unitPrice',
        }, {
            Header: 'Delivery date',
            accessor: 'deliveryDate',
        }, {
            Header: 'Return policy',
            accessor: 'returnPolicy',
        }, {
            Header: 'Deposit',
            accessor: 'deposit',
        }, {
            Header: 'Freight',
            accessor: 'freight',
        }, {
            Header: 'Insurance',
            accessor: 'insurance',
        }, {
            Header: 'Comment',
            accessor: 'comment',
        }, {
            Header: 'ActionButton',
            accessor: 'action',
            Cell: row => (
                <Action isBuyer={row.original.buyerAddress === selectedAddress} state={row.value} onClick={() => onEdit({state:row.value,id: row.original.id})}/>)
        }];

        return (
            <ReactTable
                data={this.state.data}
                columns={columns}
                defaultPageSize={5}
            />
        )
    }
}

export default ContractExplorer
