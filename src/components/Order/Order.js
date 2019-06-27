import React from 'react';
import OrderMenuItem from './OrderMenuItem';
import MenuItem from '../Menu/MenuItem';
import OrderItemDetailsModal from './OrderItemDetailsModal';
import OrderSummary from './OrderSummary';
import uuid from 'uuid';
import './Order.css';
import { sort_AtoZ, sort_ZtoA } from '../../utils/sorting'
import { Alert } from 'reactstrap';
const axios = require('axios');
const { API_BASE_URL } = require('../../config');

export default class Order extends React.Component {
    state = {
        allMenuItems: [],
        activeMenuItem: {},
        modalActive: false,
        orderSummaryModalActive: false,
        itemsOrdered: [],
        specialRequest: '',
        orderItemQuantity: 1,
        orderCompleted: false
    }
    componentDidMount() {
        axios.get(`${API_BASE_URL}/menu_items`)
            .then(res => {
                this.setState({ allMenuItems: sort_AtoZ(res.data) })
            })
            .catch(err => console.log(err))
    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    openSelectedItemModal = id => {
        const { allMenuItems } = this.state
        for (let item of allMenuItems) {
            if (item._id === id) {
                this.setState({ activeMenuItem: item })
            }
        }
        if (this.state.activeMenuItem !== false) {
            this.setState({ modalActive: true })
        }
    }

    updateOrderItemQuantity = action => {
        if (action === 'increase') {
            this.setState({
                orderItemQuantity: this.state.orderItemQuantity + 1
            })
        } else if (this.state.orderItemQuantity > 1) {
            this.setState({ 
                orderItemQuantity: this.state.orderItemQuantity - 1 
            })
        }
    }

    addItemToOrder = id => {
        const menuItem = this.state.allMenuItems.find(item => item._id === id)
        const orderItem = {
            id,
            // custom id needed since orders can have multiples of the same item
            customOrderItemId: uuid(),
            name: menuItem.name,
            cost: menuItem.cost,
            specialRequest: this.state.specialRequest,
            quantity: this.state.orderItemQuantity 
        }
        this.setState({
            itemsOrdered: [...this.state.itemsOrdered, orderItem]
        }, this.clearModalState())
    }

    removeItemFromOrder = customId => {
        this.setState({
            itemsOrdered: [...this.state.itemsOrdered.filter(item => {
                customId !== item.customOrderItemId
            })]
        }, () => {
            this.state.itemsOrdered.length === 0 && this.toggleSummaryModal()
        })
    }

    clearModalState = () => {
        this.setState({
            modalActive: false,
            specialRequest: '',
            orderItemQuantity: 1
        })
    }

    toggleSummaryModal = () => {
        this.setState({ 
            orderSummaryModalActive: !this.state.orderSummaryModalActive 
        })
    }
    clearOrderInfo = () => {
        console.log('clearOrderInfo: ', this.clearOrderInfo)
        this.setState({
            activeMenuItem: {},
            orderSummaryModalActive: false,
            itemsOrdered: [],
            orderCompleted: true
        })
    }
    render () {
        console.log('Order state: ', this.state)
        return (
            <div id="order-page">
                <div id="order-page-main">
                    <h1>Order for Pickup</h1>
                    <p>Select items to add to order</p>
                    <button 
                        onClick={this.toggleSummaryModal}
                        disabled={!Boolean(this.state.itemsOrdered.length)}
                    >
                        Order Summary &amp; Checkout
                    </button>
                    {this.state.orderCompleted === true && 
                        <Alert>Your order has been received!</Alert>
                    }

                    <div id="order-item-container">
                        {this.state.allMenuItems.map(item => {
                            return (
                                <MenuItem 
                                    item={item}
                                    key={item._id}
                                    hoverClass={"hoverClass"}
                                    openSelectedItemModal={this.openSelectedItemModal}
                                />
                                // <OrderMenuItem
                                //     key={item._id}
                                //     id={item._id}
                                //     name={item.name}
                                //     cost={item.cost}
                                //     openSelectedItemModal={this.openSelectedItemModal}
                                // />
                            )
                        })}
                    </div>

                    <OrderItemDetailsModal
                        modalActive={this.state.modalActive}
                        clearModalState={this.clearModalState}
                        menuItem={this.state.activeMenuItem}
                        addItemToOrder={this.addItemToOrder}
                        addSpecialRequest={this.handleInputChange}
                        updateOrderItemQuantity={this.updateOrderItemQuantity}
                        orderItemQuantity={this.state.orderItemQuantity}
                    />
                </div>
                
                {this.state.orderSummaryModalActive && 
                    <OrderSummary
                        orderItems={this.state.itemsOrdered}
                        modalOpen={this.state.orderSummaryModalActive}
                        toggleSummaryModal={this.toggleSummaryModal}
                        removeItem={this.removeItemFromOrder}
                        returnToOrderEdit={this.toggleSummaryModal}
                        clearOrderInfo={this.clearOrderInfo}
                    />
                }
                
            </div>
        )
    } 
}

