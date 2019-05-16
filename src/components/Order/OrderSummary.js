import React from 'react';
import { Link } from 'react-router-dom';
import OrderCheckout from './OrderCheckout';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export default function OrderSummary(props) {
    // TODO: update this to factor in items with more than 1 quantity
    const subTotalCost = props.orderItems.reduce((total, current) => {
      return total += current.cost * current.quantity
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
                                return (
                                    <tr key={item.customOrderItemId}>
                                        <td>
                                            {item.name}
                                            {/* TODO: make a special request badge thingy that when hovered shows the request */}
                                            {item.specialRequest &&
                                                <p className="special-req-item">
                                                    {item.specialRequest}
                                                </p>
                                            }
                                        </td>
                                        <td>${item.cost}</td>
                                        <td><span>x</span>{item.quantity}</td>
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
                <p>SUB-TOTAL: ${subTotalCost}</p>
                <button 
                    disabled={!menuItemAdded}
                    id="checkout-btn"
                    onClick={props.toggleCheckout}
                >
                    Checkout
                </button>

                {props.checkoutActive && 
                    <OrderCheckout 
                        returnToOrderEdit={props.returnToOrderEdit}
                        toggleCheckout={props.toggleCheckout}
                    /> 
                }
            </ModalFooter>
        </Modal>
    )
}
