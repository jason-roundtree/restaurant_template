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
        
        {this.props.orderItems.length
            ?   <table id="ordered-items">
                    <tbody>
                        {this.props.orderItems.map(item => {
                            return (
                                    <tr key={item._id}>
                                        <td>
                                            {item.name}
                                            {item.specialRequest &&
                                                <p className="special-req-item">{item.specialRequest}</p>
                                            }
                                        </td>
                                        <td>${item.cost}</td>
                                        <td>
                                            <button
                                                className="danger-btn delete-item"
                                                onClick={() => {
                                                    this.props.removeItem(item.customOrderItemId)
                                                }}
                                                disabled={this.props.showDeletionAlert}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                )
                                {/* {this.props.showDeletionAlert &&
                                    <tr>
                                        <td colSpan="3">
                                            <Alert color="info">Are you sure</Alert>
                                            <button 
                                                className="danger-btn"
                                                onClick={() => {
                                                    this.props.removeItem(item.customOrderItemId)
                                                }}
                                            >
                                                Yes, remove
                                            </button>
                                        </td>
                                    </tr>     
                                }     */}
                            
                        })}
                    </tbody>
                </table>

            :   <Alert color="info">
                    No items have been added to your order
                </Alert>
        }
        
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
