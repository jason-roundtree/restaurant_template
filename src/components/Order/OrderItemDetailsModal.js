import React from 'react'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function OrderItemDetailsModal(props) {
    console.log('OrderItemDetailsModal props: ', props)
    return (
        <Modal 
            isOpen={props.modalOpen ? true : false}
            toggle={props.clearModalState}
        >
            <ModalHeader>
                Header
            </ModalHeader>
            <ModalBody>
                Bod
            </ModalBody>
            <ModalFooter>
                Footer
            </ModalFooter>
        </Modal>
    )
}
