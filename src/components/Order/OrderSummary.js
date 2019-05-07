import React, { Component } from 'react'
import caretUp from '../../images/caret-up.svg'
import caretDown from '../../images/caret-down.svg'

export default class OrderSummary extends Component {
    state = {
        summaryOpen: false
    }
    toggleDrawer = () => {
        // console.log('toggleOrderSummaryDrawer ')
        this.setState({
            summaryOpen: !this.state.summaryOpen
        }, () => {
            // TODO: change this to a bootstrap/materialUI component?
            const orderSummaryParagraph = document.getElementById('order-summary')
            this.state.summaryOpen 
                ? orderSummaryParagraph.style.height = '250px'                
                : orderSummaryParagraph.style.height = '40px'
        })
    }
    render() {
        const caretIcon = this.state.summaryOpen ? caretDown : caretUp
        return (
            <div id="order-summary">
                {/* TODO: format phone number to include dashes */}
                
                <p onClick={this.toggleDrawer}>
                    <img 
                        src={caretIcon} 
                        alt={caretIcon}
                        width='20px'
                        height='20px'
                        style={{marginRight: '10px'}}
                    />
                    Order Summary
                    <img 
                        src={caretIcon} 
                        alt={caretIcon}
                        width='20px'
                        height='20px'
                        style={{marginLeft: '10px'}}
                    />
                </p>
            </div>
        )
    }
}
