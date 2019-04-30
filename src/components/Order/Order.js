import React from 'react';
import MenuItems from './MenuItems';
import OrderContactInfoForm from './OrderContactInfoForm';
import OrderItemDetailsModal from './OrderItemDetailsModal';
import OrderSummary from './OrderSummary';
import './Order.css';
const axios = require('axios');
const { API_BASE_URL } = require('../../config');

class Order extends React.Component {
    state = {
        allMenuItems: [],
        activeMenuItemId: '',
        
        customerFirstName: '',
        customerLastName: '',
        customerPhone: '',
        // customerEmail: '',
        customerInfoComplete: false,

        itemsOrdered: [],
        specialRequests: '',
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
        console.log('openSelectedItemModal id: ', id)
        this.setState({ activeMenuItemId: id })
    }

    clearModalState = () => {
        this.setState({
            activeMenuItemId: ''
        })
    }
    render () {
        console.log('Order state: ', this.state)
        
        return (
            <div id="order-page">
                <h1>Order for Pickup</h1>

                {/* {this.state.customerInfoComplete
                    ?   <OrderSummary
                            firstName={this.state.customerFirstName}
                            lastName={this.state.customerLastName}
                            phone={this.state.customerPhone}
                        />
                    :   <OrderContactInfoForm 
                            handleSubmit={this.handleContactInfoSubmit}
                            handleInputChange={this.handleInputChange}
                            firstName={this.state.customerFirstName}
                            lastName={this.state.customerLastName}
                            phone={this.state.customerPhone}
                        /> 
                } */}

                <OrderContactInfoForm 
                    handleSubmit={this.handleContactInfoSubmit}
                    handleInputChange={this.handleInputChange}
                    firstName={this.state.customerFirstName}
                    lastName={this.state.customerLastName}
                    phone={this.state.customerPhone}
                /> 

                <div id="order-item-container">
                    {this.state.allMenuItems.map((item) => {
                        return (
                            <MenuItems
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
                    modalOpen={this.state.activeMenuItemId}
                    clearModalState={this.clearModalState}
                />
                
                <OrderSummary
                    firstName={this.state.customerFirstName}
                    lastName={this.state.customerLastName}
                    phone={this.state.customerPhone}
                />

            </div>
        )
    } 
}

export default Order;
