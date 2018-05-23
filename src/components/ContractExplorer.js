import React, {Component} from 'react'
import getWeb3 from './../utils/getWeb3'
import SaleContract from './../../build/contracts/SaleContract.json'
import ReactTable from "react-table";
import 'react-table/react-table.css'
import Action from "./Action";
import AsyncLock from 'async-lock'

class ContractExplorer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            web3: null,
            data: []
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
                this.updateContracts();
            })
            .catch((e) => {
                console.log('Error finding web3. ' + e)
            })
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if(nextProps.selectedAddress !== this.props.selectedAddress) {
            this.updateContracts();
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
                    contractData.unitPrice = result[1].toString();
                    contractData.deliveryDate = result[2].toString();
                    contractData.returnPolicy = result[3].toString();
                    contractData.deposit = result[4].toString();
                    contractData.freight = result[5].toString();
                    contractData.insurance = result[6].toString();
                    contractData.comment = result[7].toString();
                    contractData.id = val.toString();

                    return contractInstance.getContractParticipants.call(val.toNumber());
                }).then((result) => {
                    contractData.buyerAddress = result[0];
                    contractData.sellerAddress = result[1];

                    return contractInstance.getContractState.call(val.toNumber())
                }).then((result) => {
                    contractData.action = result.toNumber();

                    hook.addContractData(contractData);
                });
            });
        });
    }

    // Async locked funciton for adding contract data
    addContractData = (data) => {
        const hook = this;
        var lock = new AsyncLock();
        lock.acquire('updateLock', () => {
            let isDuplicated = false;

            hook.state.data.forEach((val,index) => {
                if(val.id === data.id)
                    isDuplicated = true;
            });

            if(!isDuplicated)
                hook.setState({data: [...hook.state.data, data]});
        });
    };

    watchEvents() {
        const contract = require('truffle-contract');
        const saleContract = contract(SaleContract);
        saleContract.setProvider(this.state.web3.currentProvider);
        let contractInstance;

        saleContract.deployed().then((instance) => {
            contractInstance = instance;

            contractInstance.allEvents((error,log) => {this.updateContracts();});
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
                <Action isBuyer={row.original.buyerAddress === selectedAddress} address={selectedAddress} state={row.value} contractId={row.original.id} inputHandler={onEdit} />)
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
