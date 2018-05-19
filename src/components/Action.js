import React, {Component} from 'react'

class Action extends Component {

    /*
    /// Fulfilment state of the digital sale contract
    enum State {Empty, Request, Proposal, Agreement, Fail, Initiated}
     */

    render() {
        return (
            <div>
                {this.getActionFromState()}
            </div>
        );
    }

    getActionFromState = () => {
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
    };
}

export default Action
