import React from 'react';
import OrderContactInfoInputs from './OrderContactInfoInputs';
import OrderSummaryTableRow from './OrderSummaryTableRow';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
var _ = require('lodash');
const axios = require('axios');
const { API_BASE_URL } = require('../../config');

export default class OrderSummary extends React.Component {
    state = {
        // TODO: allow tax rate to be set from admin?? What other taxes could apply other than sales tax?
        taxPercentage: .065,
        taxAmount: 0,
        subTotalCost: 0,
        totalCost: 0,
        firstName: '',
        lastName: '',
        phone: '',
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
        let postedOrderItemIds = []
        itemsSanitized.forEach(item => {
            axios.post(`${API_BASE_URL}/order_item`, item)
                .then(res => {
                    // console.log('order_item res: ', res)
                    postedOrderItemIds.push(res.data)
                })
                .catch(err => console.log(err))
        })
    }

    render() {
        console.log('Order Summary STATE: ', this.state)
        const orderItems = this.props.orderItems.map(item => (
            <OrderSummaryTableRow
                item={item}
                key={item.customOrderItemId}
                removeItem={this.props.removeItem}
            />
        ))
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
                                    {orderItems}
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
                        {Boolean(this.props.orderItems.length) && (
                            <OrderContactInfoInputs 
                                handleInputChange={this.handleInputChange}
                                returnToOrderEdit={this.props.returnToOrderEdit}
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                phone={this.state.phone}
                            /> 
                        )}
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
