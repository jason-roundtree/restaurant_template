import React from 'react'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class OrderItemDetailsModal extends React.Component {
    state = {
        specialRequestInput: ''
    }
    handleInputChange = e => {
        this.setState({
            specialRequestInput: e.target.value
        })
    }
    render() {
        const menuItem = this.props.menuItem
        return (
            <Modal 
                isOpen={this.props.modalActive ? true : false}
                toggle={this.props.clearModalState}
            >
                <ModalHeader>{menuItem.name}</ModalHeader>
                <ModalBody>
                    <p>{menuItem.description}</p>
                    <p>{`$${menuItem.cost}`}</p>
                    <label htmlFor="specialRequests">Special Requests:</label>
                    <textarea 
                        name="specialRequests" 
                        rows='3'
                        value={menuItem.specialRequestInput}
                        onChange={this.handleInputChange}
                    ></textarea> 
                    
                </ModalBody>
                <ModalFooter>
                    <button 
                        onClick={() => this.props.addItemToOrder(menuItem._id, this.state.specialRequestInput)}
                    >
                        Add to Order
                    </button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default OrderItemDetailsModal;