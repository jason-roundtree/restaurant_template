import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import AddMenuItem from './AddMenuItem';
import MenuAssignmentList from './MenuAssignmentList';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import './AdminDashboard.css';
// import '../index.css';
const axios = require('axios');
const { API_BASE_URL } = require('../config');

// TODO: 
// - setup sub-menu categories (e.g. Sandwiches, Pasta, Fish, etc) on front and back-end
// - setup input for comments/additional menu item info
// - create and re-use common components for both admin menu items and regular menu items
// - create separate components for different elements on this page
// - remove bootstrap from buttons and restyle 
// - move axios requests to their own module
// - Enhance input validation, check out libraries

class AdminDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [],
            menuItems: [],
            newMenuSectionActive: false,
            deleteMenuSectionActive: false,
            deleteMenuInput: '',

            newMenuInput: '',
            filterInput: '',
            modalActive: false,
            menuItemBeingEdited: {},
            editItemActiveMenuIds: [],
            editItemDescriptionInput: '',
            editItemCostInput: '',
            editItemNameInput: '',
            deleteButtonClicked: false
        }
    }
    
    componentDidMount() {
        // GET all menus
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

        // GET all menu items
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

    // TODO: Figure out how to allow inputs to be empty if everything is deleted before being edited
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
        const activeMenus = this.state.editItemActiveMenuIds
        if (activeMenus.includes(menuId)) {
            this.setState({
                editItemActiveMenuIds: this.state.editItemActiveMenuIds.filter(_menuId => _menuId !== menuId)
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
    // TODO: combine this and delete menu handler?
    activateNewMenuForm = () => {
        this.setState({
            newMenuSectionActive: true
        })
    }

    activateDeleteMenuForm = () => {
        this.setState({
            deleteMenuSectionActive: true
        })
    }
    // Checks existance of menus for deletion or addition of menus
    // TODO: these menu add/delete funcs seem clunky. Think on better ways to handle deletion by id
    checkIfMenuExists = inputName => {
        // console.log('inputName: ', inputName)
        const menuNameInputLower = this.state[inputName].trim().toLowerCase()
        // console.log('menuNameInputLower: ', menuNameInputLower)
        for (let i = 0; i < this.state.menus.length; i++) {
            // console.log('Loop menu: ', this.state.menus[i].name.trim().toLowerCase())
            if (this.state.menus[i].name.trim().toLowerCase() === menuNameInputLower) {
                return [true, this.state.menus[i].id]
            }
        }
    }

    saveNewMenu = () => {
        if (this.state.newMenuInput === '') {
            alert('Please enter the menu name.')
        } else if (this.checkIfMenuExists('newMenuInput')[0]) {
            alert('This menu already exists')
        } else {
            const menu = { name: this.state.newMenuInput }
            axios.post(`${API_BASE_URL}/menu`, menu)
                .then(res => {
                    this.setState({
                        newMenuSectionActive: false
                    }, () => window.location.reload())
                })
                .catch(err => console.log(err))
        }
    }

    deleteMenu = () => {
        console.log('del menu: ', this.checkIfMenuExists('deleteMenuInput'))
        if (this.state.deleteMenuInput === '') {
            alert('Please enter the name of the menu you want to delete.')
        } else if (this.checkIfMenuExists('deleteMenuInput') === undefined) {
            alert('This menu doesn\'t exist. Please check your spelling.')
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
                <Button 
                    to={`/menu/${menu.id}`} 
                    className="menu-select-button"
                    // I think this somehow lets <Button> act as <Link>
                    tag={Link} 
                    key={menu.id}
                >
                    {menu.name}
                </Button>
            )
        })

        // TODO: Should this be a method? Should I store filtered menus in state (I'm currenty not but it seems to work fine)
        const filteredMenuItems = this.state.menuItems.filter(item => {
            return item.name.toLowerCase().includes(this.state.filterInput.toLowerCase())
        })

        return (
            <div>
            {/* TODO: New component */}
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

                            <Button 
                                className="edit-menu"
                                onClick={this.saveNewMenu} 
                            >
                                Add Menu
                            </Button>
                        </form>

                    :   <Button 
                            color="primary"
                            onClick={this.activateNewMenuForm}
                        >
                            Create New Menu
                        </Button>
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
                            <Button 
                                color="danger"
                                onClick={this.deleteMenu} 
                            >
                                Confirm Menu Deletion
                            </Button>
                        </form>

                    :   <Button
                            color="primary"
                            onClick={this.activateDeleteMenuForm}
                        >
                            Delete a Menu
                        </Button>

                }
                
                
            {/* TODO: New component */}
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


                {/* TODO: Break this modal into a separate component along with input fields */}
                <Modal isOpen={this.state.modalActive}>
                    <ModalHeader >
                        Edit Menu Item: {this.state.menuItemBeingEdited.name}
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
                        <Button onClick={this.updateMenuItemState}>
                            Save
                        </Button>

                        <Button onClick={() => this.clearModalState(null)}>
                            Cancel
                        </Button>

                        <Button 
                            color="danger" 
                            onClick={this.runDeleteConfirmation}
                        >
                            Delete Item
                        </Button>
                        
                    </ModalFooter> 
                    
                    {this.state.deleteButtonClicked &&
                        <ModalFooter style={{display: "block"}}>
                            <p style={{marginRight: "0", fontSize: ".85em"}}>Are you sure?</p>
                            
                            <Button 
                                color="danger" 
                                onClick={this.deleteMenuItem}
                                style={{marginLeft: "0"}}
                            >
                                Confirm Deletion
                            </Button>
                        </ModalFooter>
                    }
                </Modal>

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