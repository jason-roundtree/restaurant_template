import React from 'react';
import OrderCheckout from './OrderCheckout';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const axios = require('axios');
const { API_BASE_URL } = require('../../config');


export default class OrderSummary extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        phone: '',

        subTotalCost: 0,
        // TODO: allow tax rate to be set from admin
        // TODO: what other taxes could apply other than sales tax?
        taxPercentage: .065,
        taxAmount: 0,
        totalCost: 0
    }
    componentDidMount() {
        const subTotalCost = this.props.orderItems.reduce((total, current) => {
            return total += current.cost * current.quantity
        }, 0)
        // TODO: use lodash to round instead??
        const taxAmount = Math.round((subTotalCost * this.state.taxPercentage) * 100) / 100
        const totalCost = subTotalCost + taxAmount

        this.setState({
            subTotalCost,
            taxAmount,
            totalCost
        })
    }

    handleInputChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }
    
    // TODO: setup back-end and then submit
    submitOrder = () => {

    }

    render() {
        console.log('Order Summary STATE: ', this.state)
        const menuItemAdded = Boolean(this.props.orderItems.length)

        return (
            <Modal 
                id="order-summary"
                isOpen={this.props.modalOpen}
                toggle={this.props.toggleSummaryModal}
            >
                <ModalHeader>Order Summary</ModalHeader>
                    {this.props.orderItems.length
                        ?   <table id="ordered-items">
                                <tbody>
                                    {this.props.orderItems.map(item => {
                                        return (
                                            <tr key={item.customOrderItemId}>
                                                <td>
                                                    {item.name}
                                                    {/* TODO: make a special request badge thingy that when hovered shows the request?? */}
                                                    {item.specialRequest &&
                                                        <p className="special-req-item">
                                                            {item.specialRequest}
                                                        </p>
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
                                                        disabled={this.props.showDeletionAlert}
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
    
                    <OrderCheckout 
                        returnToOrderEdit={this.props.returnToOrderEdit}
                        toggleCheckout={this.props.toggleCheckout}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        phone={this.state.phone}
                    /> 
                    
                    <button 
                        disabled={!menuItemAdded}
                        id="checkout-btn"
                        // onClick={this.props.}
                    >
                        Submit Order
                    </button>

                </ModalFooter>
            </Modal>
        )
    }
}
