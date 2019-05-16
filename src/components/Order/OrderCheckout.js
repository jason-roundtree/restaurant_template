import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class OrderCheckout extends Component {
    state = {
        firstName: '',
        lastName: '',
        phone: '',
        costPreTax: '',
        // TODO: allow this to be set from admin
        taxPercentage: .065,
        taxAmount: 0,
        totalCost: ''
    }

    handleInputChange = e => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    handleSubmitOrder = () => {

    }

    render() {
        console.log('Order Checkout state: ', this.state)

        return (
            <div>
                
                    
                    <button 
                        onClick={() => {
                            this.props.returnToOrderEdit()
                            this.props.toggleCheckout()
                        }}
                    >Edit Order</button>
                    <br />
                    
                    <label htmlFor="firstName">First Name</label>
                    <input 
                        type="text"
                        name="firstName"
                        value={this.state.firstName}
                    />
                    <br />

                    <label htmlFor="lastName">Last Name</label>
                    <input 
                        type="text"
                        name="lastName"
                        value={this.state.lastName}
                    />
                    <br />

                    <label htmlFor="phone">Phone Number</label>
                    <input 
                        type="text"
                        name="phone"
                        value={this.state.phone}
                    />
                    <br />
                    
                
            </div>
        )
    }
}
