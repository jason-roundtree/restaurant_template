import React from 'react';

class Order extends React.Component {
    constructor(props) {
        super(props);
        // TODO: move to redux?
        this.state = {
            items: [{}],
            costPreTax: '',
            tax: '',
            totalCost: ''
        }
    }
    render () {
        return <h1>Order for Pickup</h1>
    } 
}

export default Order;

// Add items from menu
// Remove items from menu
// Set number of each item
// Add comments/special requests
// Add name and phone number
