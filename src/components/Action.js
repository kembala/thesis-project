import React, {Component} from 'react'
import {Button} from "react-bootstrap";

class Action extends Component {

    /*
    /// Fulfilment state of the digital sale contract
    enum State {Empty, Request, Proposal, Agreement, Fail, Initiated}
     */

    getAction = () => {
        if(this.props.isBuyer){
            switch(this.props.state) {
                case 0: {
                    return 'Empty';
                }
                case 1: {
                    return 'Request';
                }
                case 2: {
                    return 'Proposal';
                }
                case 3: {
                    return 'Agreement';
                }
                case 4: {
                    return 'Fail';
                }
                case 5: {
                    return 'Initiated';
                }
                default: {
                    return 'error';
                }
            }
        } else {
            switch(this.props.state) {
                case 0: {
                    return 'Empty0';
                }
                case 1: {
                    return 'Request0';
                }
                case 2: {
                    return 'Proposal0';
                }
                case 3: {
                    return 'Agreement0';
                }
                case 4: {
                    return 'Fail0';
                }
                case 5: {
                    return 'Initiated0';
                }
                default: {
                    return 'error0';
                }
            }
        }
    };

    render() {
        return (
            <div>
                <Button bsStyle="primary" bsSize="small" onClick={this.props.onEdit}>
                    {this.getAction()}
                </Button>
            </div>
        );
    }
}

export default Action
