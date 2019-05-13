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
                <label htmlFor="specialRequest">Special Requests:</label>
                <textarea 
                    name="specialRequest" 
                    rows='3'
                    value={menuItem.specialRequestInput}
                    onChange={props.addSpecialRequest}
                ></textarea> 
            </ModalBody>
            <ModalFooter>
                <button 
                    onClick={() => props.addItemToOrder(menuItem._id)}
                >
                    Add to Order
                </button>
            </ModalFooter>
        </Modal>
    )
}