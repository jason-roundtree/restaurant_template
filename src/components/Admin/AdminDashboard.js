import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import AddMenuItem from './AddMenuItem';
// import MenuAssignmentList from './MenuAssignmentList';
import EditMenuItemModal from './EditMenuItemModal';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import './AdminDashboard.css';
// import '../index.css';
const axios = require('axios');
const { API_BASE_URL } = require('../../config');

// TODO:
// - create and re-use common components for both admin menu items and regular menu items
// - create separate components for different elements on this page
// - Enhance input validation, check out libraries
// - Change alerts to modals or something else

// Post-MVP todos:
// - setup sub-menu categories (e.g. Sandwiches, Pasta, Fish, etc) on front and back-end
// - setup input for comments/additional menu item info
// - move axios requests to their own module

class AdminDashboard extends React.Component {
    state = {
        menus: [],
        menuItems: [],
        filterInput: '',

        newMenuSectionActive: false,
        newMenuInput: '',
        deleteMenuSectionActive: false,
        deleteMenuInput: '',

        modalActive: false,
        menuItemBeingEdited: {},
        editItemActiveMenuIds: [],
        editItemDescriptionInput: '',
        editItemCostInput: '',
        editItemNameInput: '',
        deleteButtonClicked: false
    }
    componentDidMount() {
        axios.get(`${API_BASE_URL}/menus`)
          .then(res => {
            console.log('/menus data ', res.data)
            const menus = res.data.map(menu => {
                return {
                    name: menu.name, 
                    id: menu._id
                }
            })
            this.setState({
              menus
            })
          })
          .catch(err => {
            console.log(err)
          })

        axios.get(`${API_BASE_URL}/menu_items`)
            .then(res => {
                const menuItems = res.data.map(item => {
                    return {
                        name: item.name, 
                        description: item.description,
                        cost: item.cost,
                        menus: item.menus,
                        id: item._id
                    }
                })
                this.setState({
                    menuItems
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    
    handleInputChange = e => {
        const { id, value } = e.target
        this.setState({
            [id]: value
        })
    }

    // TODO: Figure out how to allow inputs to be empty if entire input text is deleted before being edited
    updateMenuItemState = () => {
        let name = this.state.editItemNameInput 
            ? this.state.editItemNameInput
            : this.state.menuItemBeingEdited.name 
        let description = this.state.editItemDescriptionInput
            ? this.state.editItemDescriptionInput
            : this.state.menuItemBeingEdited.description
        let cost = this.state.editItemCostInput   
            ? this.state.editItemCostInput 
            : this.state.menuItemBeingEdited.cost 
        let menus = this.state.editItemActiveMenuIds

        let updatedMenuItem = Object.assign({},
            this.state.menuItemBeingEdited,
            { name },
            { description },
            { cost }, 
            { menus },
        )
        this.setState({
            menuItemBeingEdited: updatedMenuItem
        }, () => {
            this.saveUpdatedMenuItem(this.state.menuItemBeingEdited)
        })
    }

    openEditMenuItemModal = itemId => {
        const menus = this.state.menuItems
        let menuItem = ''
        for (let i = 0; i < menus.length; i++) {
            if (menus[i].id === itemId) menuItem = menus[i]
        }
        this.setState({
            modalActive: !this.state.modalActive,
            menuItemBeingEdited: menuItem
        }, () => this.extractActiveMenuIds())
    }

    clearModalState = reload => {
        this.setState({
            modalActive: false,
            menuItemBeingEdited: {},
            editItemActiveMenuIds: [],
            editItemDescriptionInput: '',
            editItemCostInput: '',
            deleteButtonClicked: false
        }, () => {
            reload === true && window.location.reload()
        })
    }
    // This initializes and stores a flat array of active menus in state for the menu item being edited. For toggling active menus I found it easier to do it this way than work with an array of menu objects in the 'menuItemBeingEdited:' state property 
    extractActiveMenuIds = () => {
        const itemBeingEditedMenus = this.state.menuItemBeingEdited.menus
        const activeMenuIds = []
        for (let i = 0; i < itemBeingEditedMenus.length; i++) {
            if (typeof itemBeingEditedMenus[i] === 'object') {
                activeMenuIds.push(itemBeingEditedMenus[i].id)
            } else {
                activeMenuIds.push(itemBeingEditedMenus[i])
            }
        }
        this.setState({
            editItemActiveMenuIds: activeMenuIds
        })
    }

    toggleMenuAssignment = menuId => {
        console.log('toggleMenuAssignment: ', menuId)
        const activeMenus = this.state.editItemActiveMenuIds
        if (activeMenus.includes(menuId)) {
            this.setState({
                editItemActiveMenuIds: this.state.editItemActiveMenuIds.filter(id => id !== menuId)
            })
        } else {
            this.setState({
                editItemActiveMenuIds: [...this.state.editItemActiveMenuIds, menuId]
            })
        }
    }

    saveUpdatedMenuItem = updatedMenuItem => {
        axios.put(`${API_BASE_URL}/menu_items/${updatedMenuItem.id}`, updatedMenuItem)
            .then(() => window.location.reload())
            .catch(err => console.log(err))
    }
    // TODO: move this to openMenuSection??
    runDeleteConfirmation = () => {
        this.setState({
            deleteButtonClicked: true
        })
    }

    deleteMenuItem = () => {
        axios.delete(`${API_BASE_URL}/menu_items/${this.state.menuItemBeingEdited.id}`)
            .then(res => {
                console.log('Item removed Res: ', res)
                this.clearModalState(true)
            })
            .catch(err => console.log(err))
    }
   
    openMenuSection = e => {
        let section = e.target.id
        let sectionState = ''
        switch(section) {
            case 'activateNewMenuForm' :
                sectionState = 'newMenuSectionActive'
                break
            case 'activateDeleteMenuForm' :
                sectionState = 'deleteMenuSectionActive'
                break
        }
        this.setState({
            [sectionState]: true
        })
    }

    // TODO: these menu add/delete funcs seem clunky. Think on better ways to handle deletion by id
    checkIfMenuExists = inputName => {
        const menuNameInputLower = this.state[inputName].trim().toLowerCase()
        for (let i = 0; i < this.state.menus.length; i++) {
            if (this.state.menus[i].name.trim().toLowerCase() === menuNameInputLower) {
                return [true, this.state.menus[i].id]
            }
        }
    }

    saveNewMenu = e => {
        e.preventDefault()
        console.log('saveNewMenu: ', this.checkIfMenuExists('newMenuInput'))
        if (this.state.newMenuInput === '') {
            <Alert color="info" style={{marginRight: "0", fontSize: ".85em"}}>Please enter the menu name.</Alert>
        } else if (this.checkIfMenuExists('newMenuInput') === undefined) {
            const menu = { name: this.state.newMenuInput }

            axios.post(`${API_BASE_URL}/menu`, menu)
                .then(res => {
                    this.setState({
                        newMenuSectionActive: false
                    }, () => window.location.reload())
                })
                .catch(err => console.log(err))
        } 
        else if (this.checkIfMenuExists('newMenuInput')[0]) {
            <Alert color="info" style={{marginRight: "0", fontSize: ".85em"}}>This menu doesn't exist. Please check your spelling.</Alert>
        }
    }

    deleteMenu = e => {
        e.preventDefault()
        if (this.state.deleteMenuInput === '') {
            <Alert color="info" style={{marginRight: "0", fontSize: ".85em"}}>Please enter the name of the menu you want to delete.</Alert>
        } else if (this.checkIfMenuExists('deleteMenuInput') === undefined) {
            <Alert color="info" style={{marginRight: "0", fontSize: ".85em"}}>This menu doesn't exist. Please check your spelling.</Alert>
        } else {
            const menuId = this.checkIfMenuExists('deleteMenuInput')[1]
           
            axios.delete(`${API_BASE_URL}/menu/${menuId}`)
                .then(res => {
                    this.setState({
                        deleteMenuSectionActive: false
                    }, () => window.location.reload())
                })
                .catch(err => console.log(err))
        }
    }

    // TODO: sort menu items 
    // sort_MenuItemName_AZ = () => {
    //     const menuItems = this.state.menuItems
    //     // for (let i = 0; i < menuItems.length; i++) {

    //     // }
    //     const sortedItems = menuItems.sort((a, b) => {
    //         const itemNameA = a.name.toLowerCase()
    //         const itemNameB = b.name.toLowerCase()
    //         if (itemNameA < itemNameB) return -1
    //         if (itemNameA > itemNameB) return 1
    //         return 0;
    //     })
    //     this.setState({
    //         menuItems: sortedItems
    //     })

    // }

    render() {
        console.log('Admin State: ', this.state)
        const menus = this.state.menus.map(menu => {
            return (
                <Link 
                    to={`/menu/${menu.id}`}
                    key={menu.id}
                >
                    <button className="menu-select-button">
                        {menu.name}
                    </button>
                </Link>
            )
        })

        // TODO: Should this be a method? Should I store filtered menus in state (I'm currenty not but it seems to work fine)
        const filteredMenuItems = this.state.menuItems.filter(item => {
            return item.name.toLowerCase().includes(this.state.filterInput.toLowerCase())
        })

        return (
            <div>
            {/* TODO: Move to new component */}
                <h2 className="mt-5">Menus</h2>
                <ul className="menu-list">
                    {menus}
                </ul>
                
                {this.state.newMenuSectionActive 
                    ?   <form id="add-new-menu-form">
                            <input 
                                type="text" 
                                id="newMenuInput" 
                                placeholder="Menu Name"
                                onChange={this.handleInputChange}
                                value={this.state.newMenuInput}
                                // required
                            />
                            <br />

                            <button 
                                onClick={this.saveNewMenu} 
                                type="submit"
                            >
                                Add Menu
                            </button>
                        </form>

                    :   <button 
                            id="activateNewMenuForm"
                            onClick={this.openMenuSection}
                        >
                            Create a New Menu
                        </button>
                }
                <br />

                {this.state.deleteMenuSectionActive 
                    ?   <form id="delete-menu-form">
                            <input 
                                type="text" 
                                id="deleteMenuInput" 
                                placeholder="Enter menu name and confirm"
                                onChange={this.handleInputChange}
                                value={this.state.deleteMenuInput}
                                // required
                            />
                            <br />
                            <button 
                                className="danger-btn"
                                onClick={this.deleteMenu} 
                            >
                                Confirm Menu Deletion
                            </button>
                        </form>

                    :   <button
                            className="danger-btn"
                            id="activateDeleteMenuForm"
                            onClick={this.openMenuSection}
                        >
                            Delete a Menu
                        </button>

                }
                
                
            {/* TODO: Move to new component */}
                <h2 className="mt-5">Menu Items</h2>
                <AddMenuItem
                    menus={this.state.menus}
                />
                <br />

                <label htmlFor="filterInput">Filter By Name</label>
                <input 
                    type="text" 
                    id="filterInput" 
                    onChange={this.handleInputChange}
                    value={this.state.input}
                />
                <br />

                {/* <Button
                    onClick={this.sort_MenuItemName_AZ}
                    className="sort-button"
                >
                    Sort A-Z
                </Button>
                <Button
                    onClick={this.sort_MenuItemName_ZA}
                    className="sort-button"
                >
                    Sort Z-A
                </Button> */}


                <EditMenuItemModal
                    menus={this.state.menus}
                    menuItemBeingEdited={this.state.menuItemBeingEdited}
                    editItemActiveMenuIds={this.state.editItemActiveMenuIds}
                    editItemNameInput={this.state.editItemNameInput}
                    editItemDescriptionInput={this.state.editItemDescriptionInput}
                    editItemCostInput={this.state.editItemCostInput}
                    modalActive={this.state.modalActive}
                    clearModalState={this.state.clearModalState}
                    handleInputChange={this.handleInputChange}
                    updateMenuItemState={this.updateMenuItemState}
                    clearModalState={this.clearModalState}
                    toggleMenuAssignment={this.toggleMenuAssignment}
                    deleteButtonClicked={this.state.deleteButtonClicked}
                    runDeleteConfirmation={this.runDeleteConfirmation}
                    deleteMenuItem={this.deleteMenuItem}
                />

                {/* <Modal isOpen={this.state.modalActive} toggle={this.clearModalState}>
                    <ModalHeader>
                        <span>Edit Menu Item:  &nbsp;</span>
                        {this.state.menuItemBeingEdited.name}
                    </ModalHeader>

                    <ModalBody>
                        <input
                            id="editItemNameInput"
                            type="text"
                            value={
                                this.state.editItemNameInput !== ''
                                    ? this.state.editItemNameInput
                                    : this.state.menuItemBeingEdited.name
                            }
                            onChange={this.handleInputChange}
                            className="mb-2"
                        />

                        <input 
                            id="editItemDescriptionInput"
                            type="text"
                            value={
                                this.state.editItemDescriptionInput !== ''
                                    ? this.state.editItemDescriptionInput
                                    : this.state.menuItemBeingEdited.description
                            }
                            onChange={this.handleInputChange}
                            className="mb-2"
                        />

                        <input 
                            id="editItemCostInput"
                            type="text"
                            value={
                                this.state.editItemCostInput !== ''
                                    ? this.state.editItemCostInput
                                    : this.state.menuItemBeingEdited.cost
                            }
                            onChange={this.handleInputChange}
                            className="mb-2"
                        />

                        <MenuAssignmentList 
                            className="menu-list"
                            menus={this.state.menus}
                            activeMenus={this.state.editItemActiveMenuIds}
                            toggleMenuAssignment={this.toggleMenuAssignment}
                            menuItemId={this.state.menuItemBeingEdited.id}
                        />  
                        
                    </ModalBody>

                    <ModalFooter>
                        <button onClick={this.updateMenuItemState}>
                            Save
                        </button>

                        <button onClick={() => this.clearModalState(null)}>
                            Cancel
                        </button>

                        <button 
                            className="danger-btn"
                            onClick={this.runDeleteConfirmation}
                        >
                            Delete Item
                        </button>
                        
                    </ModalFooter> 
                    
                    {this.state.deleteButtonClicked &&
                        <ModalFooter style={{display: "block"}}>
                            <Alert color="info" style={{marginRight: "0", fontSize: ".85em"}}>Are you sure?</Alert>
                            
                            <button 
                                className="danger-btn"
                                onClick={this.deleteMenuItem}
                                style={{marginLeft: "0"}}
                            >
                                Confirm Deletion
                            </button>
                        </ModalFooter>
                    }
                </Modal> */}

                <div className="card-container">
                    <MenuItem 
                        // TODO: should I be storing filtered items in state?
                        menuItems={
                            this.state.filterInput !== ''
                                ? filteredMenuItems
                                : this.state.menuItems
                        }
                        menus={this.state.menus} 
                        onClick={this.openEditMenuItemModal}
                    />
                </div>

            </div>
        )
    }
}

export default AdminDashboard