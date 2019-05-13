import React from 'react'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export default function OrderSummary(props) {
    const totalCost = props.orderItems.reduce((total, current) => {
      return total += current.cost
    }, 0)
    const menuItemAdded = Boolean(props.orderItems.length)
    return (
      <Modal 
        id="order-summary"
        isOpen={props.modalOpen}
        toggle={props.toggleSummaryModal}
      >
        <ModalHeader>Order Summary</ModalHeader>
        
            {props.orderItems.length
                ?   <table id="ordered-items">
                        <tbody>
                            {props.orderItems.map(item => {
                                console.log('ITEM X: ', item)
                                return (
                                    
                                    <tr key={item.id}>
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
                                                    props.removeItem(item.customOrderItemId)
                                                }}
                                                disabled={props.showDeletionAlert}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                )
                                {/* {props.showDeletionAlert &&
                                    <tr>
                                        <td colSpan="3">
                                            <Alert color="info">Are you sure</Alert>
                                            <button 
                                                className="danger-btn"
                                                onClick={() => {
                                                    props.removeItem(item.customOrderItemId)
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
