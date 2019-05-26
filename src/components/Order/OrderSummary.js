import React from 'react';
import OrderContactInfoInputs from './OrderContactInfoInputs';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'reactstrap';
var _ = require('lodash');
const axios = require('axios');
const { API_BASE_URL } = require('../../config');


export default class OrderSummary extends React.Component {
    state = {
        subTotalCost: 0,
        // TODO: allow tax rate to be set from admin
        // TODO: what other taxes could apply other than sales tax?
        taxPercentage: .065,
        taxAmount: 0,
        totalCost: 0,
        firstName: '',
        lastName: '',
        phone: '',
        // TODO: implement
        activeItemTooltip: '',
        tooltipOpen: false
    }
    componentDidMount() {
        const subTotalCost = this.props.orderItems.reduce((total, current) => {
            return total += current.cost * current.quantity
        }, 0)
        const taxAmount = _.round((subTotalCost * this.state.taxPercentage), 2)
        const totalCost = subTotalCost + taxAmount
        this.setState({
            subTotalCost,
            taxAmount,
            totalCost
        })
    }
    componentDidUpdate = prevProps => {
        if (this.props.orderItems.length === 0 && (this.props.orderItems !== prevProps.orderItems)) {
            this.setState({
                subTotalCost: 0,
                taxAmount: 0,
                totalCost: 0,
            })
        }
    }
    handleInputChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    submitOrder = e => {
        e.preventDefault()
        const itemsSanitized = []
        this.props.orderItems.forEach(item => {
            const { id: menuItemId, specialRequest, quantity } = item
            itemsSanitized.push({ menuItemId, specialRequest, quantity })
        })
        // TODO: Create promise here so you can post individual items and then the whole order once those are done?
        const postedOrderItemIds = []
        itemsSanitized.forEach(item => {
            axios.post(`${API_BASE_URL}/order_item`, item)
                .then(res => {
                    // console.log('order_item res: ', res)
                    postedOrderItemIds.push(res.data)
                })
                .catch(err => console.log(err))
        })
    }

    toggleTooltip = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    render() {
        console.log('Order Summary STATE: ', this.state)
        return (
            <Modal 
                id="order-summary"
                isOpen={this.props.modalOpen}
                toggle={this.props.toggleSummaryModal}
            >
                <ModalHeader>Order Summary &amp; Checkout</ModalHeader>
                    {this.props.orderItems.length
                        ?   <table id="ordered-items">
                                <tbody>
                                    {this.props.orderItems.map(item => {
                                        return (
                                            <tr key={item.customOrderItemId}>
                                                <td>
                                                    {item.name}
                                                    {item.specialRequest &&
                                                        <div>
                                                            <span 
                                                                className="special-req-item"
                                                                href="#" 
                                                                id={`specialReqTooltip${item.customOrderItemId}`}
                                                            >
                                                                Special Request
                                                            </span>
                                                            <Tooltip 
                                                                placement="top" 
                                                                toggle={this.toggleTooltip}
                                                                isOpen={this.state.tooltipOpen}
                                                                target={`specialReqTooltip${item.customOrderItemId}`}
                                                            >
                                                                {item.specialRequest}
                                                            </Tooltip>
                                                        </div>
                                                    }
                                                </td>
                                                <td>${item.cost}</td>
                                                <td><span>x</span>{item.quantity}</td>
                                                <td>
                                                    <button
                                                        className="danger-btn delete-item"
                                                        onClick={() => {
                                                            this.props.removeItem(item.customOrderItemId)
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
        
                        :   <Alert color="info">
                                No items have been added to your order
                            </Alert>
                    }
            
                <ModalFooter>
                    <p>Sub Total: ${this.state.subTotalCost}</p>
                    <p>Tax: ${this.state.taxAmount}</p>
                    <p>Grand Total: ${this.state.totalCost}</p>
                    
                    <form onSubmit={this.submitOrder}>
                        {Boolean(this.props.orderItems.length) &&
                            <OrderContactInfoInputs 
                                handleInputChange={this.handleInputChange}
                                returnToOrderEdit={this.props.returnToOrderEdit}
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                phone={this.state.phone}
                            /> 
                        }
                        <button 
                            disabled={this.state.firstName === '' || this.state.lastName === '' || this.state.phone === ''}
                        >
                            Submit Order
                        </button>
                    </form>
                    
                </ModalFooter>
            </Modal>
        )
    }
}
