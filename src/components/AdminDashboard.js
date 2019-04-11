import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import AddMenuItem from './AddMenuItem';
import { Button } from 'reactstrap';
// import './AdminDashboard.css';
// import '../index.css';
// TODO: change all requires to imports??
const axios = require('axios');
const { API_BASE_URL } = require('../config');

export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: [],
            menuItems: [],
            // filterInput: ''
        }
    }
    // TODO: Move axios requests to their own module
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
                const menuItems = res.data.map(item => {
                    return {
                        name: item.name, 
                        description: item.description,
                        cost: item.cost,
                        menus: item.menus,
                        editable: item.editable,
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
    
    handleFilterInputChange = e => {
        this.setState({
            filterInput: e.target.value
        })
    }

    updateMenuItemState = (updatedMenuItem, menuItemIndex) => {
        this.setState({
            menuItems: [
                ...this.state.menuItems.slice(0, menuItemIndex),
                updatedMenuItem,
                ...this.state.menuItems.slice(menuItemIndex + 1)
            ]
        }, () => {
            // TODO: this will send a request to update a menu item when the save button is selected but it doesn't test if the menuItem was actually updated. Maybe you can use prevState to check??
            if (this.state.menuItems[menuItemIndex].editable === false) {
                this.saveUpdatedMenuItemToDb(this.state.menuItems[menuItemIndex])
            }
        })
    }

    toggleMenuItemEditable = itemId => {
        const menus = this.state.menuItems
        for (let i = 0; i < menus.length; i++) {
            if (menus[i].id === itemId) {
                const updatedMenuItem = Object.assign({}, menus[i], {
                    editable: !menus[i].editable
                })
                this.updateMenuItemState(updatedMenuItem, i)
            }
        }
    }
    // TODO: Is there a better way to handle this with less code?
    handleMenuAssignment = (menuId, menuItemId) => {
        const menuItems = this.state.menuItems
        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].id === menuItemId) {
                if (menuItems[i].menus.includes(menuId)) {
                    const menusLessRemovedMenu = menuItems[i].menus.filter(menu => menu !== menuId)
                    const updatedMenuItem = Object.assign({}, menuItems[i], {
                        menus: menusLessRemovedMenu
                    })
                    this.updateMenuItemState(updatedMenuItem, i)
                } else {
                    const menusWithAddedMenu = [...menuItems[i].menus, menuId]
                    const updatedMenuItem = Object.assign({}, menuItems[i], {
                        menus: menusWithAddedMenu
                    })
                    this.updateMenuItemState(updatedMenuItem, i)
                }
            }
        }
    }

    saveUpdatedMenuItemToDb = updatedMenuItem => {
        axios.put(`${API_BASE_URL}/menu_items/${updatedMenuItem.id}`, updatedMenuItem)
            .catch(err => console.log(err))
    }

    render() {
        const menus = this.state.menus.map(menu => {
            return (
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

        // let filteredItems = this.state.menuItems.filter(item => {
        //     return item.name.toLowerCase().includes(this.state.filterInput.toLowerCase())
        // })
        
        return (
            <div>
                <h2 className="mt-5">Menus</h2>
                {/* <p><i>Select a menu to view</i></p> */}
                <ul className="menu-list">{menus}</ul>
                <Button color="primary">Create New Menu</Button>
                
                <h2 className="mt-5">Menu Items</h2>
                <AddMenuItem
                    menus={this.state.menus}
                />
                <br />

                <label htmlFor="filter">Filter By Name</label>
                <input 
                    type="text" 
                    id="filter" 
                    onChange={this.handleFilterInputChange}
                    value={this.state.input}
                />
                <div className="card-container">
                    <MenuItem 
                        menuItems={this.state.menuItems}
                        menus={this.state.menus} 
                        onClick={this.toggleMenuItemEditable}
                        handleMenuAssignment={this.handleMenuAssignment}
                    />
                </div>

            </div>
        )
    }
}