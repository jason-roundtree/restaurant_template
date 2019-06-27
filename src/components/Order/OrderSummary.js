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
        preTaxCost: 0,
        totalCost: 0,
        firstName: '',
        lastName: '',
        phone: '',
        customerId: '',
    }
    componentDidMount() {
        const preTaxCost = this.props.orderItems.reduce((total, current) => {
            return total += current.cost * current.quantity
        }, 0)
        const taxAmount = _.round((preTaxCost * this.state.taxPercentage), 2)
        const totalCost = preTaxCost + taxAmount
        this.setState({
            preTaxCost,
            taxAmount,
            totalCost
        })
    }
    componentDidUpdate = prevProps => {
        if (this.props.orderItems.length === 0 && (this.props.orderItems !== prevProps.orderItems)) {
            this.setState({
                preTaxCost: 0,
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
        const customer = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phone: this.state.phone,
        }
        axios.post(`${API_BASE_URL}/customer`, customer)
            .then(customer => {
                this.setState({ customerId: customer.data._id })
                const itemsSanitized = []
                this.props.orderItems.forEach(item => {
                    const { id: menuItem, specialRequest, quantity } = item
                    itemsSanitized.push({ menuItem, specialRequest, quantity })
                })
                return axios.post(`${API_BASE_URL}/order_item`, itemsSanitized)
            })
            .then(postedItems => {
                const orderItemIds = []
                // TODO: is there a way to extract the IDs by destructuring? Why is mongo returning full documents instead of just _ids like the docs say?
                for (let item of postedItems.data) {
                    orderItemIds.push(item._id)
                }
                const orderSummary = {
                    customer: this.state.customerId,
                    itemsOrdered: [...orderItemIds],
                    preTaxCost: this.state.preTaxCost,
                    taxAmount: this.state.taxAmount,
                    totalCost: this.state.totalCost
                }
                return axios.post(`${API_BASE_URL}/order`, orderSummary)
            })
            .then(() => {
                this.props.clearOrderInfo()
            })
            .catch(err => console.log('Submit order error: ', err))
    }
    // componentDidUpdate = (prevProps, prevState) => {
    //     if (prevState.orderComplete !== this.state.orderComplete) {
            
    //     }
    // }
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
                <ModalHeader>
                    Order Summary &amp; Checkout
                </ModalHeader>
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
                    <p>Sub Total: ${this.state.preTaxCost}</p>
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
