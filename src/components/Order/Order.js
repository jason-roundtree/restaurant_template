import React from 'react';
import OrderForm from './OrderForm';
import './Order.css';
const axios = require('axios');
const { API_BASE_URL } = require('../../config');


class Order extends React.Component {
    state = {
        allMenuItems: [],
        
        customerFirstName: '',
        customerLastName: '',
        customerPhone: '',
        customerEmail: '',

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
                this.setState({
                    allMenuItems: res.data
                })
            })
            .catch(err => console.log(err))
    }

    handleItemToggle = () => {
        console.log('handleItemToggle: ', this.handleItemToggle)
    }

    render () {
        console.log('Order state: ', this.state)
        const menuItems = this.state.allMenuItems.map(item => {
            return (
                <div 
                    key={item._id}
                    // className="menu-item"
                >
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <p>{item.cost ? `$${item.cost.toFixed(2)}` : ''}</p>
                </div>
            )
        })
       
        return (
            <div id="order-page">
                <h1>Order for Pickup</h1>

                <OrderForm 
                    addItem={this.handleItemToggle}
                />

                {menuItems}
                
            </div>
        )
    } 
}

export default Order;

// Add items from menu
// Remove items from menu
// Set number of each item
// Add comments/special requests
// Add name and phone number
