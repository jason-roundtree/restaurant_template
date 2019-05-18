import React from 'react'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function OrderItemDetailsModal(props) {
    const menuItem = props.menuItem
    return (
        <Modal 
            isOpen={props.modalActive ? true : false}
            toggle={props.clearModalState}
        >
            <ModalHeader>{menuItem.name}</ModalHeader>
            <ModalBody>
                <p>{menuItem.description}</p>
                <p>{`$${menuItem.cost}`}</p>
                {/* <label htmlFor="specialRequest">Special Requests:</label> */}
                <textarea 
                    placeholder="Special Requests"
                    name="specialRequest" 
                    rows='3'
                    value={menuItem.specialRequestInput}
                    onChange={props.addSpecialRequest}
                ></textarea> 
            </ModalBody>
            <ModalFooter>
                <span>Quantity:</span>
                <button onClick={() => props.updateOrderItemQuantity('increase')}>&#43;</button>

                {props.orderItemQuantity}

                <button onClick={() => props.updateOrderItemQuantity()}>&#8722;</button>
                <br/>

                <button onClick={() => props.addItemToOrder(menuItem._id)}>
                    Add to Order
                </button>
            </ModalFooter>
        </Modal>
    )
}