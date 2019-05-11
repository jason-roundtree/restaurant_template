import React, { Component } from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap';
import caretUp from '../../images/caret-up.svg'
import caretDown from '../../images/caret-down.svg'

export default class OrderSummary extends Component {
    state = {
        summaryOpen: false
    }
    toggleDrawer = () => {
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
        // console.log('OrderSummary props: ', this.props)
        // console.log('OrderSummary state: ', this.state)
        const totalCost = this.props.orderItems.reduce((total, current) => {
            return total += current.cost
        }, 0)
        const caretIcon = this.state.summaryOpen ? caretDown : caretUp

        return (
            <div id="order-summary">
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

                <ListGroup id="ordered-items">
                    {this.props.orderItems.map(item => {
                        return (
                            <ListGroupItem 
                                key={item.id}
                                // class={}
                            >
                                <div>
                                    <span>{item.name} - ${item.cost}</span>
                                    <button 
                                        type="button" 
                                        className="close" 
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                
                            </ListGroupItem>   
                        )
                    })}
                </ListGroup>
                
                <span>TOTAL: ${totalCost}</span>
            </div>
        )
    }
}
