import React from 'react';
import OrderMenuItem from './OrderMenuItem';
import OrderContactInfoForm from './OrderContactInfoForm';
import OrderItemDetailsModal from './OrderItemDetailsModal';
import OrderSummary from './OrderSummary';
import uuid from 'uuid'
import './Order.css';
const axios = require('axios');
const { API_BASE_URL } = require('../../config');

class Order extends React.Component {
    state = {
        allMenuItems: [],
        activeMenuItem: {},
        modalActive: false,
        // customerFirstName: '',
        // customerLastName: '',
        // customerPhone: '',
        // customerInfoComplete: false,
        orderSummaryActive: false,
        itemsOrdered: [],
        specialRequest: '',
        orderItemCount: 1,

        costPreTax: '',
        tax: '',
        totalCost: ''
    }
    componentDidMount() {
        axios.get(`${API_BASE_URL}/menu_items`)
            .then(res => {
                console.log('res.data.menuItems: ', res.data)
                this.setState({ allMenuItems: res.data })
            })
            .catch(err => console.log(err))
    }

    handleInputChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleContactInfoSubmit = e => {
        e.preventDefault()
        this.setState({ customerInfoComplete: true })
    }
    
    openSelectedItemModal = id => {
        const { allMenuItems } = this.state
        for (let item of allMenuItems) {
            if (item._id === id) {
                this.setState({
                    activeMenuItem: item
                })
            }
        }
        if (this.state.activeMenuItem !== false) {
            this.setState({ modalActive: true })
        }
    }

    clearModalState = () => {
        this.setState({
            modalActive: false,
            specialRequest: '',
            quantity: 1
        })
    }

    toggleSummaryModal = () => {
        this.setState({
            orderSummaryActive: !this.state.orderSummaryActive,
        })
    }

    updateOrderItemCount = type => {
        if (type === 'increase') {
            this.setState({
                orderItemCount: this.state.orderItemCount + 1
            })
        } else if (this.state.orderItemCount > 1) {
            this.setState({
                orderItemCount: this.state.orderItemCount - 1
            })
        }
        
    }

    addItemToOrder = id => {
        // console.log('add item id/specialReq: ', id, specialRequest)
        const menuItem = this.state.allMenuItems.find(item => item._id === id)
        const orderItem = {
            id,
            // added custom id since orders can have multiples of the same item
            customOrderItemId: uuid(),
            name: menuItem.name,
            cost: menuItem.cost,
            specialRequest: this.state.specialRequest,
            quantity: this.state.orderItemCount 
        }

        this.setState({
            itemsOrdered: [...this.state.itemsOrdered, orderItem]
            
        }, this.clearModalState())
    }

    removeItemFromOrder = _customId => {
        this.setState({
            itemsOrdered: [...this.state.itemsOrdered.filter(item => _customId !== item.customOrderItemId)]
        })
        
    }

    render () {
        console.log('Order state: ', this.state)
        
        return (
            <div id="order-page">
                <div id="order-page-main">
                    <h1>Order for Pickup</h1>
                    {/* TODO: Change this btn to only show when item has been added? */}
                    <button 
                        onClick={this.toggleSummaryModal}
                    >
                        Order Summary & Checkout
                    </button>

                    <div id="order-item-container">
                        {this.state.allMenuItems.map((item) => {
                            return (
                                <OrderMenuItem
                                    key={item._id}
                                    id={item._id}
                                    name={item.name}
                                    cost={item.cost}
                                    openSelectedItemModal={this.openSelectedItemModal}
                                />
                            )
                        })}
                    </div>

                    <OrderItemDetailsModal
                        modalActive={this.state.modalActive}
                        clearModalState={this.clearModalState}
                        menuItem={this.state.activeMenuItem}
                        addItemToOrder={this.addItemToOrder}
                        addSpecialRequest={this.handleInputChange}
                        updateOrderItemCount={this.updateOrderItemCount}
                        orderItemCount={this.state.orderItemCount}
                    />
                </div>
                
                {this.state.orderSummaryActive && (
                    <OrderSummary
                        firstName={this.state.customerFirstName}
                        lastName={this.state.customerLastName}
                        phone={this.state.customerPhone}
                        orderItems={this.state.itemsOrdered}
                        modalOpen={this.state.orderSummaryActive}
                        toggleSummaryModal={this.toggleSummaryModal}
                        // toggleItemDeletionAlert={this.toggleItemDeletionAlert}
                        // showDeletionAlert={this.state.deleteBtnClicked}
                        removeItem={this.removeItemFromOrder}
                    />
                )}

            </div>
        )
    } 
}

export default Order;
