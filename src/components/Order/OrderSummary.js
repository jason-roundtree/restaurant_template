import React, { Component } from 'react'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class OrderSummary extends Component {
    // state = {
    //     summaryOpen: false
    // }
    // toggleDrawer = () => {
    //     this.setState({
    //         summaryOpen: !this.state.summaryOpen
    //     })
    // }

    render() {
        // console.log('OrderSummary props: ', this.props)
        // console.log('OrderSummary state: ', this.state)
        const totalCost = this.props.orderItems.reduce((total, current) => {
            return total += current.cost
        }, 0)
        const menuItemAdded = Boolean(this.props.orderItems.length)

        return (
            <Modal 
                id="order-summary"
                isOpen={this.props.modalOpen}
                toggle={this.props.toggleSummaryModal}
            >
                <ModalHeader>Order Summary</ModalHeader>
                
                {/* <ModalBody> */}
                    {this.props.orderItems.length
                        ?   <table id="ordered-items" dark>
                                {this.props.orderItems.map(item => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>${item.cost}</td>
                                            <td>
                                                <input 
                                                    type="number"
                                                    // value={}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => this.props.removeItem(item.customOrderItemId)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </table>

                        :   <Alert color="info">
                                No items have been added to your order
                            </Alert>
                    }
                {/* </ModalBody> */}
                
                
                <ModalFooter>
                    <p>TOTAL: ${totalCost}</p>
                    <button 
                        disabled={!menuItemAdded}
                        id="checkout-btn"
                    >
                        Checkout
                    </button>
                </ModalFooter>
            </Modal>
        )
    }
}
