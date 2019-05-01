import React, { Component } from 'react'

export default class OrderSummary extends Component {
    state = {
        summaryOpen: false
    }
    toggleDrawer = () => {
        console.log('toggleOrderSummaryDrawer')
        this.setState({
            summaryOpen: !this.state.summaryOpen
        }, () => {
            // TODO: change this to a bootstrap/materialUI component. Seems like targeting by id may be causing issue with onClicking twice
            this.state.summaryOpen 
                ? document.getElementById('order-summary').style.height = '40px'
                : document.getElementById('order-summary').style.height = '250px'
        })
    }
    render() {
        return (
            <div id="order-summary">
                {/* TODO: format phone number to include dashes */}
                <p onClick={this.toggleDrawer}>
                    Order Summary:
                </p>
            </div>
        )
    }
}
