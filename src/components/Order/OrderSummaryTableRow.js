import React from 'react'
import { Button, Popover, PopoverHeader, PopoverBody, Tooltip } from 'reactstrap';

export default class OrderSummaryTableRow extends React.Component {
    state = {
        tooltipOpen: false,
    }
    toggle = () => {
        this.setState({ tooltipOpen: !this.state.tooltipOpen })
    }
    render() {
        // console.log('table row: ', this.state)
        return (
            <tr>
                <td>
                    {this.props.item.name}
                    {this.props.item.specialRequest &&
                        <div>
                            <span 
                                className="special-req-item"
                                // href="#" 
                                id={`popover-${this.props.item.customOrderItemId}`} 
                            >
                                Special Request
                            </span>
                            <Tooltip 
                                placement="top" 
                                toggle={this.toggle}
                                isOpen={this.state.tooltipOpen}
                                target={`popover-${this.props.item.customOrderItemId}`} 
                            >
                                {this.props.item.specialRequest}
                            </Tooltip>
                        </div>
                    }
                </td>
                <td>${this.props.item.cost}</td>
                <td><span>x</span>{this.props.item.quantity}</td>
                <td>
                    <button
                        className="danger-btn delete-item"
                        onClick={() => {
                            this.props.removeItem(this.props.item.customOrderItemId)
                        }}
                    >
                        Remove
                    </button>
                </td>
            </tr>
        )
    }
}
