import React from 'react';
import MenuAssignmentList from './MenuAssignmentList';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function EditMenuItemModal(props) {
  return (
    <Modal isOpen={props.modalActive} toggle={props.clearModalState}>
      <ModalHeader>
          <span>Edit Menu Item:  &nbsp;</span>
          {props.menuItemBeingEdited.name}
      </ModalHeader>

      <ModalBody>
          <input
              id="editItemNameInput"
              name="name"
              type="text"
              value={props.menuItemBeingEdited.name}
              onChange={props.handleInputChange}
              className="mb-2"
          />

          <input 
              id="editItemDescriptionInput"
              name="description"
              type="text"
              value={props.menuItemBeingEdited.description}
              onChange={props.handleInputChange}
              className="mb-2"
          />

          <input 
              id="editItemCostInput"
              name="cost"
              type="text"
              value={props.menuItemBeingEdited.cost}
              onChange={props.handleInputChange}
              className="mb-2"
          />

          <MenuAssignmentList 
              className="menu-list"
              menus={props.menus}
              activeMenus={props.editItemActiveMenuIds}
              toggleMenuAssignment={props.toggleMenuAssignment}
              menuItemId={props.menuItemBeingEdited.id}
          />  
          
      </ModalBody>

      <ModalFooter>
          <button onClick={() => props.updateMenuItemState()}>
              Save
          </button>

          <button onClick={() => props.clearModalState(null)}>
              Cancel
          </button>

          <button 
              className="danger-btn"
              onClick={() => props.runDeleteConfirmation()}
          >
              Delete Item
          </button>
          
      </ModalFooter> 
      
      {props.deleteButtonClicked &&
          <ModalFooter style={{display: "block"}}>
              <Alert color="info" style={{fontSize: ".85em"}}>Are you sure?</Alert>
              
              <button 
                  className="danger-btn"
                  onClick={() => props.deleteMenuItem()}
                  style={{marginLeft: "0"}}
              >
                  Confirm Deletion
              </button>
          </ModalFooter>
      }
  </Modal>
  )
}
