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
// - allow deletion of menus
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
            newMenuInput: '',
            filterInput: '',
            modalActive: false,
            menuItemBeingEdited: {},
            editItemActiveMenuIds: [],
            editItemDescriptionInput: '',
            editItemCostInput: '',
            // editItemNameInput: ''
            
        }
    }
    
    componentDidMount() {
        // GET menus
        axios.get(`${API_BASE_URL}/menus`)
          .then(res => {
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
                console.log('data ', res.data)
                const menuItems = res.data.map(item => {
                    return {
                        name: item.name, 
                        description: item.description,
                        cost: item.cost,
                        menus: item.menus,
                        id: item._id
                    }
                })
                // console.log('menuItems ', menuItems)s
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

    updateMenuItemState = () => {
        const updatedMenuItem = Object.assign({},
            this.state.menuItemBeingEdited,
            { menus: this.state.editItemActiveMenuIds } 
        )
        this.setState({
            menuItemBeingEdited: updatedMenuItem
        }, () => {
            this.saveUpdatedMenuItemToDb(this.state.menuItemBeingEdited)
        })
    }

    openModal = itemId => {
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
    
    cancelAndCloseModal = () => {
        this.setState({
            modalActive: !this.state.modalActive,
            menuItemBeingEdited: {},
            editItemActiveMenuIds: [],
            editItemDescriptionInput: ''
        })
    }

    // This initializes and stores an array of active menus in state for the menu item being edited. I found it easier to do it this way than work with an array of menu objects in the 'menuItemBeingEdited:' state property when toggling active menus
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

    saveUpdatedMenuItemToDb = updatedMenuItem => {
        axios.put(`${API_BASE_URL}/menu_items/${updatedMenuItem.id}`, updatedMenuItem)
            .then(() => window.location.reload())
            .catch(err => console.log(err))
    }

    activateNewMenuForm = () => {
        this.setState({
            newMenuSectionActive: true
        })
    }

    saveNewMenu = () => {
        const menuNames = this.state.menus.map(menu => {
            return menu.name
        })
        if (this.state.newMenuInput === '') {
            alert('Please enter the menu name')
        } else if (menuNames.includes(this.state.newMenuInput.trim())) {
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

    render() {
        console.log('Admin State: ', this.state)
        const menus = this.state.menus.map(menu => {
            return (
                // TODO: how to incorporate React Router Link with his button or do I even need to? Seems to work fine even with match.params.id being passed down as props but I'm not sure about page reloading
                <Button 
                    to={`/menu/${menu.id}`} 
                    color="primary" 
                    className="menu-select-button"
                    tag={Link} 
                    key={menu.id}
                >
                    {menu.name}
                </Button>
            )
        })

        const filteredMenuItems = this.state.menuItems.filter(item => {
            return item.name.toLowerCase()
                            .includes(this.state.filterInput.toLowerCase())
        })

        return (
            <div>

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
                                required
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
                {/* TODO: Break this modal into a separate component */}
                <Modal isOpen={this.state.modalActive}>
                    <ModalHeader>
                        {this.state.menuItemBeingEdited.name}
                    </ModalHeader>
                    <ModalBody>
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
                        <Button onClick={this.cancelAndCloseModal}>
                            Cancel
                        </Button>
                        <Button color="danger">
                            Delete Item
                        </Button>
                    </ModalFooter> 
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
                        onClick={this.openModal}
                    />
                </div>

            </div>
        )
    }
}

export default AdminDashboard