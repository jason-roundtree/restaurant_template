import React from 'react'
import { Link } from 'react-router-dom'
import AdminMenuItem from './AdminMenuItem'
import AddMenuItem from './AddMenuItem'
import EditMenuItemModal from './EditMenuItemModal'
import { Alert } from 'reactstrap'
import { sort_AtoZ, sort_ZtoA } from '../../utils/sorting'
const axios = require('axios');
const { API_BASE_URL } = require('../../config');

// TODO:
// - Enhance input validation, check out libraries
// - Audit for a11y and proper doc structure

// Post-MVP todos:
// - setup sub-menu categories and options (e.g. Sandwiches, Fish, Spiciness, Meat type) on front and back-end
// - setup input for comments/additional menu item info
// - move axios requests to their own module

export default class AdminDashboard extends React.Component {
    state = {
        menus: [],
        menuItems: [],
        filterInput: '',

        newMenuSectionActive: false,
        newMenuInput: '',
        deleteMenuSectionActive: false,
        deleteMenuInput: '',
        showAddMenuError: false,
        addMenuErrorMsg: '',
        showDeleteMenuError: false,
        deleteMenuErrorMsg: '',

        modalActive: false,
        menuItemBeingEdited: {},
        editItemActiveMenuIds: [],
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
                    menus: sort_AtoZ(menus)
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
                    menuItems: sort_AtoZ(menuItems)
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleEditMenuItemInputChange = e => {
        const { name, value } = e.target
        const updatedMenuItem = Object.assign({},
            this.state.menuItemBeingEdited,
            { [name]: value } 
        )
        this.setState({
            menuItemBeingEdited: updatedMenuItem
        })
    }

    handleInputChange = e => {
        const { id, value } = e.target
        this.setState({
            [id]: value
        })
    }

    updateMenuItemState = () => {
        const updatedMenuItem = Object.assign({},
            this.state.menuItemBeingEdited,
            { name: this.state.menuItemBeingEdited.name },
            { description: this.state.menuItemBeingEdited.description },
            { cost: this.state.menuItemBeingEdited.cost }, 
            { menus: this.state.editItemActiveMenuIds },
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
        if (this.state.newMenuInput === '') {
            this.setState({
                showAddMenuError: true,
                addMenuErrorMsg: 'Please enter the menu name.'
            })
        } 
        else if (this.checkIfMenuExists('newMenuInput') === undefined) {
            const menu = { name: this.state.newMenuInput }

            axios.post(`${API_BASE_URL}/menu`, menu)
                .then(res => {
                    this.setState({
                        showAddMenuError: false,
                        newMenuSectionActive: false
                    }, () => window.location.reload())
                })
                .catch(err => console.log(err))
        } 
        else if (this.checkIfMenuExists('newMenuInput')[0]) {
            this.setState({
                showAddMenuError: true,
                addMenuErrorMsg: 'This menu already exists.'
            })
        }
    }

    deleteMenu = e => {
        e.preventDefault()
        if (this.state.deleteMenuInput === '') {
            this.setState({ 
                showDeleteMenuError: true,
                deleteMenuErrorMsg: 'Please enter the name of the menu you want to delete.' 
            })
        } else if (this.checkIfMenuExists('deleteMenuInput') === undefined) {
            this.setState({ 
                showDeleteMenuError: true,
                deleteMenuErrorMsg: 'This menu doesn\'t exist. Please check your spelling.' 
            })
        } else {
            const menuId = this.checkIfMenuExists('deleteMenuInput')[1]
           
            axios.delete(`${API_BASE_URL}/menu/${menuId}`)
                .then(res => {
                    this.setState({
                        showDeleteMenuError: false,
                        deleteMenuSectionActive: false
                    }, () => window.location.reload())
                })
                .catch(err => console.log(err))
        }
    }

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
                    ?   <form id="add-new-menu-form" onSubmit={this.saveNewMenu}>
                            <input 
                                type="text" 
                                id="newMenuInput" 
                                placeholder="Menu Name"
                                onChange={this.handleInputChange}
                                value={this.state.newMenuInput}
                                // required
                            />
                            {this.state.showAddMenuError && 
                                <Alert color="info" className="admin-alert">{this.state.addMenuErrorMsg}</Alert>
                            }

                            <button className="add-remove-menu-btn">
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
                    ?   <form id="delete-menu-form" onSubmit={this.deleteMenu}>
                            <input 
                                type="text" 
                                id="deleteMenuInput" 
                                placeholder="Enter menu name and confirm"
                                onChange={this.handleInputChange}
                                value={this.state.deleteMenuInput}
                                // required
                            />
                            {this.state.showDeleteMenuError && 
                                <Alert color="info" className="admin-alert">{this.state.deleteMenuErrorMsg}</Alert>
                            }

                            <button className="danger-btn add-remove-menu-btn">
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
                    handleInputChange={this.handleEditMenuItemInputChange}
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
                    <AdminMenuItem 
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