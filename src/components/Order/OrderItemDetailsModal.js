import React from 'react'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function OrderItemDetailsModal(props) {
    console.log('OrderItemDetailsModal props: ', props)
    return (
        <Modal 
            isOpen={props.modalActive ? true : false}
            toggle={props.clearModalState}
        >
            <ModalHeader>{props.menuItem.name}</ModalHeader>
            <ModalBody>
                <p>{props.menuItem.description}</p>
                <p>{`$${props.menuItem.cost}`}</p>
                <label htmlFor="specialRequests">Special Requests:</label>
                <textarea name="specialRequests" rows='3'></textarea> 
                
            </ModalBody>
            <ModalFooter>
                <button>Add to Order</button>
            </ModalFooter>
        </Modal>
    )
}
